using FluentValidation;

namespace LaboratoryColor.Application.Features.Suppliers.Commands
{
    public class DeleteSupplierCommandValidator : AbstractValidator<DeleteSupplierCommand>
    {
        public DeleteSupplierCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Supplier ID is required");
        }
    }
}
