using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;

namespace LaboratoryColor.Domain.Entities
{
    public class StockMovement : BaseEntity
    {
        public int ProductId { get; private set; }
        public Product Product { get; private set; }
        public int Quantity { get; private set; } // положительное = приход, отрицательное = расход
        public StockMovementType MovementType { get; private set; }
        public int? ReferenceId { get; private set; } // ID PurchaseOrder или Order
        public string? Reason { get; private set; }
        public string? CreatedBy { get; private set; } // UserId

        private StockMovement() { }

        public StockMovement(Product product, int quantity, StockMovementType type, int? referenceId = null, string? reason = null, string? createdBy = null)
        {
            if (quantity == 0)
                throw new DomainException("Quantity cannot be zero");

            Product = product;
            ProductId = product.Id;
            Quantity = quantity;
            MovementType = type;
            ReferenceId = referenceId;
            Reason = reason;
            CreatedBy = createdBy;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
