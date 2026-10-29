using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.PurchaseOrders.Queries
{
    public record GetPurchaseOrdersQuery : IRequest<List<PurchaseOrderSummaryDto>>
    {
        public int? SupplierId { get; init; }
        public PurchaseOrderStatus? Status { get; init; }
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
    }

    public class PurchaseOrderSummaryDto
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string OrderNumber { get; set; }
        public string Status { get; set; }
        public DateTime OrderedDate { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public decimal TotalAmount { get; set; }
        public int ItemsCount { get; set; }
    }

    public class GetPurchaseOrdersQueryHandler : IRequestHandler<GetPurchaseOrdersQuery, List<PurchaseOrderSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPurchaseOrdersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseOrderSummaryDto>> Handle(GetPurchaseOrdersQuery request, CancellationToken cancellationToken)
        {
            var query = _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Include(po => po.Items)
                .AsQueryable();

            if (request.SupplierId.HasValue)
                query = query.Where(po => po.SupplierId == request.SupplierId.Value);

            if (request.Status.HasValue)
                query = query.Where(po => po.Status == request.Status.Value);

            if (request.FromDate.HasValue)
                query = query.Where(po => po.OrderedDate >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(po => po.OrderedDate <= request.ToDate.Value);

            return await query
                .OrderByDescending(po => po.OrderedDate)
                .Select(po => new PurchaseOrderSummaryDto
                {
                    Id = po.Id,
                    SupplierId = po.SupplierId,
                    SupplierName = po.Supplier.Name,
                    OrderNumber = po.OrderNumber,
                    Status = po.Status.ToString(),
                    OrderedDate = po.OrderedDate,
                    ExpectedDeliveryDate = po.ExpectedDeliveryDate,
                    TotalAmount = po.TotalAmount.Amount,
                    ItemsCount = po.Items.Count
                })
                .ToListAsync(cancellationToken);
        }
    }
}
