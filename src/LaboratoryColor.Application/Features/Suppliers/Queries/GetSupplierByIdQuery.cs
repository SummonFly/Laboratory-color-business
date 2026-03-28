using LaboratoryColor.Application.DTOs.Suppliers;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Suppliers.Queries
{
    public record GetSupplierByIdQuery : IRequest<SupplierDto?>
    {
        public int Id { get; init; }
    }

    public class GetSupplierByIdQueryHandler : IRequestHandler<GetSupplierByIdQuery, SupplierDto?>
    {
        private readonly IApplicationDbContext _context;

        public GetSupplierByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SupplierDto?> Handle(GetSupplierByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Suppliers
                .Where(s => s.Id == request.Id)
                .Select(s => new SupplierDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    ContactPerson = s.ContactPerson,
                    Email = s.Email,
                    Phone = s.Phone != null ? s.Phone.Value : null,
                    Address = s.Address,
                    Inn = s.Inn,
                    BankDetails = s.BankDetails,
                    IsActive = s.IsActive,
                    PurchaseOrdersCount = s.PurchaseOrders.Count
                })
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
