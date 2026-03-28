using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Exceptions;
using LaboratoryColor.Domain.ValueObjects;
using MediatR;

namespace LaboratoryColor.Application.Features.PurchaseOrders.Commands
{
    public record CreatePurchaseOrderCommand : IRequest<int>
    {
        public int SupplierId { get; init; }
        public DateTime? ExpectedDeliveryDate { get; init; }
        public string? Notes { get; init; }
        public List<PurchaseOrderItemCommand> Items { get; init; } = new();
    }

    public record PurchaseOrderItemCommand
    {
        public int ProductId { get; init; }
        public int Quantity { get; init; }
        public decimal UnitPrice { get; init; }
    }

    public class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreatePurchaseOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            // Проверяем поставщика
            var supplier = await _context.Suppliers.FindAsync(request.SupplierId);
            if (supplier == null)
                throw new DomainException($"Supplier with id {request.SupplierId} not found");

            // Генерируем номер заказа
            var orderNumber = GenerateOrderNumber();

            // Создаем заказ
            var purchaseOrder = new PurchaseOrder(supplier, orderNumber);

            if (request.ExpectedDeliveryDate.HasValue)
                purchaseOrder.SetExpectedDeliveryDate(request.ExpectedDeliveryDate.Value);

            // Добавляем товары
            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    throw new DomainException($"Product with id {item.ProductId} not found");

                purchaseOrder.AddItem(product, item.Quantity, new Money(item.UnitPrice));
            }

            _context.PurchaseOrders.Add(purchaseOrder);
            await _context.SaveChangesAsync(cancellationToken);

            return purchaseOrder.Id;
        }

        private string GenerateOrderNumber()
        {
            return $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N}".Substring(0, 20);
        }
    }
}
