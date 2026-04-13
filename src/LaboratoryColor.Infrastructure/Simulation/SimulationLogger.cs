using LaboratoryColor.Application.Interfaces;

namespace LaboratoryColor.Infrastructure.Simulation
{
    public class SimulationLogger : ISimulationLogger
    {
        private readonly List<SimulationLogEntry> _logs = new();
        private readonly int _maxLogs = 100;

        public void Log(string message, string type = "INFO")
        {
            _logs.Insert(0, new SimulationLogEntry
            {
                Timestamp = DateTime.Now,
                Message = message,
                Type = type
            });

            if (_logs.Count > _maxLogs)
                _logs.RemoveAt(_logs.Count - 1);
        }

        public IEnumerable<SimulationLogEntry> GetLogs() => _logs;
        public void Clear() => _logs.Clear();
    }
}
