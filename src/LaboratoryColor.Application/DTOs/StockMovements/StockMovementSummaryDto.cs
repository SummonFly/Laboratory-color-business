namespace LaboratoryColor.Application.DTOs.StockMovements
{
    public class StockMovementSummaryDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int TotalIn { get; set; }
        public int TotalOut { get; set; }
        public int CurrentStock { get; set; }
    }
}
