using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaboratoryColor.Application.Features.Products.Commands
{
    public record UpdateProductCommand : IRequest
    {
        public int Id { get; init; }
        public string? Name { get; init; }
        public decimal? Price { get; init; }
        public int? CategoryId { get; init; }
        public string? Description { get; init; }
    }
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateProductCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products.FindAsync(request.Id);

            if (product == null)
                throw new DomainException($"Product with id {request.Id} not found");

            // Обновляем название
            if (!string.IsNullOrEmpty(request.Name))
            {
                var property = product.GetType().GetProperty("Name");
                property?.SetValue(product, request.Name);
            }

            // Обновляем цену
            if (request.Price.HasValue)
                product.UpdatePrice(request.Price.Value);

            // Обновляем категорию
            if (request.CategoryId.HasValue)
            {
                var category = await _context.Categories.FindAsync(request.CategoryId.Value);
                if (category == null)
                    throw new DomainException($"Category with id {request.CategoryId} not found");

                var property = product.GetType().GetProperty("CategoryId");
                property?.SetValue(product, request.CategoryId.Value);
            }

            // Обновляем описание
            if (!string.IsNullOrEmpty(request.Description))
                product.UpdateDescription(request.Description);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
