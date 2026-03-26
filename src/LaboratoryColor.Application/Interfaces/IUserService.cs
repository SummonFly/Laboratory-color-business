using LaboratoryColor.Application.DTOs.Auth;

namespace LaboratoryColor.Application.Interfaces
{
    public interface IUserService
    {
        Task<ApplicationUserDto?> FindByIdAsync(string userId);
        Task<ApplicationUserDto?> FindByNameAsync(string userName);
        Task<ApplicationUserDto?> FindByEmailAsync(string email);
        Task<bool> CheckPasswordAsync(ApplicationUserDto user, string password);
        Task<IdentityResultDto> CreateUserAsync(ApplicationUserDto user, string password);
        Task<IList<string>> GetRolesAsync(ApplicationUserDto user);
        Task AddToRoleAsync(ApplicationUserDto user, string role);
    }
}
