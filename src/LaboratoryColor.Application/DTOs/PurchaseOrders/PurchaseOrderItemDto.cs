namespace LaboratoryColor.Application.DTOs.PurchaseOrders
{
    public class PurchaseOrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int ReceivedQuantity { get; set; }
        public bool IsFullyReceived { get; set; }
    }
}
