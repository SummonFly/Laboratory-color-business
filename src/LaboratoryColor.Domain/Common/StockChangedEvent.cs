using LaboratoryColor.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaboratoryColor.Domain.Common
{
    public class StockChangedEvent : IDomainEvent
    {
        public StockChangedEvent(int id, int quantityChange, int currentStock)
        {
            ProductId = id;
            QuantityChange = quantityChange;
            MovementType = StockMovementType.Transfer;
        }

        public StockChangedEvent(int id, int quantityChange, StockMovementType movementType, string? reason)
        {
            ProductId = id;
            QuantityChange = quantityChange;
            MovementType = movementType;
            Reason = reason;
        }

        public int ProductId { get; }
        public int QuantityChange { get; }
        public int NewStock { get; }
        public StockMovementType MovementType { get; }
        public DateTime OccurredOn { get; }
        public string? Reason { get; }
    }
}
