using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserAuthWebAPI.Dtos;
using UserAuthWebAPI.Interfaces;
using UserAuthWebAPI.Models;

namespace UserAuthWebAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase {
        [HttpPost("register")]
        public async Task<ActionResult<TokenResponseDto>> Register(RegisterUserDto userDto) {
            var user = await authService.RegisterAsync(userDto);

            if (user == null) {
                return BadRequest("Username or email already exists.");
            }

            LoginUserDto loginUserDto = new() {
                Username = userDto.Username,
                PasswordHash = userDto.PasswordHash
            };

            var result = await authService.LoginAsync(loginUserDto);

            if (result == null) {
                return BadRequest("Invalid username or password");
            }

            return GenerateTokenResponse(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginUserDto userDto) {
            var result = await authService.LoginAsync(userDto);

            if (result == null) {
                return BadRequest("Invalid username or password");
            }
            return GenerateTokenResponse(result);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto refreshTokenRequestDto) {
            var result = await authService.RefreshTokensAsync(refreshTokenRequestDto);
            if (result is null || result.AccessToken is null || result.RefreshToken is null) {
                return Unauthorized("Invalid refresh token");
            }

            //return Ok(result);
            return GenerateTokenResponse(result);
        }

        private ActionResult<TokenResponseDto> GenerateTokenResponse(TokenResponseDto result) {
            Response.Cookies.Append("session", result.AccessToken);
            Response.Cookies.Append("refresh", result.RefreshToken);

            return Ok(new {
                accessTokenExpires = result.Expires,
                refreshTokenExpires = result.RefreshTokenExpires,
                userId = result.UserId
            });
        }

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint() {
            return Ok("You are authenticated");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnlyEndpoint() {
            return Ok("You are an admin");
        }

        [Authorize]
        [HttpGet("dashboard")]
        public IActionResult Dashboard() {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated) {
                Console.WriteLine("Unauthorized access attempt.");
                return Unauthorized("Invalid token");
            }

            var userId = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = identity.FindFirst(ClaimTypes.Name)?.Value;
            var role = identity.FindFirst(ClaimTypes.Role)?.Value;

            Console.WriteLine($"User: {username}, Role: {role}");
            return Ok(new { userId, username, role });
        }
    }
}
