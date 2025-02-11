namespace UserAuthWebAPI.Dtos {
    public class CreateTokenResponseDto {
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
    }
}
