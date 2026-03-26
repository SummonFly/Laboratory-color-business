using LaboratoryColor.Application.DTOs.Auth;

namespace LaboratoryColor.Application.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(ApplicationUserDto user);
        string GenerateRefreshToken();
    }
}
