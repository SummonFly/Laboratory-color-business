using LaboratoryColor.Application.Features.StockMovements.Queries;
using LaboratoryColor.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaboratoryColor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StockMovementsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StockMovementsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetStockMovements(
            [FromQuery] int? productId,
            [FromQuery] StockMovementType? movementType,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] int? referenceId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            var query = new GetStockMovementsQuery
            {
                ProductId = productId,
                MovementType = movementType,
                FromDate = fromDate,
                ToDate = toDate,
                ReferenceId = referenceId,
                Page = page,
                PageSize = pageSize
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("summary")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetStockSummary(
            [FromQuery] int? categoryId,
            [FromQuery] string? search,
            [FromQuery] bool? lowStockOnly,
            [FromQuery] int lowStockThreshold = 10)
        {
            var query = new GetStockSummaryQuery
            {
                CategoryId = categoryId,
                SearchTerm = search,
                LowStockOnly = lowStockOnly,
                LowStockThreshold = lowStockThreshold
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("product/{productId}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetProductStockHistory(
            int productId,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            var query = new GetProductStockHistoryQuery
            {
                ProductId = productId,
                FromDate = fromDate,
                ToDate = toDate
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
