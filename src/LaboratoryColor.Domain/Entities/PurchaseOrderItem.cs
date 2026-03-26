using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Exceptions;
using LaboratoryColor.Domain.ValueObjects;

namespace LaboratoryColor.Domain.Entities
{
    public class PurchaseOrderItem : BaseEntity
    {
        public int PurchaseOrderId { get; private set; }
        public PurchaseOrder PurchaseOrder { get; private set; }
        public int ProductId { get; private set; }
        public Product Product { get; private set; }
        public int Quantity { get; private set; }
        public Money UnitPrice { get; private set; }
        public int ReceivedQuantity { get; private set; }
        public Money TotalAmount => UnitPrice.Multiply(Quantity);
        public bool IsFullyReceived => ReceivedQuantity >= Quantity;

        private PurchaseOrderItem() { }

        public PurchaseOrderItem(int productId, int quantity, Money unitPrice, PurchaseOrder order)
        {
            ProductId = productId;
            Quantity = quantity;
            UnitPrice = unitPrice;
            PurchaseOrder = order;
            ReceivedQuantity = 0;
        }

        public void Receive(int quantity)
        {
            if (ReceivedQuantity + quantity > Quantity)
                throw new DomainException($"Cannot receive more than ordered. Ordered: {Quantity}, Already received: {ReceivedQuantity}");

            ReceivedQuantity += quantity;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
