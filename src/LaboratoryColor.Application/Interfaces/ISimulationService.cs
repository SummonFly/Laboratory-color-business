namespace LaboratoryColor.Application.Interfaces
{
    public interface ISimulationService
    {
        bool IsRunning { get; }
        void Start();
        void Stop();
        Task GenerateRandomOrder(CancellationToken cancellationToken = default);
    }
}
