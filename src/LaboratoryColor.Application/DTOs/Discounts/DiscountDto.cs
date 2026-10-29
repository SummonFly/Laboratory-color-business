using LaboratoryColor.Application.DTOs.Coupons;

namespace LaboratoryColor.Application.DTOs.Discounts
{
    public class DiscountDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string DiscountType { get; set; } // Percentage, FixedAmount
        public decimal DiscountValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public int Priority { get; set; }
        public List<DiscountRuleDto> Rules { get; set; } = new();
        public List<CouponDto> Coupons { get; set; } = new();
    }
}
