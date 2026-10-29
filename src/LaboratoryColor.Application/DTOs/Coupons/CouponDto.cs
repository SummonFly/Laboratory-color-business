namespace LaboratoryColor.Application.DTOs.Coupons
{
    public class CouponDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int? UsageLimit { get; set; }
        public int UsedCount { get; set; }
        public string? UserId { get; set; }
        public bool IsActive { get; set; }
    }
}
