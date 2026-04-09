using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.Categories.Commands
{
    public record UpdateCategoryCommand : IRequest
    {
        public int Id { get; init; }
        public string? Name { get; init; }
        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
    }
    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCategoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FindAsync(request.Id);

            if (category == null)
                throw new DomainException($"Category with id {request.Id} not found");

            if (!string.IsNullOrEmpty(request.Name))
            {
                // Через метод сущности, если добавите UpdateName
                // Пока прямое изменение
                category.GetType().GetProperty("Name")?.SetValue(category, request.Name);
            }

            if (!string.IsNullOrEmpty(request.Description))
                category.UpdateDescription(request.Description);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
