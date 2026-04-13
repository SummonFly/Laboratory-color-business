using LaboratoryColor.Application.DTOs.Orders;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Orders.Queries
{
    public record GetOrderByIdQuery : IRequest<OrderDto?>
    {
        public int Id { get; init; }
    }

    public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
    {
        private readonly IApplicationDbContext _context;

        public GetOrderByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.Id == request.Id)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    Status = o.Status.ToString(),
                    CreatedAt = o.CreatedAt,
                    CustomerName = o.CustomerName,
                    CustomerPhone = o.CustomerPhone.Value,
                    CustomerEmail = o.CustomerEmail,
                    Comment = o.Comment,
                    TotalAmount = o.TotalAmount.Amount,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice.Amount
                    }).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
