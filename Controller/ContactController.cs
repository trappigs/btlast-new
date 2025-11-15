using btlast.Models;
using btlast.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Web.Website.Controllers;
// --- MailKit Kütüphaneleri ---
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace btlast.Controller
{
    // Smtp ayarlarını appsettings.json'dan okumak için sınıfımız
    public class SmtpSettings
    {
        public string To { get; set; } = "info@bereketlitopraklar.com.tr";
        public string From { get; set; } = "bereketliform@gmail.com";
        public string Host { get; set; } = "smtp.gmail.com";
        public int Port { get; set; } = 587;
        public string Username { get; set; } = "bereketliform@gmail.com";
        public string Password { get; set; } = "wafq dtwp swxo vjpn";
        public string SecureSocketOptions { get; set; } = "StartTls";
    }

    public class ContactController : SurfaceController
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly ILogger<ContactController> _logger;
        private readonly IGoogleSheetsService _googleSheetsService;

        public ContactController(
            IUmbracoContextAccessor umbracoContextAccessor,
            IUmbracoDatabaseFactory databaseFactory,
            ServiceContext services,
            AppCaches appCaches,
            IProfilingLogger profilingLogger,
            IPublishedUrlProvider publishedUrlProvider,
            IOptions<SmtpSettings> smtpSettings,
            ILogger<ContactController> logger,
            IGoogleSheetsService googleSheetsService)
            : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
        {
            _smtpSettings = smtpSettings.Value;
            _logger = logger;
            _googleSheetsService = googleSheetsService;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SubmitContactForm(ContactFormViewModel model)
        {
            // Model geçerliliği kontrolü (değişiklik yok)
            if (!ModelState.IsValid)
            {
                var errors = ModelState.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray()
                );
                return new JsonResult(new { success = false, errors });
            }

            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_smtpSettings.From, _smtpSettings.From));
                email.To.Add(new MailboxAddress("Bereketli Topraklar", _smtpSettings.To));

                email.Subject = model.FormType == "contact"
                    ? $"Web Sitesi İletişim Formu: {model.Subject}"
                    : $"Web Sitesi Randevu Talebi: {model.Name}";

                email.Body = new TextPart(TextFormat.Html) { Text = BuildEmailBody(model) };

                // Bu blok MailKit'in doğru SmtpClient'ını kullanacak
                using var smtp = new MailKit.Net.Smtp.SmtpClient();

                var secureSocketOptions = Enum.Parse<MailKit.Security.SecureSocketOptions>(_smtpSettings.SecureSocketOptions, true);

                // Hatalı metotlar düzeltildi
                await smtp.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, secureSocketOptions);
                await smtp.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                // Google Sheets'e veri ekle
                var sheetData = new Dictionary<string, object?>
                {
                    { "Tarih", DateTime.Now.ToString("dd.MM.yyyy HH:mm") },
                    { "Name", model.Name },
                    { "Email", model.Email },
                    { "Phone", model.Phone },
                    { "Subject", model.FormType == "contact" ? model.Subject : model.AppointmentType },
                    { "Message", model.Message },
                    { "AppointmentType", model.AppointmentType },
                    { "KvkkConsent", model.KvkkConsent },
                    { "AllowCampaigns", model.AllowCampaigns }
                };

                string sheetName = model.FormType == "contact" ? "İletişim Formları" : "Randevu Talepleri";
                await _googleSheetsService.AppendContactFormAsync(sheetData, sheetName);

                string successMessage = model.FormType == "contact"
                    ? "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız."
                    : "Randevu talebiniz başarıyla alındı. Onay için sizinle iletişime geçeceğiz.";

                return new JsonResult(new { success = true, message = successMessage, formType = model.FormType });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MailKit ile e-posta gönderilirken bir hata oluştu.");
                return new JsonResult(new { success = false, error = "Mesajınız gönderilirken bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin." });
            }
        }

        // BuildEmailBody metodu aynı kalabilir.
        private string BuildEmailBody(ContactFormViewModel model)
        {
            var body = "<html><body style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>";
            body += $"<h2 style='color: #045129;'>Yeni bir form gönderimi aldınız: ({model.FormType})</h2>";
            body += "<hr>";
            body += $"<p><strong>Ad Soyad:</strong> {model.Name}</p>";
            body += $"<p><strong>E-posta:</strong> {model.Email}</p>";
            body += $"<p><strong>Telefon:</strong> {model.Phone}</p>";
            body += $"<p><strong>KVKK Onayı:</strong> {(model.KvkkConsent ? "Evet" : "Hayır")}</p>";
            body += $"<p><strong>Kampanya İzni:</strong> {(model.AllowCampaigns ? "Evet" : "Hayır")}</p>";

            if (model.FormType == "contact")
            {
                body += $"<p><strong>Konu:</strong> {model.Subject}</p>";
                body += $"<p><strong>Mesaj:</strong><br><div style='padding: 10px; border: 1px solid #eee; border-radius: 5px;'>{model.Message?.Replace("\n", "<br>")}</div></p>";
            }
            else // appointment
            {
                body += "<hr style='margin: 20px 0;'>";
                body += "<h3>Randevu Detayları</h3>";
                body += $"<p><strong>Randevu Türü:</strong> {model.AppointmentType}</p>";
                body += $"<p><strong>Randevu Tarihi:</strong> {model.AppointmentDate}</p>";
                body += $"<p><strong>Randevu Saati:</strong> {model.AppointmentTime}</p>";
                if (!string.IsNullOrEmpty(model.Message))
                {
                    body += $"<p><strong>Ek Notlar:</strong><br><div style='padding: 10px; border: 1px solid #eee; border-radius: 5px;'>{model.Message.Replace("\n", "<br>")}</div></p>";
                }
            }

            body += "<hr style='margin-top: 20px;'>";
            body += $"<p style='font-size: 12px; color: #888;'>Bu e-posta {DateTime.Now:dd.MM.yyyy HH:mm} tarihinde web sitesi üzerinden gönderilmiştir.</p>";
            body += "</body></html>";

            return body;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SubmitQuickForm(ContactFormViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Phone) || !model.KvkkConsent)
            {
                return new JsonResult(new { success = false, error = "Ad Soyad, Telefon ve KVKK onayı zorunludur." });
            }

            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_smtpSettings.From, _smtpSettings.From));
                email.To.Add(new MailboxAddress("Bereketli Topraklar", _smtpSettings.To));

                email.Subject = $"Web Sitesi Hızlı İletişim Talebi: {model.Name}";
                email.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<p><strong>Ad Soyad:</strong> {model.Name}</p>" +
                           $"<p><strong>Telefon:</strong> {model.Phone}</p>" +
                           $"<p><strong>KVKK Onayı:</strong> {(model.KvkkConsent ? "Evet" : "Hayır")}</p>" +
                           $"<p><strong>Kampanya İzni:</strong> {(model.AllowCampaigns ? "Evet" : "Hayır")}</p>" +
                           $"<hr><p style='font-size:12px;color:#888'>Bu form {DateTime.Now:dd.MM.yyyy HH:mm} tarihinde dolduruldu.</p>"
                };

                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                var secureSocketOptions = Enum.Parse<MailKit.Security.SecureSocketOptions>(_smtpSettings.SecureSocketOptions, true);
                await smtp.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, secureSocketOptions);
                await smtp.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                // Google Sheets'e veri ekle (İletişim Formları sayfası)
                var sheetData = new Dictionary<string, object?>
                {
                    { "Tarih", DateTime.Now.ToString("dd.MM.yyyy HH:mm") },
                    { "Name", model.Name },
                    { "Email", model.Email },
                    { "Phone", model.Phone },
                    { "Subject", "" },
                    { "Message", "" },
                    { "KvkkConsent", model.KvkkConsent },
                    { "AllowCampaigns", model.AllowCampaigns }
                };

                await _googleSheetsService.AppendContactFormAsync(sheetData, "İletişim Formları");

                return new JsonResult(new { success = true, message = "Teşekkürler! En kısa sürede sizi arayacağız." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Hızlı iletişim formu gönderilirken hata oluştu.");
                return new JsonResult(new { success = false, error = "Mesajınız gönderilirken hata oluştu." });
            }
        }


    }
}
