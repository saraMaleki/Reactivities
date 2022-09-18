using API.Extensions;
using API.Middleware;
using Application.Activities;
using Application.Core;
using Domain;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt => 
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
.AddFluentValidation(config =>{
    config.RegisterValidatorsFromAssemblyContaining<Create>();
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityService(builder.Configuration);
//send all to extensions
// builder.Services.AddSwaggerGen();

// builder.Services.AddDbContext<DataContext>(opt =>
// {
//     opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
// });

// builder.Services.AddCors(opt =>
// {
//     opt.AddPolicy("CorsPolicy", policy =>
//     {
//         policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
//     });
// });

// builder.Services.AddMediatR(typeof(List.Handler).Assembly);
// // builder.Services.AddMediatR(typeof(Details.Handler).Assembly);
// // builder.Services.AddMediatR(typeof(Create.Handler).Assembly);
// // builder.Services.AddMediatR(typeof(Edit.Handler).Assembly);

// builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
//send all to extensions

var app = builder.Build();
using var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
var services = serviceScope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    
    context.Database.MigrateAsync();
    await seed.SeedData(context,userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();


app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
