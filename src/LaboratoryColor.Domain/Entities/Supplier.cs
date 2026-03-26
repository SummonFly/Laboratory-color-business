
using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Exceptions;
using LaboratoryColor.Domain.ValueObjects;

namespace LaboratoryColor.Domain.Entities
{
    public class Supplier : BaseEntity
    {
        public string Name { get; private set; }
        public string? ContactPerson { get; private set; }
        public string? Email { get; private set; }
        public PhoneNumber? Phone { get; private set; }
        public string? Address { get; private set; }
        public string? Inn { get; private set; }
        public string? BankDetails { get; private set; }
        public bool IsActive { get; private set; } = true;

        private readonly List<PurchaseOrder> _purchaseOrders = new();
        public IReadOnlyCollection<PurchaseOrder> PurchaseOrders => _purchaseOrders.AsReadOnly();

        private Supplier() { }

        public Supplier(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new DomainException("Supplier name is required");
            Name = name;
        }

        public void UpdateContact(string? contactPerson, string? email, PhoneNumber? phone)
        {
            ContactPerson = contactPerson;
            Email = email;
            Phone = phone;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateAddress(string? address)
        {
            Address = address;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Activate()
        {
            IsActive = true;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
