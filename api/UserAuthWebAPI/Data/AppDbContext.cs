using Microsoft.EntityFrameworkCore;
using UserAuthWebAPI.Models;

namespace UserAuthWebAPI.Data {
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
        public DbSet<User> Users { get; set; }
    }
}
