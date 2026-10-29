using LaboratoryColor.Application;
using LaboratoryColor.Infrastructure;
using LaboratoryColor.Infrastructure.Identity;
using LaboratoryColor.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace LaboratoryColor.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services
            builder.Services.AddApplication();
            builder.Services.AddInfrastructure(builder.Configuration);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "LaboratoryColor API", Version = "v1" });

                // Добавляем поддержку JWT в Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Введите JWT токен"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });


            // CORS настройка
            var corsOrigins = builder.Configuration.GetValue<string>("CORS:Origins", "http://localhost:3000,http://localhost")
                .Split(',', StringSplitOptions.RemoveEmptyEntries);

            if (corsOrigins.Contains("*"))
            {
                throw new InvalidOperationException(
                    "CORS Configuration Error: The wildcard '*' is not allowed when 'AllowCredentials()' is enabled. " +
                    "Please specify explicit origin URLs in your CORS:Origins environment variable.");
            }

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactApp", policy =>
                {
                    policy.WithOrigins(corsOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var app = builder.Build();


            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                if (app.Environment.IsDevelopment())
                {
                    try
                    {
                        var dbContext = services.GetRequiredService<ApplicationDbContext>();
                        dbContext.Database.Migrate();
                        Console.WriteLine("Development migrations applied successfully.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error applying migrations: {ex.Message}");
                        throw;
                    }
                }
                await SeedData.InitializeAsync(services);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseHttpsRedirection();
            }

            app.UseCors("ReactApp");

            if (!app.Environment.IsDevelopment())
            {
                app.UseForwardedHeaders();
            }

            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();


            app.Run();
        }
    }
}
