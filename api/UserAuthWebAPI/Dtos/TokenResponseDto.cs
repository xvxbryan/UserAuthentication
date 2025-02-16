using Azure.Core;

namespace UserAuthWebAPI.Dtos {
    public class TokenResponseDto {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
        public DateTime Expires { get; set; }
        public DateTime? RefreshTokenExpires { get; set; }
        public Guid UserId { get; set; }
    }
}
