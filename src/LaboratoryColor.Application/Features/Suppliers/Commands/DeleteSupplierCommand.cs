using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Exceptions;
using MediatR;

namespace LaboratoryColor.Application.Features.Suppliers.Commands
{
    public record DeleteSupplierCommand : IRequest
    {
        public int Id { get; init; }
    }

    public class DeleteSupplierCommandHandler : IRequestHandler<DeleteSupplierCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteSupplierCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteSupplierCommand request, CancellationToken cancellationToken)
        {
            var supplier = await _context.Suppliers.FindAsync(request.Id);

            if (supplier == null)
                throw new DomainException($"Supplier with id {request.Id} not found");

            // Проверяем, есть ли заказы у поставщика
            var hasOrders = _context.PurchaseOrders.Any(po => po.SupplierId == request.Id);
            if (hasOrders)
                throw new DomainException("Cannot delete supplier with existing purchase orders. Deactivate instead.");

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
