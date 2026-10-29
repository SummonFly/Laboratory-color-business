using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.Discounts.Commands
{
    public record UpdateDiscountCommand : IRequest
    {
        public int Id { get; init; }
        public string? Name { get; init; }
        public string? Description { get; init; }
        public DiscountType? DiscountType { get; init; }
        public decimal? DiscountValue { get; init; }
        public DateTime? StartDate { get; init; }
        public DateTime? EndDate { get; init; }
        public int? Priority { get; init; }
        public bool? IsActive { get; init; }
    }

    public class UpdateDiscountCommandHandler : IRequestHandler<UpdateDiscountCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDiscountCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateDiscountCommand request, CancellationToken cancellationToken)
        {
            var discount = await _context.Discounts.FindAsync(request.Id);

            if (discount == null)
                throw new DomainException($"Discount with id {request.Id} not found");

            if (!string.IsNullOrEmpty(request.Name))
            {
                var property = discount.GetType().GetProperty("Name");
                property?.SetValue(discount, request.Name);
            }

            // Обновление через методы Discount, если добавить
            // Пока прямое изменение
            if (request.IsActive.HasValue)
            {
                if (request.IsActive.Value)
                    discount.Activate();
                else
                    discount.Deactivate();
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
