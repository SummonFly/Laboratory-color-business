using LaboratoryColor.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Product> Products { get; }
        DbSet<Category> Categories { get; }
        DbSet<Order> Orders { get; }
        DbSet<Supplier> Suppliers { get; }
        DbSet<PurchaseOrder> PurchaseOrders { get; }
        DbSet<Discount> Discounts { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
