using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.PurchaseOrders.Commands
{
    public record ReceivePurchaseOrderCommand : IRequest
    {
        public int PurchaseOrderId { get; init; }
        public List<ReceiveItemCommand> Items { get; init; } = new();
    }

    public record ReceiveItemCommand
    {
        public int ProductId { get; init; }
        public int ReceivedQuantity { get; init; }
    }

    public class ReceivePurchaseOrderCommandHandler : IRequestHandler<ReceivePurchaseOrderCommand>
    {
        private readonly IApplicationDbContext _context;

        public ReceivePurchaseOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ReceivePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            var purchaseOrder = await _context.PurchaseOrders
                .Include(po => po.Items)
                .FirstOrDefaultAsync(po => po.Id == request.PurchaseOrderId, cancellationToken);

            if (purchaseOrder == null)
                throw new DomainException($"Purchase order with id {request.PurchaseOrderId} not found");

            foreach (var receiveItem in request.Items)
            {
                var item = purchaseOrder.Items.FirstOrDefault(i => i.ProductId == receiveItem.ProductId);
                if (item == null)
                    throw new DomainException($"Product {receiveItem.ProductId} not found in purchase order");

                item.Receive(receiveItem.ReceivedQuantity);

                // Обновляем склад
                var product = await _context.Products.FindAsync(receiveItem.ProductId);
                if (product != null)
                {
                    product.UpdateStock(receiveItem.ReceivedQuantity);

                    // Создаем запись о движении
                    var stockMovement = new StockMovement(
                        product,
                        receiveItem.ReceivedQuantity,
                        Domain.Enums.StockMovementType.Purchase,
                        purchaseOrder.Id,
                        $"Purchase order {purchaseOrder.OrderNumber}",
                        null);

                    _context.StockMovements.Add(stockMovement);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
