using LaboratoryColor.Domain.Exceptions;

namespace LaboratoryColor.Domain.ValueObjects
{
    public record Money
    {
        public decimal Amount { get; init; }
        public string Currency { get; init; } = "RUB";

        public Money(decimal amount)
        {
            if (amount < 0)
                throw new DomainException("Amount cannot be negative");
            Amount = amount;
        }

        public Money Add(Money other) => new(Amount + other.Amount);
        public Money Multiply(int quantity) => new(Amount * quantity);
    }
}
