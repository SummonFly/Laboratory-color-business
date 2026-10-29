namespace LaboratoryColor.Application.DTOs.StockMovements
{
    public class StockMovementDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductSku { get; set; }
        public int Quantity { get; set; }
        public string MovementType { get; set; }
        public int? ReferenceId { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
    }
}
