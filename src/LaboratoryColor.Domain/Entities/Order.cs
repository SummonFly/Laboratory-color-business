using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.ValueObjects;

namespace LaboratoryColor.Domain.Entities
{
    public class Order : BaseEntity
    {
        public OrderStatusEnum Status { get; private set; } = OrderStatusEnum.New;
        public string CustomerName { get; private set; }
        public PhoneNumber CustomerPhone { get; private set; }
        public string? CustomerEmail { get; private set; }
        public string? Comment { get; private set; }
        public string? UserId { get; private set; }
        public Money TotalAmount { get; private set; }

        private readonly List<OrderItem> _orderItems = new();
        public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

        private Order() { }

        public Order(string customerName, string customerPhone, string? customerEmail = null)
        {
            CustomerName = customerName;
            CustomerPhone = new PhoneNumber(customerPhone);
            CustomerEmail = customerEmail;
            TotalAmount = new Money(0);
        }

        public void AddItem(Product product, int quantity)
        {
            var orderItem = new OrderItem(product.Id, quantity, product.Price);
            _orderItems.Add(orderItem);
            RecalculateTotal();
        }

        public void UpdateStatus(OrderStatusEnum newStatus)
        {
            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;
        }

        private void RecalculateTotal()
        {
            var total = _orderItems.Sum(item => item.UnitPrice.Amount * item.Quantity);
            TotalAmount = new Money(total);
        }
    }
}
