using FluentValidation;

namespace LaboratoryColor.Application.Features.Suppliers.Commands
{
    public class CreateSupplierCommandValidator : AbstractValidator<CreateSupplierCommand>
    {
        public CreateSupplierCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Supplier name is required")
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Invalid email format")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Phone)
                .MaximumLength(20).WithMessage("Phone must not exceed 20 characters")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.Inn)
                .MaximumLength(12).WithMessage("INN must not exceed 12 characters")
                .When(x => !string.IsNullOrEmpty(x.Inn));
        }
    }

}
