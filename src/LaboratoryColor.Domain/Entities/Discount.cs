using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;

namespace LaboratoryColor.Domain.Entities
{
    public class Discount : BaseEntity
    {
        public string Name { get; private set; }
        public string? Description { get; private set; }
        public DiscountType DiscountType { get; private set; }
        public decimal DiscountValue { get; private set; } // 10 для 10% или 500 для фикс
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public bool IsActive { get; private set; }
        public int Priority { get; private set; } = 0; // чем выше, тем приоритетнее

        private readonly List<DiscountRule> _rules = new();
        public IReadOnlyCollection<DiscountRule> Rules => _rules.AsReadOnly();

        private readonly List<Coupon> _coupons = new();
        public IReadOnlyCollection<Coupon> Coupons => _coupons.AsReadOnly();

        private Discount() { }

        public Discount(string name, DiscountType type, decimal value, DateTime startDate, DateTime endDate)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new DomainException("Discount name is required");
            if (value <= 0)
                throw new DomainException("Discount value must be positive");
            if (startDate >= endDate)
                throw new DomainException("Start date must be before end date");

            Name = name;
            DiscountType = type;
            DiscountValue = value;
            StartDate = startDate;
            EndDate = endDate;
            IsActive = true;
        }

        public void AddRule(DiscountRuleType ruleType, string ruleValue)
        {
            _rules.Add(new DiscountRule(this, ruleType, ruleValue));
        }

        public void AddCoupon(string code, int? usageLimit = null)
        {
            _coupons.Add(new Coupon(this, code, usageLimit));
        }

        public bool IsValidForDate(DateTime date)
        {
            return IsActive && date >= StartDate && date <= EndDate;
        }

        public void Activate()
        {
            IsActive = true;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }

        public decimal Apply(decimal originalPrice)
        {
            return DiscountType == DiscountType.Percentage
                ? originalPrice * (1 - DiscountValue / 100)
                : Math.Max(0, originalPrice - DiscountValue);
        }
    }
}
