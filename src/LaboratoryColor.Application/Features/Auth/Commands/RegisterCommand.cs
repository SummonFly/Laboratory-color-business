using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace LaboratoryColor.Application.Features.Auth.Commands
{
    public record RegisterCommand : IRequest<AuthResponse>
    {
        public string UserName { get; init; }
        public string Email { get; init; }
        public string Password { get; init; }
    }

    //public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    //{
    //    private readonly UserManager<IdentityUser> _userManager;
    //    private readonly ITokenService _tokenService;

    //    public RegisterCommandHandler(UserManager<IdentityUser> userManager, ITokenService tokenService)
    //    {
    //        _userManager = userManager;
    //        _tokenService = tokenService;
    //    }

    //    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    //    {
    //        // Проверка существования пользователя
    //        var existingUser = await _userManager.FindByNameAsync(request.UserName);
    //        if (existingUser != null)
    //            throw new Exception("User already exists");

    //        existingUser = await _userManager.FindByEmailAsync(request.Email);
    //        if (existingUser != null)
    //            throw new Exception("Email already registered");

    //        // Создание пользователя
    //        var user = new IdentityUser
    //        {
    //            UserName = request.UserName,
    //            Email = request.Email,
    //            EmailConfirmed = true
    //        };

    //        var result = await _userManager.CreateAsync(user, request.Password);

    //        if (!result.Succeeded)
    //        {
    //            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
    //            throw new Exception($"Registration failed: {errors}");
    //        }

    //        // Назначение роли по умолчанию
    //        await _userManager.AddToRoleAsync(user, "User");

    //        // Генерация токена
    //        var token = await _tokenService.CreateToken(user);
    //        var refreshToken = _tokenService.GenerateRefreshToken();

    //        return new AuthResponse
    //        {
    //            Token = token,
    //            RefreshToken = refreshToken,
    //            ExpiresAt = DateTime.UtcNow.AddHours(3),
    //            UserId = user.Id,
    //            UserName = user.UserName,
    //            Email = user.Email,
    //            Roles = new List<string> { "User" }
    //        };
    //    }
    //}
}
