namespace LaboratoryColor.Infrastructure.Simulation
{
    public class SimulationConfig
    {
        public bool IsEnabled { get; set; } = false;
        public int OrderGenerationIntervalSeconds { get; set; } = 30;
        public int AutoReceiveIntervalSeconds { get; set; } = 60;
        public int LowStockThreshold { get; set; } = 10;
        public int MinItemsPerOrder { get; set; } = 1;
        public int MaxItemsPerOrder { get; set; } = 3;
        public int ProbabilityPercent { get; set; } = 70;
        public int DefaultDeliveryDays { get; set; } = 3;
        public int DefaultOrderQuantity { get; set; } = 50;
        public int DefaultSupplierId { get; set; } = 1;
    }
}
