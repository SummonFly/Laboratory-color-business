using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Exceptions;

namespace LaboratoryColor.Domain.Entities
{
    public class Coupon : BaseEntity
    {
        public int DiscountId { get; private set; }
        public Discount Discount { get; private set; }
        public string Code { get; private set; }
        public int? UsageLimit { get; private set; }
        public int UsedCount { get; private set; }
        public string? UserId { get; private set; } // если привязан к конкретному пользователю
        public bool IsActive { get; private set; } = true;

        private Coupon() { }

        public Coupon(Discount discount, string code, int? usageLimit = null, string? userId = null)
        {
            Discount = discount;
            DiscountId = discount.Id;
            Code = code.ToUpper();
            UsageLimit = usageLimit;
            UserId = userId;
        }

        public bool IsValid()
        {
            if (!IsActive) return false;
            if (!Discount.IsValidForDate(DateTime.UtcNow)) return false;
            if (UsageLimit.HasValue && UsedCount >= UsageLimit.Value) return false;
            return true;
        }

        public void Use()
        {
            if (!IsValid())
                throw new DomainException("Coupon is not valid");

            UsedCount++;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
