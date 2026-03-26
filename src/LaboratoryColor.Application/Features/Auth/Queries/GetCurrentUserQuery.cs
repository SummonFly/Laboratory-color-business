using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace LaboratoryColor.Application.Features.Auth.Queries
{
    public record GetCurrentUserQuery : IRequest<AuthResponse?>
    {
        public string UserId { get; init; }
    }
    //public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, AuthResponse?>
    //{
    //    private readonly UserManager<IdentityUser> _userManager;
    //    private readonly ITokenService _tokenService;

    //    public GetCurrentUserQueryHandler(UserManager<IdentityUser> userManager, ITokenService tokenService)
    //    {
    //        _userManager = userManager;
    //        _tokenService = tokenService;
    //    }

    //    public async Task<AuthResponse?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    //    {
    //        var user = await _userManager.FindByIdAsync(request.UserId);
    //        if (user == null)
    //            return null;

    //        var token = await _tokenService.CreateToken(user);
    //        var roles = await _userManager.GetRolesAsync(user);

    //        return new AuthResponse
    //        {
    //            Token = token,
    //            RefreshToken = "",
    //            ExpiresAt = DateTime.UtcNow.AddHours(3),
    //            UserId = user.Id,
    //            UserName = user.UserName,
    //            Email = user.Email,
    //            Roles = roles.ToList()
    //        };
    //    }
    //}
}
