using LaboratoryColor.Application.DTOs.Orders;
using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Orders.Queries
{
    public record GetOrdersQuery : IRequest<List<OrderDto>>
    {
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
        public string? Status { get; init; }
    }

    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, List<OrderDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetOrdersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .AsQueryable();

            if (request.FromDate.HasValue)
                query = query.Where(o => o.CreatedAt >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(o => o.CreatedAt <= request.ToDate.Value);

            // Исправлено: конвертируем строку в enum
            if (!string.IsNullOrEmpty(request.Status))
            {
                if (Enum.TryParse<OrderStatusEnum>(request.Status, true, out var statusEnum))
                {
                    query = query.Where(o => o.Status == statusEnum);
                }
            }

            return await query
                .OrderByDescending(o => o.CreatedAt)
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
                .ToListAsync(cancellationToken);
        }
    }
}
