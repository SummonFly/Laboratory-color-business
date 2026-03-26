using LaboratoryColor.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace LaboratoryColor.Domain.Entities
{
    public class ProductAttribute : BaseEntity
    {
        public string Name { get; private set; }
        private readonly List<AttributeValue> _attributeValues = new();
        public IReadOnlyCollection<AttributeValue> AttributeValues => _attributeValues.AsReadOnly();

        private ProductAttribute() { }

        public ProductAttribute(string name)
        {
            Name = name;
        }

        public void AddValue(string value)
        {
            _attributeValues.Add(new AttributeValue(value, this));
        }
    }
}
