using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using MediatR;


namespace LaboratoryColor.Application.Features.Auth.Commands
{
    public record LoginCommand : IRequest<AuthResponse>
    {
        public string UserName { get; init; }
        public string Password { get; init; }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public LoginCommandHandler(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userService.FindByNameAsync(request.UserName);
            if (user == null)
                throw new Exception("Invalid credentials");

            var isValidPassword = await _userService.CheckPasswordAsync(user, request.Password);
            if (!isValidPassword)
                throw new Exception("Invalid credentials");

            var token = await _tokenService.CreateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Сохраняем refresh token
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
