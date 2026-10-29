using LaboratoryColor.Application.Interfaces;
using LaboratoryColor.Domain.Entities;
using LaboratoryColor.Domain.ValueObjects;
using LaboratoryColor.Infrastructure.Identity;
using LaboratoryColor.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LaboratoryColor.Infrastructure.Services
{
    public class TestDataService : ITestDataService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public TestDataService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<SeedResult> SeedTestDataAsync()
        {
            var result = new SeedResult();

            // 1. Тестовые пользователи
            var simUsers = GetSimulationUsers();
            foreach (var sim in simUsers)
            {
                var existingUser = await _userManager.FindByNameAsync(sim.UserName);
                if (existingUser == null)
                {
                    var user = new ApplicationUser
                    {
                        UserName = sim.UserName,
                        Email = sim.Email,
                        EmailConfirmed = true,
                        FirstName = sim.FirstName,
                        LastName = sim.LastName
                    };

                    var createResult = await _userManager.CreateAsync(user, sim.Password);
                    if (createResult.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, "User");
                        result.CreatedUsers.Add(sim.UserName);
                    }
                    else
                    {
                        result.Errors.AddRange(createResult.Errors.Select(e => e.Description));
                    }
                }
            }

            // 2. Поставщики
            var suppliers = GetSimulationSuppliers();
            foreach (var sup in suppliers)
            {
                var existing = await _context.Suppliers.FirstOrDefaultAsync(s => s.Name == sup.Name);
                if (existing == null)
                {
                    var supplier = new Supplier(sup.Name);
                    var phone = new PhoneNumber(sup.Phone);
                    supplier.UpdateContact(sup.ContactPerson, sup.Email, phone);

                    // Обновляем Inn
                    var innProp = supplier.GetType().GetProperty("Inn");
                    innProp?.SetValue(supplier, sup.Inn);

                    _context.Suppliers.Add(supplier);
                    result.CreatedSuppliers.Add(sup.Name);
                }
            }

            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<ClearResult> ClearTestDataAsync()
        {
            var result = new ClearResult();

            // 1. Удаление тестовых пользователей
            var simUsers = await _userManager.Users
                .Where(u => u.UserName != null && u.UserName.StartsWith("sim_"))
                .ToListAsync();

            foreach (var user in simUsers)
            {
                var deleteResult = await _userManager.DeleteAsync(user);
                if (deleteResult.Succeeded)
                {
                    result.DeletedUsers.Add(user.UserName ?? "unknown");
                }
                else
                {
                    result.Errors.AddRange(deleteResult.Errors.Select(e => e.Description));
                }
            }

            // 2. Удаление поставщиков
            var supplierNames = GetSimulationSupplierNames();
            var suppliers = await _context.Suppliers
                .Where(s => supplierNames.Contains(s.Name))
                .ToListAsync();

            foreach (var supplier in suppliers)
            {
                _context.Suppliers.Remove(supplier);
                result.DeletedSuppliers.Add(supplier.Name);
            }

            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<TestDataStatus> GetTestDataStatusAsync()
        {
            var simUsersCount = await _userManager.Users
                .CountAsync(u => u.UserName != null && u.UserName.StartsWith("sim_"));

            var supplierNames = GetSimulationSupplierNames();
            var suppliersCount = await _context.Suppliers
                .CountAsync(s => supplierNames.Contains(s.Name));

            return new TestDataStatus
            {
                SimulationUsersCount = simUsersCount,
                SimulationSuppliersCount = suppliersCount,
                HasTestData = simUsersCount > 0 || suppliersCount > 0
            };
        }

        private static List<(string UserName, string Email, string FirstName, string LastName, string Password)> GetSimulationUsers()
        {
            return new()
        {
            ("sim_customer1", "sim1@laboratorycolor.com", "Иван", "Петров", "Sim123!"),
            ("sim_customer2", "sim2@laboratorycolor.com", "Мария", "Иванова", "Sim123!"),
            ("sim_customer3", "sim3@laboratorycolor.com", "Алексей", "Сидоров", "Sim123!"),
            ("sim_customer4", "sim4@laboratorycolor.com", "Елена", "Козлова", "Sim123!"),
            ("sim_customer5", "sim5@laboratorycolor.com", "Дмитрий", "Смирнов", "Sim123!")
        };
        }


        private static List<(string Name, string ContactPerson, string Email, string Phone, string Inn)> GetSimulationSuppliers()
        {
            return new()
        {
            ("ООО 'Автокраски Плюс'", "Иван Иванов", "sales@autopaint.ru", "+7(495)123-45-67", "7701234567"),
            ("ИП 'Краски и Тони'", "Петр Петров", "order@kras-ka.ru", "+7(495)765-43-21", "7712345678"),
            ("ООО 'Автохимия'", "Сергей Сергеев", "info@autochim.ru", "+7(495)987-65-43", "7734567890")
        };
        }

        private static List<string> GetSimulationSupplierNames()
        {
            return new() { "ООО 'Автокраски Плюс'", "ИП 'Краски и Тони'", "ООО 'Автохимия'" };
        }
    }
}
