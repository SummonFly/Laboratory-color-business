using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaboratoryColor.Application.Features.Products.Commands
{
    public record CreateProductCommand : IRequest<int>
    {
        public string Name { get; init; }
        public decimal Price { get; init; }
        public int CategoryId { get; init; }
        public string? Description { get; init; }
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateProductCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // Проверяем существует ли категория
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
                throw new DomainException($"Category with id {request.CategoryId} not found");

            // Создаем продукт
            var product = new Product(request.Name, request.Price, request.CategoryId);

            if (!string.IsNullOrEmpty(request.Description))
                product.UpdateDescription(request.Description);

            // Сохраняем
            _context.Products.Add(product);
            await _context.SaveChangesAsync(cancellationToken);

            return product.Id;
        }
    }
}
