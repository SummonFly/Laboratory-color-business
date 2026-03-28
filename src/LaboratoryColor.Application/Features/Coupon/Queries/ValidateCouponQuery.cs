using LaboratoryColor.Application.DTOs.Discounts;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Coupon.Queries
{
    public record ValidateCouponQuery : IRequest<CouponValidationResultDto>
    {
        public string Code { get; init; }
        public string? UserId { get; init; }
        public decimal? OrderTotal { get; init; }
    }

    public class CouponValidationResultDto
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public DiscountDto? Discount { get; set; }
        public decimal? DiscountAmount { get; set; }
    }

    public class ValidateCouponQueryHandler : IRequestHandler<ValidateCouponQuery, CouponValidationResultDto>
    {
        private readonly IApplicationDbContext _context;

        public ValidateCouponQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CouponValidationResultDto> Handle(ValidateCouponQuery request, CancellationToken cancellationToken)
        {
            var coupon = await _context.Coupons
                .Include(c => c.Discount)
                .ThenInclude(d => d.Rules)
                .FirstOrDefaultAsync(c => c.Code == request.Code.ToUpper(), cancellationToken);

            if (coupon == null)
                return new CouponValidationResultDto { IsValid = false, Message = "Coupon not found" };

            if (!coupon.IsValid())
                return new CouponValidationResultDto { IsValid = false, Message = "Coupon is not valid" };

            if (!string.IsNullOrEmpty(coupon.UserId) && coupon.UserId != request.UserId)
                return new CouponValidationResultDto { IsValid = false, Message = "Coupon is not valid for this user" };

            var discount = coupon.Discount;

            // Проверка правил
            foreach (var rule in discount.Rules)
            {
                if (rule.RuleType == Domain.Enums.DiscountRuleType.TotalAmount && request.OrderTotal.HasValue)
                {
                    if (!decimal.TryParse(rule.RuleValue, out var minAmount))
                        continue;

                    if (request.OrderTotal.Value < minAmount)
                        return new CouponValidationResultDto
                        {
                            IsValid = false,
                            Message = $"Minimum order amount is {minAmount}"
                        };
                }
            }

            var discountAmount = discount.DiscountType == Domain.Enums.DiscountType.Percentage
                ? (request.OrderTotal ?? 0) * discount.DiscountValue / 100
                : discount.DiscountValue;

            return new CouponValidationResultDto
            {
                IsValid = true,
                Discount = new DiscountDto
                {
                    Id = discount.Id,
                    Name = discount.Name,
                    DiscountType = discount.DiscountType.ToString(),
                    DiscountValue = discount.DiscountValue
                },
                DiscountAmount = discountAmount
            };
        }
    }
}
