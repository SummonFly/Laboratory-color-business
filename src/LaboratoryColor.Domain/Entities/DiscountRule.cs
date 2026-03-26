using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Enums;

namespace LaboratoryColor.Domain.Entities
{
    public class DiscountRule : BaseEntity
    {
        public int DiscountId { get; private set; }
        public Discount Discount { get; private set; }
        public DiscountRuleType RuleType { get; private set; }
        public string RuleValue { get; private set; } // "1" (CategoryId), "5" (AttributeValueId)

        private DiscountRule() { }

        public DiscountRule(Discount discount, DiscountRuleType ruleType, string ruleValue)
        {
            Discount = discount;
            DiscountId = discount.Id;
            RuleType = ruleType;
            RuleValue = ruleValue;
        }

        public bool MatchesProduct(Product product)
        {
            return RuleType switch
            {
                DiscountRuleType.Category => product.CategoryId.ToString() == RuleValue,
                DiscountRuleType.Product => product.Id.ToString() == RuleValue,
                DiscountRuleType.All => true,
                _ => false
            };
        }
    }
}
