using API.Data;
using API.Entities;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("https://localhost:4200", "https://localhost:5001/hub"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<PresenceHub>("hub/presence");
app.MapHub<MessageHub>("hub/message");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    var roleManager = services.GetRequiredService<RoleManager<Role>>();
    await context.Database.MigrateAsync();
    // context.Connections.RemoveRange(context.Connections);
    // await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [Connections]");
    await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]");
    // await Seed.SeedUsers(context);
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception)
{
    
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError("An error occurred during the migration");
}

app.Run();
