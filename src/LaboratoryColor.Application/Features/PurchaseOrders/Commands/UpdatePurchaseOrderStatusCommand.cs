using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.PurchaseOrders.Commands
{
    public record UpdatePurchaseOrderStatusCommand : IRequest
    {
        public int PurchaseOrderId { get; init; }
        public PurchaseOrderStatus Status { get; init; }
    }

    public class UpdatePurchaseOrderStatusCommandHandler : IRequestHandler<UpdatePurchaseOrderStatusCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdatePurchaseOrderStatusCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdatePurchaseOrderStatusCommand request, CancellationToken cancellationToken)
        {
            var purchaseOrder = await _context.PurchaseOrders.FindAsync(request.PurchaseOrderId);

            if (purchaseOrder == null)
                throw new DomainException($"Purchase order with id {request.PurchaseOrderId} not found");

            purchaseOrder.UpdateStatus(request.Status);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
