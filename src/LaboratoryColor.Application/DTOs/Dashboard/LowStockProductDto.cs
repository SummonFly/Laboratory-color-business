namespace LaboratoryColor.Application.DTOs.Dashboard
{
    public class LowStockProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int Threshold { get; set; }
    }
}
