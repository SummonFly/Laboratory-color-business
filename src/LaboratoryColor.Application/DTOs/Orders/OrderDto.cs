
namespace LaboratoryColor.Application.DTOs.Orders
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string? CustomerEmail { get; set; }
        public string? Comment { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public DateTime CreatedAt { get; internal set; }
    }
}
