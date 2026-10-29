using LaboratoryColor.Application.DTOs.Coupons;
using LaboratoryColor.Application.DTOs.Discounts;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Application.Features.Discounts.Queries
{
    public record GetDiscountsQuery : IRequest<List<DiscountDto>>
    {
        public bool? IsActive { get; init; }
        public DateTime? Date { get; init; }
    }

    public class GetDiscountsQueryHandler : IRequestHandler<GetDiscountsQuery, List<DiscountDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetDiscountsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DiscountDto>> Handle(GetDiscountsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Discounts
                .Include(d => d.Rules)
                .Include(d => d.Coupons)
                .AsQueryable();

            if (request.IsActive.HasValue)
                query = query.Where(d => d.IsActive == request.IsActive.Value);

            if (request.Date.HasValue)
                query = query.Where(d => d.StartDate <= request.Date.Value && d.EndDate >= request.Date.Value);

            return await query
                .OrderByDescending(d => d.Priority)
                .Select(d => new DiscountDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    DiscountType = d.DiscountType.ToString(),
                    DiscountValue = d.DiscountValue,
                    StartDate = d.StartDate,
                    EndDate = d.EndDate,
                    IsActive = d.IsActive,
                    Priority = d.Priority,
                    Rules = d.Rules.Select(r => new DiscountRuleDto
                    {
                        Id = r.Id,
                        RuleType = r.RuleType.ToString(),
                        RuleValue = r.RuleValue
                    }).ToList(),
                    Coupons = d.Coupons.Select(c => new CouponDto
                    {
                        Id = c.Id,
                        Code = c.Code,
                        UsageLimit = c.UsageLimit,
                        UsedCount = c.UsedCount,
                        UserId = c.UserId,
                        IsActive = c.IsActive
                    }).ToList()
                })
                .ToListAsync(cancellationToken);
        }
    }
}
