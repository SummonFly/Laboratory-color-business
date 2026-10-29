using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace LaboratoryColor.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<ApplicationUserDto?> FindByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return MapToDto(user);
        }

        public async Task<ApplicationUserDto?> FindByNameAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            return MapToDto(user);
        }

        public async Task<ApplicationUserDto?> FindByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return MapToDto(user);
        }

        public async Task<bool> CheckPasswordAsync(ApplicationUserDto user, string password)
        {
            var appUser = await _userManager.FindByIdAsync(user.Id);
            if (appUser == null) return false;

            return await _userManager.CheckPasswordAsync(appUser, password);
        }

        public async Task<IdentityResultDto> CreateUserAsync(ApplicationUserDto user, string password)
        {
            var appUser = new ApplicationUser
            {
                UserName = user.UserName,
                Email = user.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(appUser, password);

            if (result.Succeeded)
            {
                user.Id = appUser.Id;
                return IdentityResultDto.Success();
            }

            return IdentityResultDto.Failure(result.Errors.Select(e => e.Description));
        }

        public async Task<IList<string>> GetRolesAsync(ApplicationUserDto user)
        {
            var appUser = await _userManager.FindByIdAsync(user.Id);
            if (appUser == null) return new List<string>();

            return await _userManager.GetRolesAsync(appUser);
        }

        public async Task AddToRoleAsync(ApplicationUserDto user, string role)
        {
            var appUser = await _userManager.FindByIdAsync(user.Id);
            if (appUser != null)
            {
                await _userManager.AddToRoleAsync(appUser, role);
            }
        }

        private ApplicationUserDto? MapToDto(ApplicationUser? user)
        {
            if (user == null) return null;

            return new ApplicationUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                RefreshToken = user.RefreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime
            };
        }
    }
}
