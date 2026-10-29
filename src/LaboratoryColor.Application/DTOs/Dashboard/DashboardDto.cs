namespace LaboratoryColor.Application.DTOs.Dashboard
{
    public class DashboardDto
    {
        public StockSummaryDto StockSummary { get; set; } = new();
        public SalesSummaryDto SalesSummary { get; set; } = new();
        public List<PopularProductDto> PopularProducts { get; set; } = new();
        public List<LowStockProductDto> LowStockProducts { get; set; } = new();
        public int PendingPurchaseOrders { get; set; }
    }
}
