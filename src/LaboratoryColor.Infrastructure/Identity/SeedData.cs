using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.Enums;
using LaboratoryColor.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;


namespace LaboratoryColor.Infrastructure.Identity
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await context.Database.MigrateAsync();

            // Создание ролей
            string[] roles = { "Admin", "Manager", "User", "Developer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // Создание Admin
            var adminEmail = "admin@laboratorycolor.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    await userManager.AddToRoleAsync(adminUser, "Manager");
                    await userManager.AddToRoleAsync(adminUser, "User");
                }
            }

            // Создание Developer
            var devEmail = "dev@laboratorycolor.com";
            var devUser = await userManager.FindByEmailAsync(devEmail);
            if (devUser == null)
            {
                devUser = new ApplicationUser
                {
                    UserName = "developer",
                    Email = devEmail,
                    FirstName = "Dev",
                    LastName = "User",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(devUser, "Dev123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(devUser, "Developer");
                    await userManager.AddToRoleAsync(devUser, "Manager");
                    await userManager.AddToRoleAsync(devUser, "User");
                }
            }

            // Создание категорий
            if (!context.Categories.Any())
            {
                var categories = new[]
                {
                new Category("Акриловые эмали"),
                new Category("Аэрозольные краски"),
                new Category("Автохимия"),
                new Category("Инструменты"),
                new Category("Грунтовки и шпатлевки")
            };

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }

            // Создание товаров
            if (!context.Products.Any())
            {
                var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Акриловые эмали");

                if (category != null)
                {
                    var products = new[]
                    {
                    new Product("Акриловая эмаль красная", 1250.00m, category.Id),
                    new Product("Акриловая эмаль синяя", 1250.00m, category.Id),
                    new Product("Акриловая эмаль черная", 1250.00m, category.Id),
                    new Product("Акриловая эмаль белая", 1250.00m, category.Id),
                    new Product("Акриловая эмаль серебристая", 1350.00m, category.Id)
                };

                    foreach (var product in products)
                    {
                        product.UpdateStock(100, StockMovementType.Transfer);
                    }

                    await context.Products.AddRangeAsync(products);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
