using LaboratoryColor.Application.Features.PurchaseOrders.Commands;
using LaboratoryColor.Application.Features.PurchaseOrders.Queries;
using LaboratoryColor.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaboratoryColor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PurchaseOrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetPurchaseOrders(
            [FromQuery] int? supplierId,
            [FromQuery] PurchaseOrderStatus? status,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            var query = new GetPurchaseOrdersQuery
            {
                SupplierId = supplierId,
                Status = status,
                FromDate = fromDate,
                ToDate = toDate
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetPurchaseOrder(int id)
        {
            var query = new GetPurchaseOrderByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> CreatePurchaseOrder(CreatePurchaseOrderCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetPurchaseOrder), new { id }, new { id });
        }

        [HttpPost("{id}/receive")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> ReceivePurchaseOrder(int id, ReceivePurchaseOrderCommand command)
        {
            if (id != command.PurchaseOrderId)
                return BadRequest("ID mismatch");

            await _mediator.Send(command);
            return NoContent();
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateStatus(int id, UpdatePurchaseOrderStatusCommand command)
        {
            if (id != command.PurchaseOrderId)
                return BadRequest("ID mismatch");

            await _mediator.Send(command);
            return NoContent();
        }
    }
}
