namespace LaboratoryColor.Application.DTOs.Dashboard
{
    public class StockSummaryDto
    {
        public int TotalProducts { get; set; }
        public decimal TotalStockValue { get; set; }
        public int LowStockCount { get; set; }
    }
}
