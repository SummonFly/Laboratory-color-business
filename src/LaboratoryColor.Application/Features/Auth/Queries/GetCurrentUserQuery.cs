using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using MediatR;

namespace LaboratoryColor.Application.Features.Auth.Queries
{
    public record GetCurrentUserQuery : IRequest<AuthResponse?>
    {
        public string UserId { get; init; }
    }
    public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, AuthResponse?>
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public GetCurrentUserQueryHandler(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
        {
            // Получаем пользователя через IUserService
            var user = await _userService.FindByIdAsync(request.UserId);
            if (user == null)
                return null;

            var token = await _tokenService.CreateToken(user);
            var roles = await _userService.GetRolesAsync(user);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = user.RefreshToken ?? "",
                ExpiresAt = DateTime.UtcNow.AddHours(3),
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email ?? "",
                Roles = roles.ToList()
            };
        }
    }
}
