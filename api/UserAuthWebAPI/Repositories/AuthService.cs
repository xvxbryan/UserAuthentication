using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using UserAuthWebAPI.Data;
using UserAuthWebAPI.Dtos;
using UserAuthWebAPI.Interfaces;
using UserAuthWebAPI.Models;

namespace UserAuthWebAPI.Repositories {
    public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService {
        public async Task<User?> RegisterAsync(RegisterUserDto userDto) {
            if (await context.Users.AnyAsync(u => u.Username == userDto.Username)) {
                return null;
            }

            if (await context.Users.AnyAsync(u => u.Email == userDto.Email)) {
                return null;
            }

            var user = new User();

            var hashPassword = new PasswordHasher<User>()
                .HashPassword(user, userDto.PasswordHash);

            user.Username = userDto.Username;
            user.PasswordHash = hashPassword;
            user.Email = userDto.Email;

            context.Users.Add(user);
            context.SaveChanges();

            return user;
        }

        public async Task<TokenResponseDto?> LoginAsync(LoginUserDto userDto) {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);

            if (user is null) {
                return null;
            }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, userDto.PasswordHash)
                == PasswordVerificationResult.Failed) {
                return null;
            }

            return await CreateTokenResponse(user);
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User? user) {
            var token = CreateToken(user);
            return new TokenResponseDto {
                AccessToken = token.Token,
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user),
                Expires = token.Expires,
                UserId = user.Id,
            };
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto refreshTokenRequestDto) {
            var user = await ValidateRefreshTokenAsync(refreshTokenRequestDto.UserId, refreshTokenRequestDto.RefreshToken);
            if (user == null) { return null; }

            return await CreateTokenResponse(user);
        }

        private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken) { 
            var user = await context.Users.FindAsync(userId);
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpireTime <= DateTime.UtcNow) { 
                return null; 
            }

            return user;
        }

        private string GenerateRefreshToken() {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user) {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpireTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        private CreateTokenResponseDto CreateToken(User user) {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var expires = DateTime.UtcNow.AddDays(1);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new CreateTokenResponseDto {
                Token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor),
                Expires = expires
            };
        }
    }
}
