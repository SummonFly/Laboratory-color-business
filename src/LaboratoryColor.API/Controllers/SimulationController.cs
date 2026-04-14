using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Infrastructure.Background;
using LaboratoryColor.Infrastructure.Simulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaboratoryColor.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Developer")]
    public class SimulationController : ControllerBase
    {
        private readonly SimulationHostedService _simulationService;
        private readonly ISimulationLogger _logger;
        private readonly SimulationConfig _config;

        public SimulationController(
            SimulationHostedService simulationService,
            ISimulationLogger logger,
            SimulationConfig config)
        {
            _simulationService = simulationService;
            _logger = logger;
            _config = config;
        }

        [HttpPost("start")]
        public IActionResult Start()
        {
            _config.IsEnabled = true;
            _logger.Log($"Controller setting IsEnabled=true, Config HashCode={_config.GetHashCode()}", "DEBUG");
            _simulationService.Start();
            return Ok(new { message = "Simulation started" });
        }

        [HttpPost("stop")]
        public IActionResult Stop()
        {
            _config.IsEnabled = false;
            _simulationService.Stop();
            return Ok(new { message = "Simulation stopped" });
        }

        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new
            {
                isRunning = _simulationService.IsRunning,
                isEnabled = _config.IsEnabled,
                config = _config
            });
        }

        [HttpPut("config")]
        public IActionResult UpdateConfig([FromBody] SimulationConfig newConfig)
        {
            _config.IsEnabled = newConfig.IsEnabled;
            _config.OrderGenerationIntervalSeconds = newConfig.OrderGenerationIntervalSeconds;
            _config.AutoReceiveIntervalSeconds = newConfig.AutoReceiveIntervalSeconds;
            _config.LowStockThreshold = newConfig.LowStockThreshold;
            _config.MinItemsPerOrder = newConfig.MinItemsPerOrder;
            _config.MaxItemsPerOrder = newConfig.MaxItemsPerOrder;
            _config.ProbabilityPercent = newConfig.ProbabilityPercent;
            _config.DefaultDeliveryDays = newConfig.DefaultDeliveryDays;
            _config.DefaultOrderQuantity = newConfig.DefaultOrderQuantity;
            _config.DefaultSupplierId = newConfig.DefaultSupplierId;

            return Ok(new { message = "Configuration updated", config = _config });
        }

        [HttpGet("logs")]
        [Authorize(Roles = "Admin,Developer,Manager")]
        public IActionResult GetLogs()
        {
            return Ok(_logger.GetLogs());
        }

        [HttpDelete("logs")]
        public IActionResult ClearLogs()
        {
            _logger.Clear();
            return Ok(new { message = "Logs cleared" });
        }

        [HttpPost("generate-order")]
        public async Task<IActionResult> GenerateOrder()
        {
            // TODO: Временно использовать OrderGenerator напрямую
            return Ok(new { message = "Order generation triggered" });
        }
    }
}
