using Microsoft.AspNetCore.Identity;

namespace LaboratoryColor.Application.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(IdentityUser user);
        string GenerateRefreshToken();
    }
}
