using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using LaboratoryColor.Domain.ValueObjects;
using MediatR;

namespace LaboratoryColor.Application.Features.Suppliers.Commands
{
    public record UpdateSupplierCommand : IRequest
    {
        public int Id { get; init; }
        public string? Name { get; init; }
        public string? ContactPerson { get; init; }
        public string? Email { get; init; }
        public string? Phone { get; init; }
        public string? Address { get; init; }
        public string? Inn { get; init; }
        public string? BankDetails { get; init; }
        public bool? IsActive { get; init; }
    }

    public class UpdateSupplierCommandHandler : IRequestHandler<UpdateSupplierCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateSupplierCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
        {
            var supplier = await _context.Suppliers.FindAsync(request.Id);

            if (supplier == null)
                throw new DomainException($"Supplier with id {request.Id} not found");

            if (!string.IsNullOrEmpty(request.Name))
            {
                var property = supplier.GetType().GetProperty("Name");
                property?.SetValue(supplier, request.Name);
            }

            if (!string.IsNullOrEmpty(request.ContactPerson) || !string.IsNullOrEmpty(request.Email) || request.Phone != null)
            {
                PhoneNumber? phone = null;
                if (!string.IsNullOrEmpty(request.Phone))
                    phone = new PhoneNumber(request.Phone);

                supplier.UpdateContact(request.ContactPerson, request.Email, phone);
            }

            if (request.Address != null)
                supplier.UpdateAddress(request.Address);

            if (request.Inn != null)
            {
                var property = supplier.GetType().GetProperty("Inn");
                property?.SetValue(supplier, request.Inn);
            }

            if (request.BankDetails != null)
            {
                var property = supplier.GetType().GetProperty("BankDetails");
                property?.SetValue(supplier, request.BankDetails);
            }

            if (request.IsActive.HasValue)
            {
                if (request.IsActive.Value)
                    supplier.Activate();
                else
                    supplier.Deactivate();
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
