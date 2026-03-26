using LaboratoryColor.Domain.Common;
using LaboratoryColor.Domain.Exceptions;

namespace LaboratoryColor.Domain.Entities
{
    public class CartItem : BaseEntity
    {
        public int Quantity { get; private set; }
        public int ProductId { get; private set; }
        public string UserId { get; private set; }
        public Product Product { get; private set; }

        private CartItem() { }

        public CartItem(int productId, string userId, int quantity = 1)
        {
            ProductId = productId;
            UserId = userId;
            Quantity = quantity;
        }

        public void IncreaseQuantity(int amount = 1)
        {
            Quantity += amount;
        }

        public void DecreaseQuantity(int amount = 1)
        {
            if (Quantity - amount <= 0)
                throw new DomainException("Quantity cannot be less than 1");
            Quantity -= amount;
        }
    }
}
