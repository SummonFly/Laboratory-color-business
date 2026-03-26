using LaboratoryColor.Domain.Common;

namespace LaboratoryColor.Domain.Entities
{
    public class AttributeValue : BaseEntity
    {
        public string Value { get; private set; }
        public int ProductAttributeId { get; private set; }
        public ProductAttribute ProductAttribute { get; private set; }

        private readonly List<Product> _products = new();
        public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

        private AttributeValue() { }

        public AttributeValue(string value, ProductAttribute attribute)
        {
            Value = value;
            ProductAttribute = attribute;
        }

        public void AssignToProduct(Product product)
        {
            _products.Add(product);
        }
    }
}
