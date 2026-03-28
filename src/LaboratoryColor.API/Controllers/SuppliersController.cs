using LaboratoryColor.Application.Features.Suppliers.Commands;
using LaboratoryColor.Application.Features.Suppliers.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaboratoryColor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SuppliersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetSuppliers([FromQuery] bool? isActive, [FromQuery] string? search)
        {
            var query = new GetSuppliersQuery { IsActive = isActive, SearchTerm = search };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSupplier(int id)
        {
            var query = new GetSupplierByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> CreateSupplier(CreateSupplierCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetSupplier), new { id }, new { id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateSupplier(int id, UpdateSupplierCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var command = new DeleteSupplierCommand { Id = id };
            await _mediator.Send(command);
            return NoContent();
        }
    }
}
