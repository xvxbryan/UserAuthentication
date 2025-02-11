namespace UserAuthWebAPI.Dtos {
    public class LoginUserDto {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }
}
