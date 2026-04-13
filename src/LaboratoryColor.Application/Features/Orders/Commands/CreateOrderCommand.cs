using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.Orders.Commands
{
    public record CreateOrderCommand : IRequest<int>
    {
        public string CustomerName { get; init; }
        public string CustomerPhone { get; init; }
        public string? CustomerEmail { get; init; }
        public string? Comment { get; init; }
        public List<OrderItemCommand> Items { get; init; } = new();
    }

    public record OrderItemCommand
    {
        public int ProductId { get; init; }
        public int Quantity { get; init; }
    }

    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            // 1. Проверяем остатки и получаем товары
            var products = new Dictionary<int, Product>();

            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    throw new DomainException($"Product with id {item.ProductId} not found");

                if (product.CurrentStock < item.Quantity)
                    throw new DomainException($"Insufficient stock for product '{product.Name}'. Available: {product.CurrentStock}, Requested: {item.Quantity}");

                products[item.ProductId] = product;
            }

            // 2. Создаем заказ
            var order = new Order(
                request.CustomerName,
                request.CustomerPhone,
                request.CustomerEmail);

            if (!string.IsNullOrEmpty(request.Comment))
            {
                // Добавить Comment в Order (если нет, добавить метод)
                var commentProperty = order.GetType().GetProperty("Comment");
                commentProperty?.SetValue(order, request.Comment);
            }

            // 3. Добавляем товары в заказ и списываем со склада
            foreach (var item in request.Items)
            {
                var product = products[item.ProductId];

                // Добавляем товар в заказ
                order.AddItem(product, item.Quantity);

                // Списываем со склада
                product.UpdateStock(-item.Quantity);

                // Создаем запись о движении
                var stockMovement = new StockMovement(
                    product,
                    -item.Quantity,
                    StockMovementType.Sale,
                    null,
                    $"Order for {request.CustomerName}",
                    null);

                _context.StockMovements.Add(stockMovement);
            }

            // 4. Сохраняем
            _context.Orders.Add(order);
            await _context.SaveChangesAsync(cancellationToken);

            return order.Id;
        }
    }
}
