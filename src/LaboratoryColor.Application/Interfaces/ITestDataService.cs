namespace LaboratoryColor.Application.Interfaces
{
    public interface ITestDataService
    {
        Task<SeedResult> SeedTestDataAsync();
        Task<ClearResult> ClearTestDataAsync();
        Task<TestDataStatus> GetTestDataStatusAsync();
    }

    public class SeedResult
    {
        public List<string> CreatedUsers { get; set; } = new();
        public List<string> CreatedSuppliers { get; set; } = new();
        public List<string> Errors { get; set; } = new();
        public bool Success => Errors.Count == 0;
    }

    public class ClearResult
    {
        public List<string> DeletedUsers { get; set; } = new();
        public List<string> DeletedSuppliers { get; set; } = new();
        public List<string> Errors { get; set; } = new();
        public bool Success => Errors.Count == 0;
    }

    public class TestDataStatus
    {
        public int SimulationUsersCount { get; set; }
        public int SimulationSuppliersCount { get; set; }
        public bool HasTestData { get; set; }
    }
}
