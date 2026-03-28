using LaboratoryColor.Application.DTOs.StockMovements;
using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.StockMovements.Queries
{
    public record GetStockMovementsQuery : IRequest<List<StockMovementDto>>
    {
        public int? ProductId { get; init; }
        public StockMovementType? MovementType { get; init; }
        public DateTime? FromDate { get; init; }
        public DateTime? ToDate { get; init; }
        public int? ReferenceId { get; init; }
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 50;
    }

    public class GetStockMovementsQueryHandler : IRequestHandler<GetStockMovementsQuery, List<StockMovementDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetStockMovementsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<StockMovementDto>> Handle(GetStockMovementsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.StockMovements
                .Include(sm => sm.Product)
                .AsQueryable();

            if (request.ProductId.HasValue)
                query = query.Where(sm => sm.ProductId == request.ProductId.Value);

            if (request.MovementType.HasValue)
                query = query.Where(sm => sm.MovementType == request.MovementType.Value);

            if (request.FromDate.HasValue)
                query = query.Where(sm => sm.CreatedAt >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(sm => sm.CreatedAt <= request.ToDate.Value);

            if (request.ReferenceId.HasValue)
                query = query.Where(sm => sm.ReferenceId == request.ReferenceId.Value);

            return await query
                .OrderByDescending(sm => sm.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(sm => new StockMovementDto
                {
                    Id = sm.Id,
                    ProductId = sm.ProductId,
                    ProductName = sm.Product.Name,
                    ProductSku = "", // SKU, если добавите
                    Quantity = sm.Quantity,
                    MovementType = sm.MovementType.ToString(),
                    ReferenceId = sm.ReferenceId,
                    ReferenceNumber = "", // можно подтянуть из Reference
                    Reason = sm.Reason,
                    CreatedAt = sm.CreatedAt,
                    CreatedBy = sm.CreatedBy
                })
                .ToListAsync(cancellationToken);
        }
    }
}
