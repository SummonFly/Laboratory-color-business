using LaboratoryColor.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LaboratoryColor.Infrastructure.Persistence.Configurations
{
    public class ImageConfiguration : IEntityTypeConfiguration<Image>
    {
        public void Configure(EntityTypeBuilder<Image> builder)
        {
            builder.ToTable("Images");

            builder.HasKey(i => i.Id);

            builder.Property(i => i.FileName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(i => i.FilePath)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(i => i.ThumbnailPath)
                .HasMaxLength(500);

            builder.Property(i => i.AltText)
                .HasMaxLength(100);

            // Связь с Product
            builder.HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);


            //// Связь с News
            //builder.HasOne(i => i.News)
            //    .WithMany(n => n.Images)
            //    .HasForeignKey(i => i.NewsId)
            //    .HasPrincipalKey(n => n.Id)  
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
