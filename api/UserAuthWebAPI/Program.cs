using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using UserAuthWebAPI.Data;
using UserAuthWebAPI.Interfaces;
using UserAuthWebAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options => {
//        options.TokenValidationParameters = new TokenValidationParameters {
//            ValidateIssuer = true,
//            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
//            ValidateAudience = true,
//            ValidAudience = builder.Configuration["AppSettings:Audience"],
//            ValidateLifetime = true,
//            IssuerSigningKey = new SymmetricSecurityKey(
//                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)),
//            ValidateIssuerSigningKey = true
//        };
//    });
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.Events = new JwtBearerEvents {
            OnMessageReceived = context => {
                var token = context.Request.Cookies["session"];  // Change "YourCookieName" to the actual cookie name
                Console.WriteLine(context.Request.Cookies["session"]);
                if (!string.IsNullOrEmpty(token)) {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!)),
            ValidateIssuerSigningKey = true
        };
    });


builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowSpecificOrigin",
        policy => {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000")
    .SetIsOriginAllowed(origin => true)
);

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
