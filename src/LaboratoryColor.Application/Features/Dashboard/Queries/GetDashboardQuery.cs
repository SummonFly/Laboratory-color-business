using LaboratoryColor.Application.DTOs.Dashboard;
using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Dashboard.Queries
{
    public record GetDashboardQuery : IRequest<DashboardDto>
    {
        public int LowStockThreshold { get; init; } = 10;
        public int TopProductsCount { get; init; } = 5;
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
    }

    public class GetDashboardQueryHandler : IRequestHandler<GetDashboardQuery, DashboardDto>
    {
        private readonly IApplicationDbContext _context;

        public GetDashboardQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
        {
            var endDate = request.ToDate ?? DateTime.UtcNow;
            var startDate = request.FromDate ?? endDate.AddDays(-30);

            // 1. Stock Summary
            var products = await _context.Products.ToListAsync(cancellationToken);
            var totalStockValue = products.Sum(p => p.Price.Amount * p.CurrentStock);
            var lowStockCount = products.Count(p => p.CurrentStock <= request.LowStockThreshold);

            // 2. Sales Summary (заказы за период)
            var orders = await _context.Orders
                .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate && o.Status == OrderStatusEnum.Completed)
                .ToListAsync(cancellationToken);

            var totalOrders = orders.Count;
            var totalRevenue = orders.Sum(o => o.TotalAmount.Amount);
            var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // 3. Popular Products (из StockMovement с типом Sale)
            var popularProducts = await _context.StockMovements
                .Where(sm => sm.MovementType == StockMovementType.Sale &&
                             sm.CreatedAt >= startDate &&
                             sm.CreatedAt <= endDate)
                .GroupBy(sm => sm.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    QuantitySold = Math.Abs(g.Sum(x => x.Quantity))
                })
                .OrderByDescending(x => x.QuantitySold)
                .Take(request.TopProductsCount)
                .Join(_context.Products, x => x.ProductId, p => p.Id, (x, p) => new PopularProductDto
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    QuantitySold = x.QuantitySold,
                    Revenue = x.QuantitySold * p.Price.Amount
                })
                .ToListAsync(cancellationToken);

            // 4. Low Stock Products
            var lowStockProducts = products
                .Where(p => p.CurrentStock <= request.LowStockThreshold)
                .Select(p => new LowStockProductDto
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    CurrentStock = p.CurrentStock,
                    Threshold = request.LowStockThreshold
                })
                .ToList();

            // 5. Pending Purchase Orders
            var pendingPurchaseOrders = await _context.PurchaseOrders
                .CountAsync(po => po.Status == PurchaseOrderStatus.Pending, cancellationToken);

            return new DashboardDto
            {
                StockSummary = new StockSummaryDto
                {
                    TotalProducts = products.Count,
                    TotalStockValue = totalStockValue,
                    LowStockCount = lowStockCount
                },
                SalesSummary = new SalesSummaryDto
                {
                    TotalOrders = totalOrders,
                    TotalRevenue = totalRevenue,
                    AverageOrderValue = averageOrderValue
                },
                PopularProducts = popularProducts,
                LowStockProducts = lowStockProducts,
                PendingPurchaseOrders = pendingPurchaseOrders
            };
        }
    }
}
