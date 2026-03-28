using LaboratoryColor.Application.DTOs.PurchaseOrders;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.PurchaseOrders.Queries
{
    public record GetPurchaseOrderByIdQuery : IRequest<PurchaseOrderDto?>
    {
        public int Id { get; init; }
    }

    public class GetPurchaseOrderByIdQueryHandler : IRequestHandler<GetPurchaseOrderByIdQuery, PurchaseOrderDto?>
    {
        private readonly IApplicationDbContext _context;

        public GetPurchaseOrderByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PurchaseOrderDto?> Handle(GetPurchaseOrderByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .Where(po => po.Id == request.Id)
                .Select(po => new PurchaseOrderDto
                {
                    Id = po.Id,
                    SupplierId = po.SupplierId,
                    SupplierName = po.Supplier.Name,
                    OrderNumber = po.OrderNumber,
                    Status = po.Status.ToString(),
                    OrderedDate = po.OrderedDate,
                    ExpectedDeliveryDate = po.ExpectedDeliveryDate,
                    ActualDeliveryDate = po.ActualDeliveryDate,
                    TotalAmount = po.TotalAmount.Amount,
                    Notes = po.Notes,
                    Items = po.Items.Select(i => new PurchaseOrderItemDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice.Amount,
                        ReceivedQuantity = i.ReceivedQuantity,
                        IsFullyReceived = i.IsFullyReceived
                    }).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
