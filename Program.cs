using btlast.Controller;
using btlast.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// SMTP Ayarları
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

// Google Sheets Ayarları
builder.Services.Configure<GoogleSheetsSettings>(builder.Configuration.GetSection("GoogleSheets"));
builder.Services.AddScoped<IGoogleSheetsService, GoogleSheetsService>();

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();