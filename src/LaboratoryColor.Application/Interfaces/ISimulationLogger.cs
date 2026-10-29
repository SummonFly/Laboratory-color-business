namespace LaboratoryColor.Application.Interfaces
{
    public interface ISimulationLogger
    {
        void Log(string message, string type = "INFO");
        IEnumerable<SimulationLogEntry> GetLogs();
        void Clear();
    }

    public class SimulationLogEntry
    {
        public DateTime Timestamp { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "INFO";
    }
}
