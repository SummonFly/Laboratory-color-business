using LaboratoryColor.Application.Features.Coupon.Queries;
using LaboratoryColor.Application.Features.Discounts.Commands;
using LaboratoryColor.Application.Features.Discounts.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaboratoryColor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DiscountsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DiscountsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetDiscounts(
            [FromQuery] bool? isActive,
            [FromQuery] DateTime? date)
        {
            var query = new GetDiscountsQuery { IsActive = isActive, Date = date };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> CreateDiscount(CreateDiscountCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetDiscounts), new { id }, new { id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateDiscount(int id, UpdateDiscountCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var command = new DeleteDiscountCommand { Id = id };
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpGet("validate-coupon")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateCoupon(
            [FromQuery] string code,
            [FromQuery] string? userId,
            [FromQuery] decimal? orderTotal)
        {
            var query = new ValidateCouponQuery
            {
                Code = code,
                UserId = userId,
                OrderTotal = orderTotal
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
