using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Infrastructure.Identity;
using LaboratoryColor.Infrastructure.Simulation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace LaboratoryColor.Infrastructure.Background
{
    public class SimulationHostedService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ISimulationLogger _logger;
        private readonly SimulationConfig _config;
        private Timer? _orderTimer;
        private Timer? _receiveTimer;
        private bool _isRunning;

        public bool IsRunning => _isRunning;

        public SimulationHostedService(
            IServiceScopeFactory scopeFactory,
            ISimulationLogger logger,
            SimulationConfig config)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
            _config = config;
        }

        public void Start()
        {
            _logger.Log($"Start() called. Order interval: {_config.OrderGenerationIntervalSeconds} sec", "DEBUG");

            if (_isRunning) return;
            _isRunning = true;
            _logger.Log("Simulation started", "INFO");

            _orderTimer = new Timer(GenerateOrderCallback, null,
                TimeSpan.FromSeconds(5),
                TimeSpan.FromSeconds(_config.OrderGenerationIntervalSeconds));

            _receiveTimer = new Timer(CheckPendingOrdersCallback, null,
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(_config.AutoReceiveIntervalSeconds));
        }

        public void Stop()
        {
            if (!_isRunning) return;
            _isRunning = false;
            _logger.Log("Simulation stopped", "INFO");

            _orderTimer?.Dispose();
            _receiveTimer?.Dispose();
        }

        private async void GenerateOrderCallback(object? state)
        {
            _logger.Log($"GenerateOrderCallback called. IsEnabled={_config.IsEnabled}, IsRunning={_isRunning}", "DEBUG");

            if (!_config.IsEnabled || !_isRunning) return;

            var random = new Random();
            var probability = random.Next(100);
            _logger.Log($"Probability check: {probability} >= {_config.ProbabilityPercent} ?", "DEBUG");

            if (probability >= _config.ProbabilityPercent)
            {
                _logger.Log($"Skipped due to probability (needs < {_config.ProbabilityPercent})", "DEBUG");
                return;
            }

            _logger.Log("Starting order generation...", "INFO");

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var logger = scope.ServiceProvider.GetRequiredService<ISimulationLogger>();
            var generator = new OrderGenerator(context, userManager, _config);

            try
            {
                await generator.GenerateRandomOrder(_logger, CancellationToken.None);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error generating order: {ex.Message}", "ERROR");
            }
        }

        private async void CheckPendingOrdersCallback(object? state)
        {
            if (!_config.IsEnabled || !_isRunning) return;

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

            // Проверка low-stock и создание заказов поставщикам
            await CheckLowStockAndReorder(context);

            // Проверка поставок для автоматического приема
            await AutoReceivePurchaseOrders(context);
        }

        private async Task CheckLowStockAndReorder(IApplicationDbContext context)
        {
            _logger.Log($"CheckLowStockAndReorder called. Threshold={_config.LowStockThreshold}", "DEBUG");

            var lowStockProducts = await context.Products
                .Where(p => p.CurrentStock <= _config.LowStockThreshold)
                .ToListAsync();

            _logger.Log($"Found {lowStockProducts.Count} products with low stock", "DEBUG");

            foreach (var product in lowStockProducts)
            {
                var hasPendingOrderForProduct = await context.PurchaseOrders
                    .Where(po => (po.Status == PurchaseOrderStatus.Pending || po.Status == PurchaseOrderStatus.Shipped))
                    .SelectMany(po => po.Items)
                    .AnyAsync(item => item.ProductId == product.Id);


                if (hasPendingOrderForProduct) continue;

                var supplier = await context.Suppliers.FindAsync(_config.DefaultSupplierId);
                if (supplier == null)
                {
                    _logger.Log($"Supplier with ID {_config.DefaultSupplierId} not found!", "ERROR");
                    continue;
                }

                var orderNumber = $"AUTO-{DateTime.Now:yyyyMMddHHmmss}";
                var purchaseOrder = new PurchaseOrder(supplier, orderNumber);
                purchaseOrder.AddItem(product, _config.DefaultOrderQuantity, product.Price);
                purchaseOrder.SetExpectedDeliveryDate(DateTime.UtcNow.AddDays(_config.DefaultDeliveryDays));

                context.PurchaseOrders.Add(purchaseOrder);
                await context.SaveChangesAsync(CancellationToken.None);

                _logger.Log($"Low stock alert: '{product.Name}' (stock={product.CurrentStock}) → created PurchaseOrder #{purchaseOrder.Id} for {_config.DefaultOrderQuantity} units", "AUTO_ORDER");
            }
        }

        private async Task AutoReceivePurchaseOrders(IApplicationDbContext context)
        {
            var readyToReceive = await context.PurchaseOrders
                .Where(po => (po.Status == PurchaseOrderStatus.Pending || po.Status == PurchaseOrderStatus.Shipped) &&
                             po.ExpectedDeliveryDate <= DateTime.UtcNow)
                .Include(po => po.Items)
                .ToListAsync();

            _logger.Log($"AutoReceivePurchaseOrders readyToReceive{readyToReceive.Count()}", "DEBUG");

            foreach (var purchaseOrder in readyToReceive)
            {
                foreach (var item in purchaseOrder.Items)
                {
                    var product = await context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        var receiveQuantity = item.Quantity - item.ReceivedQuantity;
                        if (receiveQuantity > 0)
                        {
                            item.Receive(receiveQuantity);
                            product.UpdateStock(receiveQuantity);

                            var stockMovement = new StockMovement(
                                product,
                                receiveQuantity,
                                StockMovementType.Purchase,
                                purchaseOrder.Id,
                                $"Auto-received from PurchaseOrder #{purchaseOrder.Id}",
                                null);
                            context.StockMovements.Add(stockMovement);
                        }
                    }
                }

                purchaseOrder.UpdateStatus(PurchaseOrderStatus.Received);
                await context.SaveChangesAsync(CancellationToken.None);
                _logger.Log($"Auto-received PurchaseOrder #{purchaseOrder.Id} - {purchaseOrder.Items.Count} items added to stock", "AUTO_RECEIVE");
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
