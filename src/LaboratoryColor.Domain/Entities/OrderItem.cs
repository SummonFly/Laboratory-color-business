using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.ValueObjects;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaboratoryColor.Domain.Entities
{
    public class OrderItem : BaseEntity
    {
        public int Quantity { get; private set; }
        public Money UnitPrice { get; private set; }
        public int OrderId { get; private set; }
        public int ProductId { get; private set; }
        public Order Order { get; private set; }
        public Product Product { get; private set; }

        private OrderItem() { }

        public OrderItem(int productId, int quantity, Money unitPrice)
        {
            ProductId = productId;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }

        public Money GetTotal() => UnitPrice.Multiply(Quantity);
    }
}
