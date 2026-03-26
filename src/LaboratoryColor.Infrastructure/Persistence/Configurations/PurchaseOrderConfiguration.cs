using LaboratoryColor.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace LaboratoryColor.Infrastructure.Persistence.Configurations
{
    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
        {
            builder.ToTable("PurchaseOrders");

            builder.HasKey(po => po.Id);

            builder.Property(po => po.OrderNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(po => po.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            builder.Property(po => po.OrderedDate)
                .IsRequired();

            builder.Property(po => po.ExpectedDeliveryDate)
                .IsRequired(false);

            builder.Property(po => po.ActualDeliveryDate)
                .IsRequired(false);

            builder.Property(po => po.Notes)
                .HasMaxLength(500);

            // Настройка Money (TotalAmount)
            builder.OwnsOne(po => po.TotalAmount, money =>
            {
                money.Property(m => m.Amount)
                    .HasColumnName("TotalAmount")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                money.Property(m => m.Currency)
                    .HasColumnName("TotalAmountCurrency")
                    .HasMaxLength(3)
                    .HasDefaultValue("RUB");
            });

            // Связь с Supplier
            builder.HasOne(po => po.Supplier)
                .WithMany(s => s.PurchaseOrders)
                .HasForeignKey(po => po.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // Связь с PurchaseOrderItems
            builder.HasMany(po => po.Items)
                .WithOne(poi => poi.PurchaseOrder)
                .HasForeignKey(poi => poi.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
