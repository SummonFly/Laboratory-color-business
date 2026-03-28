using FluentValidation;

namespace LaboratoryColor.Application.Features.Suppliers.Commands
{
    public class UpdateSupplierCommandValidator : AbstractValidator<UpdateSupplierCommand>
    {
        public UpdateSupplierCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Supplier ID is required");

            RuleFor(x => x.Name)
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters")
                .When(x => x.Name != null);

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
