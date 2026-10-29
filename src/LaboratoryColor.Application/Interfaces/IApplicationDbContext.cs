using LaboratoryColor.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Product> Products { get; }
        DbSet<Category> Categories { get; }
        DbSet<Order> Orders { get; }
        DbSet<OrderItem> OrderItems { get; }
        DbSet<Supplier> Suppliers { get; }
        DbSet<PurchaseOrder> PurchaseOrders { get; }
        DbSet<PurchaseOrderItem> PurchaseOrderItems { get; }
        DbSet<StockMovement> StockMovements { get; }
        DbSet<Discount> Discounts { get; }
        DbSet<DiscountRule> DiscountRules { get; }
        DbSet<Coupon> Coupons { get; }
        //DbSet<Image> Images { get; }
        //DbSet<News> News { get; }
        //DbSet<ProductAttribute> ProductAttributes { get; }
        //DbSet<AttributeValue> AttributeValues { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
