using LaboratoryColor.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace LaboratoryColor.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; private set; }
        public string? Description { get; private set; }
        public string? ImageUrl { get; private set; }

        private readonly List<Product> _products = new();
        public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

        public Category(string name)
        {
            Name = name;
        }

        public void UpdateDescription(string? description)
        {
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
