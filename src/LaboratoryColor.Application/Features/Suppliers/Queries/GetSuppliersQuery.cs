using LaboratoryColor.Application.DTOs.Suppliers;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Suppliers.Queries
{
    public record GetSuppliersQuery : IRequest<List<SupplierDto>>
    {
        public bool? IsActive { get; init; }
        public string? SearchTerm { get; init; }
    }

    public class GetSuppliersQueryHandler : IRequestHandler<GetSuppliersQuery, List<SupplierDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetSuppliersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SupplierDto>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Suppliers.AsQueryable();

            if (request.IsActive.HasValue)
                query = query.Where(s => s.IsActive == request.IsActive.Value);

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var search = request.SearchTerm.ToLower();
                query = query.Where(s => s.Name.ToLower().Contains(search) ||
                                          (s.ContactPerson != null && s.ContactPerson.ToLower().Contains(search)) ||
                                          (s.Email != null && s.Email.ToLower().Contains(search)));
            }

            return await query
                .OrderBy(s => s.Name)
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
                .ToListAsync(cancellationToken);
        }
    }
}
