using LaboratoryColor.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace LaboratoryColor.Infrastructure.Persistence.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(o => o.Id);

            builder.Property(o => o.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            builder.Property(o => o.CustomerName)
                .IsRequired()
                .HasMaxLength(100);

            // Настройка Value Object PhoneNumber
            builder.OwnsOne(o => o.CustomerPhone, phone =>
            {
                phone.Property(p => p.Value)
                    .HasColumnName("CustomerPhone")
                    .IsRequired()
                    .HasMaxLength(20);
            });

            builder.Property(o => o.CustomerEmail)
                .HasMaxLength(100);

            builder.Property(o => o.Comment)
                .HasMaxLength(500);

            builder.Property(o => o.UserId)
                .HasMaxLength(450);

            // Настройка Money
            builder.OwnsOne(o => o.TotalAmount, money =>
            {
                money.Property(m => m.Amount)
                    .HasColumnName("TotalAmount")
                    .HasColumnType("decimal(18,2)");

                money.Property(m => m.Currency)
                    .HasColumnName("TotalAmountCurrency")
                    .HasMaxLength(3)
                    .HasDefaultValue("RUB");
            });

            // Связь с OrderItems
            builder.HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
