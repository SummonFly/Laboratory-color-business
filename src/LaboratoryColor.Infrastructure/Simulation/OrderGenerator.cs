using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Infrastructure.Simulation
{
    public class OrderGenerator
    {
        private readonly IApplicationDbContext _context;
        private readonly SimulationConfig _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly Random _random = new();


        public OrderGenerator(
            IApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SimulationConfig config)
        {
            _context = context;
            _userManager = userManager;
            _config = config;
        }

        public async Task<int?> GenerateRandomOrder(ISimulationLogger logger, CancellationToken ct)
        {
            // Получить тестовых пользователей
            var simulationUsers = await GetSimulationUsers(ct);
            if (!simulationUsers.Any())
            {
                logger.Log("No simulation users found. Run /api/dev/seed-test-data first", "WARN");
                return null;
            }

            // Получить товары с достаточным остатком
            var products = await _context.Products
                .Where(p => p.CurrentStock > 0)
                .ToListAsync(ct);

            if (!products.Any())
            {
                logger.Log("No products with stock available", "WARN");
                return null;
            }

            // Сколько товаров в заказе
            var itemCount = _random.Next(_config.MinItemsPerOrder, _config.MaxItemsPerOrder + 1);
            var selectedProducts = products.OrderBy(x => _random.Next()).Take(itemCount).ToList();

            

            // Создаем заказ
            var randomUser = simulationUsers[_random.Next(simulationUsers.Count)];
            var order = new Order(
                customerName: randomUser.UserName,
                customerPhone: $"+7 999 {_random.Next(1000000, 9999999)}",
                customerEmail: randomUser.Email);

            foreach (var product in selectedProducts)
            {
                var quantity = _random.Next(1, Math.Min(_config.DefaultOrderQuantity, product.CurrentStock + 1));
                if (quantity <= 0) continue;

                order.AddItem(product, quantity);
                product.UpdateStock(-quantity);

                var stockMovement = new StockMovement(
                    product,
                    -quantity,
                    StockMovementType.Sale,
                    null,
                    $"Simulated order for {randomUser.UserName}",
                    null);
                _context.StockMovements.Add(stockMovement);
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(ct);

            logger.Log($"Generated Order #{order.Id} for {randomUser.UserName} with {itemCount} items, total: {order.TotalAmount.Amount:C}");

            return order.Id;
        }

        private async Task<List<(string UserName, string Email)>> GetSimulationUsers(CancellationToken ct)
        {
            var users = await _userManager.Users
                .Where(u => u.UserName != null && u.UserName.StartsWith("sim_"))
                .Select(u => new { u.UserName, u.Email })
                .ToListAsync(ct);

            return users.Select(u => (u.UserName ?? "unknown", u.Email ?? "unknown@test.com")).ToList();
        }
    }
}