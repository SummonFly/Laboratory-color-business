using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using MediatR;

namespace LaboratoryColor.Application.Features.Auth.Commands
{
    public record RegisterCommand : IRequest<AuthResponse>
    {
        public string UserName { get; init; }
        public string Email { get; init; }
        public string Password { get; init; }
    }

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public RegisterCommandHandler(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userService.FindByNameAsync(request.UserName);
            if (existingUser != null)
                throw new Exception("User already exists");

            existingUser = await _userService.FindByEmailAsync(request.Email);
            if (existingUser != null)
                throw new Exception("Email already registered");

            var newUser = new ApplicationUserDto
            {
                UserName = request.UserName,
                Email = request.Email
            };

            var result = await _userService.CreateUserAsync(newUser, request.Password);

            if (!result.Succeeded)
                throw new Exception($"Registration failed: {string.Join(", ", result.Errors)}");

            // Получаем созданного пользователя
            var user = await _userService.FindByNameAsync(request.UserName);

            await _userService.AddToRoleAsync(user, "User");

            var token = await _tokenService.CreateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            var roles = await _userService.GetRolesAsync(user);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(3),
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = roles.ToList()
            };
        }
    }
}
