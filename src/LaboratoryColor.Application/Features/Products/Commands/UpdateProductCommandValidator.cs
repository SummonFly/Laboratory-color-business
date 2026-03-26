using FluentValidation;

namespace LaboratoryColor.Application.Features.Products.Commands
{
    public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Product ID is required");

            RuleFor(x => x.Name)
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters")
                .When(x => x.Name != null);

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0")
                .When(x => x.Price.HasValue);

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("CategoryId must be greater than 0")
                .When(x => x.CategoryId.HasValue);
        }
    }
}
