using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.ValueObjects;
using MediatR;

namespace LaboratoryColor.Application.Features.Suppliers.Commands
{
    public record CreateSupplierCommand : IRequest<int>
    {
        public string Name { get; init; }
        public string? ContactPerson { get; init; }
        public string? Email { get; init; }
        public string? Phone { get; init; }
        public string? Address { get; init; }
        public string? Inn { get; init; }
        public string? BankDetails { get; init; }
    }

    public class CreateSupplierCommandHandler : IRequestHandler<CreateSupplierCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateSupplierCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
        {
            var supplier = new Supplier(request.Name);

            PhoneNumber? phone = null;
            if (!string.IsNullOrEmpty(request.Phone))
                phone = new PhoneNumber(request.Phone);

            supplier.UpdateContact(request.ContactPerson, request.Email, phone);
            supplier.UpdateAddress(request.Address);

            // Обновление Inn и BankDetails через рефлексию или добавить методы в Supplier
            var innProperty = supplier.GetType().GetProperty("Inn");
            innProperty?.SetValue(supplier, request.Inn);

            var bankProperty = supplier.GetType().GetProperty("BankDetails");
            bankProperty?.SetValue(supplier, request.BankDetails);

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync(cancellationToken);

            return supplier.Id;
        }
    }
}
