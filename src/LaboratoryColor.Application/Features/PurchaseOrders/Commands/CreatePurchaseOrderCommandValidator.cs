using FluentValidation;

namespace LaboratoryColor.Application.Features.PurchaseOrders.Commands
{
    public class CreatePurchaseOrderCommandValidator : AbstractValidator<CreatePurchaseOrderCommand>
    {
        public CreatePurchaseOrderCommandValidator()
        {
            RuleFor(x => x.SupplierId)
                .GreaterThan(0).WithMessage("Supplier ID is required");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one item is required");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ProductId)
                    .GreaterThan(0).WithMessage("Product ID is required");

                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0).WithMessage("Quantity must be greater than 0");

                item.RuleFor(i => i.UnitPrice)
                    .GreaterThan(0).WithMessage("Unit price must be greater than 0");
            });

            RuleFor(x => x.ExpectedDeliveryDate)
                .GreaterThan(DateTime.UtcNow).WithMessage("Expected delivery date must be in the future")
                .When(x => x.ExpectedDeliveryDate.HasValue);
        }
    }
}
