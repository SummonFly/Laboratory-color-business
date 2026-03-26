using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;
using LaboratoryColor.Domain.ValueObjects;

namespace LaboratoryColor.Domain.Entities
{
    public class PurchaseOrder : BaseEntity
    {
        public int SupplierId { get; private set; }
        public Supplier Supplier { get; private set; }
        public string OrderNumber { get; private set; }
        public PurchaseOrderStatus Status { get; private set; } = PurchaseOrderStatus.Pending;
        public DateTime OrderedDate { get; private set; }
        public DateTime? ExpectedDeliveryDate { get; private set; }
        public DateTime? ActualDeliveryDate { get; private set; }
        public Money TotalAmount { get; private set; }
        public string? Notes { get; private set; }

        private readonly List<PurchaseOrderItem> _items = new();
        public IReadOnlyCollection<PurchaseOrderItem> Items => _items.AsReadOnly();

        private PurchaseOrder() { }

        public PurchaseOrder(Supplier supplier, string orderNumber)
        {
            Supplier = supplier;
            SupplierId = supplier.Id;
            OrderNumber = orderNumber;
            OrderedDate = DateTime.UtcNow;
            TotalAmount = new Money(0);
        }

        public void AddItem(Product product, int quantity, Money unitPrice)
        {
            var item = new PurchaseOrderItem(product.Id, quantity, unitPrice, this);
            _items.Add(item);
            RecalculateTotal();
        }

        public void UpdateStatus(PurchaseOrderStatus newStatus)
        {
            Status = newStatus;

            if (newStatus == PurchaseOrderStatus.Received)
                ActualDeliveryDate = DateTime.UtcNow;

            UpdatedAt = DateTime.UtcNow;
        }

        public void SetExpectedDeliveryDate(DateTime date)
        {
            ExpectedDeliveryDate = date;
            UpdatedAt = DateTime.UtcNow;
        }

        public void ReceiveItem(int productId, int receivedQuantity)
        {
            var item = _items.FirstOrDefault(i => i.ProductId == productId);
            if (item == null)
                throw new DomainException($"Product {productId} not found in order");

            item.Receive(receivedQuantity);

            if (_items.All(i => i.IsFullyReceived))
                UpdateStatus(PurchaseOrderStatus.Received);
        }

        private void RecalculateTotal()
        {
            var total = _items.Sum(i => i.TotalAmount.Amount);
            TotalAmount = new Money(total);
        }
    }
}
