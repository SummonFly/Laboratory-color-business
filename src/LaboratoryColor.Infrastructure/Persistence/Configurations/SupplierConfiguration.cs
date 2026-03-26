using LaboratoryColor.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LaboratoryColor.Infrastructure.Persistence.Configurations
{
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            builder.ToTable("Suppliers");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.ContactPerson)
                .HasMaxLength(100);

            builder.Property(s => s.Email)
                .HasMaxLength(100);

            builder.OwnsOne(s => s.Phone, phone =>
            {
                phone.Property(p => p.Value)
                    .HasColumnName("Phone")
                    .HasMaxLength(20);
            });

            builder.Property(s => s.Address)
                .HasMaxLength(500);

            builder.Property(s => s.Inn)
                .HasMaxLength(12);

            builder.Property(s => s.BankDetails)
                .HasMaxLength(500);
        }
    }
}
