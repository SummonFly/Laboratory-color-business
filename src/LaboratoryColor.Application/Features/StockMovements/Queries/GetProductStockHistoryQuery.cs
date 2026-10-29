using LaboratoryColor.Application.DTOs.StockMovements;
using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.StockMovements.Queries
{
    public record GetProductStockHistoryQuery : IRequest<ProductStockHistoryDto>
    {
        public int ProductId { get; init; }
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
    }

    public class ProductStockHistoryDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int CurrentStock { get; set; }
        public List<StockMovementDto> Movements { get; set; } = new();
        public int TotalIn { get; set; }
        public int TotalOut { get; set; }
    }

    public class GetProductStockHistoryQueryHandler : IRequestHandler<GetProductStockHistoryQuery, ProductStockHistoryDto>
    {
        private readonly IApplicationDbContext _context;

        public GetProductStockHistoryQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductStockHistoryDto> Handle(GetProductStockHistoryQuery request, CancellationToken cancellationToken)
        {
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
                throw new DomainException($"Product with id {request.ProductId} not found");

            var query = _context.StockMovements
                .Where(sm => sm.ProductId == request.ProductId)
                .AsQueryable();

            if (request.FromDate.HasValue)
                query = query.Where(sm => sm.CreatedAt >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(sm => sm.CreatedAt <= request.ToDate.Value);

            var movements = await query
                .OrderByDescending(sm => sm.CreatedAt)
                .Select(sm => new StockMovementDto
                {
                    Id = sm.Id,
                    ProductId = sm.ProductId,
                    ProductName = product.Name,
                    ProductSku = "",
                    Quantity = sm.Quantity,
                    MovementType = sm.MovementType.ToString(),
                    ReferenceId = sm.ReferenceId,
                    Reason = sm.Reason,
                    CreatedAt = sm.CreatedAt,
                    CreatedBy = sm.CreatedBy
                })
                .ToListAsync(cancellationToken);

            return new ProductStockHistoryDto
            {
                ProductId = product.Id,
                ProductName = product.Name,
                CurrentStock = product.CurrentStock,
                Movements = movements,
                TotalIn = movements.Where(m => m.Quantity > 0).Sum(m => m.Quantity),
                TotalOut = movements.Where(m => m.Quantity < 0).Sum(m => -m.Quantity)
            };
        }
    }
}
