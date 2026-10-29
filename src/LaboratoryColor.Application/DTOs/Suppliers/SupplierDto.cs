namespace LaboratoryColor.Application.DTOs.Suppliers
{
    public class SupplierDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ContactPerson { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Inn { get; set; }
        public string? BankDetails { get; set; }
        public bool IsActive { get; set; }
        public int PurchaseOrdersCount { get; set; }
    }
}
