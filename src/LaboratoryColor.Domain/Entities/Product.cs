using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;
using LaboratoryColor.Domain.ValueObjects;

namespace LaboratoryColor.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; private set; }
        public string? Description { get; private set; }
        public Money Price { get; private set; }
        public string? MainImageUrl { get; private set; }

        private int _currentStock;
        public int CurrentStock => _currentStock;

        public int CategoryId { get; private set; }
        public Category? Category { get; private set; }

        private readonly List<Image> _images = new();
        public IReadOnlyCollection<Image> Images => _images.AsReadOnly();

        private readonly List<AttributeValue> _attributeValues = new();
        public IReadOnlyCollection<AttributeValue> AttributeValues => _attributeValues.AsReadOnly();

        private readonly List<OrderItem> _orderItems = new();
        public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

        private Product() { }

        public Product(string name, decimal price, int categoryId)
        {
            Name = name;
            Price = new Money(price);
            CategoryId = categoryId;
        }

        public void UpdateStock(int quantityChange, StockMovementType movementType, string? reason = null)
        {
            if (_currentStock + quantityChange < 0)
                throw new DomainException($"Insufficient stock. Current: {_currentStock}, Attempted to remove: {-quantityChange}");

            _currentStock += quantityChange;
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new StockChangedEvent(Id, quantityChange, movementType, reason));
        }

        public void UpdateDescription(string description)
        {
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdatePrice(decimal newPrice)
        {
            Price = new Money(newPrice);
            UpdatedAt = DateTime.UtcNow;
        }

        public void AddImage(Image image)
        {
            _images.Add(image);
        }


        public void AddOrderItem(OrderItem item)
        {
            _orderItems.Add(item);
        }
    }
}
