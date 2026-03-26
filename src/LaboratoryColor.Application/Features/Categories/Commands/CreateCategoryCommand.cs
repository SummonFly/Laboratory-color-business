using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using MediatR;

namespace LaboratoryColor.Application.Features.Categories.Commands
{
    public record CreateCategoryCommand : IRequest<int>
    {
        public string Name { get; init; }
        public string? Description { get; init; }
        public string? ImageUrl { get; init; }
    }

    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateCategoryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new Category(request.Name);

            if (!string.IsNullOrEmpty(request.Description))
                category.UpdateDescription(request.Description);

            _context.Categories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);

            return category.Id;
        }
    }
}
