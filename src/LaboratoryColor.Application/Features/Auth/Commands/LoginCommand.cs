using LaboratoryColor.Application.DTOs.Auth;
using LaboratoryColor.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace LaboratoryColor.Application.Features.Auth.Commands
{
    public record LoginCommand : IRequest<AuthResponse>
    {
        public string UserName { get; init; }
        public string Password { get; init; }
    }

    //public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
    //{
    //    private readonly UserManager<IdentityUser> _userManager;
    //    private readonly SignInManager<IdentityUser> _signInManager;
    //    private readonly ITokenService _tokenService;

    //    public LoginCommandHandler(
    //        UserManager<IdentityUser> userManager,
    //        SignInManager<IdentityUser> signInManager,
    //        ITokenService tokenService)
    //    {
    //        _userManager = userManager;
    //        _signInManager = signInManager;
    //        _tokenService = tokenService;
    //    }

    //    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    //    {
    //        var user = await _userManager.FindByNameAsync(request.UserName);
    //        if (user == null)
    //            throw new Exception("Invalid credentials");

    //        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

    //        if (!result.Succeeded)
    //            throw new Exception("Invalid credentials");

    //        var token = await _tokenService.CreateToken(user);
    //        var refreshToken = _tokenService.GenerateRefreshToken();

    //        var roles = await _userManager.GetRolesAsync(user);

    //        return new AuthResponse
    //        {
    //            Token = token,
    //            RefreshToken = refreshToken,
    //            ExpiresAt = DateTime.UtcNow.AddHours(3),
    //            UserId = user.Id,
    //            UserName = user.UserName,
    //            Email = user.Email,
    //            Roles = roles.ToList()
    //        };
    //    }
    //}
}
