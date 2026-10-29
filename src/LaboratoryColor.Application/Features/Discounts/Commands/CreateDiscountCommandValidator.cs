using FluentValidation;
using LaboratoryColor.Domain.Enums;

namespace LaboratoryColor.Application.Features.Discounts.Commands
{
    public class CreateDiscountCommandValidator : AbstractValidator<CreateDiscountCommand>
    {
        public CreateDiscountCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Discount name is required")
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

            RuleFor(x => x.DiscountValue)
                .GreaterThan(0).WithMessage("Discount value must be greater than 0");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required");

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

            RuleFor(x => x.DiscountType)
                .IsInEnum().WithMessage("Invalid discount type");

            When(x => x.DiscountType == DiscountType.Percentage, () =>
            {
                RuleFor(x => x.DiscountValue)
                    .LessThanOrEqualTo(100).WithMessage("Percentage discount cannot exceed 100");
            });

            RuleForEach(x => x.Rules).ChildRules(rule =>
            {
                rule.RuleFor(r => r.RuleType)
                    .IsInEnum().WithMessage("Invalid rule type");

                rule.RuleFor(r => r.RuleValue)
                    .NotEmpty().WithMessage("Rule value is required");
            });

            RuleForEach(x => x.Coupons).ChildRules(coupon =>
            {
                coupon.RuleFor(c => c.Code)
                    .NotEmpty().WithMessage("Coupon code is required")
                    .MaximumLength(50).WithMessage("Code must not exceed 50 characters");
            });
        }
    }
}
