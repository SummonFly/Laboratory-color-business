using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
            var product = await _context.Products.FindAsync(request.Id, cancellationToken);

            if (product == null)
                throw new DomainException($"Product with id {request.Id} not found");

            // Обновляем название
            if (!string.IsNullOrEmpty(request.Name))
                product.UpdateName(request.Name);

            // Обновляем цену
            if (request.Price.HasValue)
                product.UpdatePrice(request.Price.Value);

            // Обновляем категорию
            if (request.CategoryId.HasValue)
            {
                var exist = await _context.Categories.AnyAsync(s => s.Id == request.CategoryId.Value);
                if (!exist)
                    throw new DomainException($"Category with id {request.CategoryId} not found");

                product.UpdateCategoryId(request.CategoryId.Value);
            }

            // Обновляем описание
            if (!string.IsNullOrEmpty(request.Description))
                product.UpdateDescription(request.Description);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
