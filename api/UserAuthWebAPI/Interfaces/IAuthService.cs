using UserAuthWebAPI.Dtos;
using UserAuthWebAPI.Models;

namespace UserAuthWebAPI.Interfaces {
    public interface IAuthService {
        Task<User?> RegisterAsync(RegisterUserDto userDto);
        Task<TokenResponseDto?> LoginAsync(LoginUserDto userDto);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto refreshTokenRequestDto);
    }
}
