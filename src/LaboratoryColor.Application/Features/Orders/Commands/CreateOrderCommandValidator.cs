using FluentValidation;

namespace LaboratoryColor.Application.Features.Orders.Commands
{
    public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator()
        {
            RuleFor(x => x.CustomerName)
                .NotEmpty().WithMessage("Customer name is required")
                .MaximumLength(100).WithMessage("Customer name must not exceed 100 characters");

            RuleFor(x => x.CustomerPhone)
                .NotEmpty().WithMessage("Customer phone is required")
                .MaximumLength(20).WithMessage("Phone must not exceed 20 characters");

            RuleFor(x => x.CustomerEmail)
                .EmailAddress().WithMessage("Invalid email format")
                .When(x => !string.IsNullOrEmpty(x.CustomerEmail));

            RuleFor(x => x.Comment)
                .MaximumLength(500).WithMessage("Comment must not exceed 500 characters")
                .When(x => x.Comment != null);

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one item is required");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ProductId)
                    .GreaterThan(0).WithMessage("Product ID is required");

                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0).WithMessage("Quantity must be greater than 0");
            });
        }
    }
}
