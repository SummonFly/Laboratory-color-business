using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.Categories.Commands
{
    public record DeleteCategoryCommand : IRequest
    {
        public int Id { get; init; }
    }
    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteCategoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FindAsync(request.Id);

            if (category == null)
                throw new DomainException($"Category with id {request.Id} not found");

            // Проверяем, есть ли товары в категории
            var hasProducts = _context.Products.Any(p => p.CategoryId == request.Id);
            if (hasProducts)
                throw new DomainException($"Cannot delete category with existing products. Move or delete products first.");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
