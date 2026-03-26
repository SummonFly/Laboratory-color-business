using LaboratoryColor.Domain.Exceptions;

namespace LaboratoryColor.Domain.ValueObjects
{
    public record PhoneNumber
    {
        public string Value { get; init; }

        private PhoneNumber() { }

        public PhoneNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Phone number is required");
            Value = value;
        }
    }
}
