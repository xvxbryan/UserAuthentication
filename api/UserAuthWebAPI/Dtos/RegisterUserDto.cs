namespace UserAuthWebAPI.Dtos {
    public class RegisterUserDto {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
