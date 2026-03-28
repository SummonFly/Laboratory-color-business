using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.Discounts.Commands
{
    public record DeleteDiscountCommand : IRequest
    {
        public int Id { get; init; }
    }

    public class DeleteDiscountCommandHandler : IRequestHandler<DeleteDiscountCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteDiscountCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteDiscountCommand request, CancellationToken cancellationToken)
        {
            var discount = await _context.Discounts.FindAsync(request.Id);

            if (discount == null)
                throw new DomainException($"Discount with id {request.Id} not found");

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
