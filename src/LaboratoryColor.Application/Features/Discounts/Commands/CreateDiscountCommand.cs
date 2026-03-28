using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Enums;
using MediatR;

namespace LaboratoryColor.Application.Features.Discounts.Commands
{
    public record CreateDiscountCommand : IRequest<int>
    {
        public string Name { get; init; }
        public string? Description { get; init; }
        public DiscountType DiscountType { get; init; }
        public decimal DiscountValue { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
        public int Priority { get; init; } = 0;
        public List<DiscountRuleCommand> Rules { get; init; } = new();
        public List<CouponCommand> Coupons { get; init; } = new();
    }

    public record DiscountRuleCommand
    {
        public DiscountRuleType RuleType { get; init; }
        public string RuleValue { get; init; }
    }

    public record CouponCommand
    {
        public string Code { get; init; }
        public int? UsageLimit { get; init; }
        public string? UserId { get; init; }
    }

    public class CreateDiscountCommandHandler : IRequestHandler<CreateDiscountCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateDiscountCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateDiscountCommand request, CancellationToken cancellationToken)
        {
            var discount = new Discount(
                request.Name,
                request.DiscountType,
                request.DiscountValue,
                request.StartDate,
                request.EndDate);

            // Добавляем правила
            foreach (var rule in request.Rules)
            {
                discount.AddRule(rule.RuleType, rule.RuleValue);
            }

            // Добавляем промокоды
            foreach (var coupon in request.Coupons)
            {
                discount.AddCoupon(coupon.Code, coupon.UsageLimit);
                if (!string.IsNullOrEmpty(coupon.UserId))
                {
                    // Привязка к пользователю (можно добавить метод)
                }
            }

            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync(cancellationToken);

            return discount.Id;
        }
    }
}
