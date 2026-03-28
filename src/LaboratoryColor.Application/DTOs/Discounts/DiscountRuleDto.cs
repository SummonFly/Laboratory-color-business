namespace LaboratoryColor.Application.DTOs.Discounts
{
    public class DiscountRuleDto
    {
        public int Id { get; set; }
        public string RuleType { get; set; } // All, Category, Product, TotalAmount
        public string RuleValue { get; set; }
    }
}
