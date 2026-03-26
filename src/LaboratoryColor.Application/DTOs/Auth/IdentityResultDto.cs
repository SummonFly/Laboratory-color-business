namespace LaboratoryColor.Application.DTOs.Auth
{
    public class IdentityResultDto
    {
        public bool Succeeded { get; set; }
        public List<string> Errors { get; set; } = new();

        public static IdentityResultDto Success() => new() { Succeeded = true };

        public static IdentityResultDto Failure(IEnumerable<string> errors) => new()
        {
            Succeeded = false,
            Errors = errors.ToList()
        };
    }
}
