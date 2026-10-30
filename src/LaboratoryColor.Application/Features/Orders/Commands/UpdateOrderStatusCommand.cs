using LaboratoryColor.Application.Features.PurchaseOrders.Commands;
using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Domain.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaboratoryColor.Application.Features.Orders.Commands
{
    public record UpdateOrderStatusCommand : IRequest
    {
        public int OrderId { get; init; }
        public OrderStatusEnum Status { get; init; }
    }

    public class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateOrderStatusCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(request.OrderId);

            if (order == null)
                throw new DomainException($"Order with id {request.OrderId} not found");

            order.UpdateStatus(request.Status);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
