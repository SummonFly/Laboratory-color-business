namespace LaboratoryColor.Application.Interfaces
{
    public interface IApplicationUser
    {
        string Id { get; }
        string UserName { get; }
        string? Email { get; }
        string? RefreshToken { get; set; }
        DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
