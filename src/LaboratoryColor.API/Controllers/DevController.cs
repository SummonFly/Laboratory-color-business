using LaboratoryColor.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaboratoryColor.API.Controllers
{
    [ApiController]
    [Route("api/dev")]
    [Authorize(Roles = "Developer")]
    public class DevController : ControllerBase
    {
        private readonly ITestDataService _testDataService;


        public DevController(ITestDataService testDataService)
        {
            _testDataService = testDataService;
        }

        [HttpPost("seed-test-data")]
        public async Task<IActionResult> SeedTestData()
        {
            var result = await _testDataService.SeedTestDataAsync();
            return Ok(result);
        }

        [HttpDelete("clear-test-data")]
        public async Task<IActionResult> ClearTestData()
        {
            var result = await _testDataService.ClearTestDataAsync();
            return Ok(result);
        }

        [HttpGet("test-data-status")]
        public async Task<IActionResult> GetTestDataStatus()
        {
            var result = await _testDataService.GetTestDataStatusAsync();
            return Ok(result);
        }
    }
}
