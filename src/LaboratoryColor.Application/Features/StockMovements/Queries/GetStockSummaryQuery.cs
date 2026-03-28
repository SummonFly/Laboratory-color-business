using LaboratoryColor.Application.DTOs.StockMovements;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.StockMovements.Queries
{
    public record GetStockSummaryQuery : IRequest<List<StockMovementSummaryDto>>
    {
        public int? CategoryId { get; init; }
        public string? SearchTerm { get; init; }
        public bool? LowStockOnly { get; init; }
        public int LowStockThreshold { get; init; } = 10;
    }

    public class GetStockSummaryQueryHandler : IRequestHandler<GetStockSummaryQuery, List<StockMovementSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetStockSummaryQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<StockMovementSummaryDto>> Handle(GetStockSummaryQuery request, CancellationToken cancellationToken)
        {
            var productsQuery = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (request.CategoryId.HasValue)
                productsQuery = productsQuery.Where(p => p.CategoryId == request.CategoryId.Value);

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var search = request.SearchTerm.ToLower();
                productsQuery = productsQuery.Where(p => p.Name.ToLower().Contains(search));
            }

            if (request.LowStockOnly.HasValue && request.LowStockOnly.Value)
                productsQuery = productsQuery.Where(p => p.CurrentStock <= request.LowStockThreshold);

            var products = await productsQuery.ToListAsync(cancellationToken);

            // Получаем движения за период (опционально)
            var movements = await _context.StockMovements
                .Where(sm => products.Select(p => p.Id).Contains(sm.ProductId))
                .ToListAsync(cancellationToken);

            return products.Select(p => new StockMovementSummaryDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                CurrentStock = p.CurrentStock,
                TotalIn = movements.Where(m => m.ProductId == p.Id && m.Quantity > 0).Sum(m => m.Quantity),
                TotalOut = movements.Where(m => m.ProductId == p.Id && m.Quantity < 0).Sum(m => -m.Quantity)
            }).ToList();
        }
    }
}
