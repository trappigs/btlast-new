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
using Microsoft.Extensions.Caching.Memory;

namespace btlast.Controller
{
    // Smtp ayarlarını appsettings.json'dan okumak için sınıfımız
    public class SmtpSettings
    {
        public string To { get; set; } = string.Empty;
        public string From { get; set; } = string.Empty;
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string SecureSocketOptions { get; set; } = string.Empty;
    }

    public class ContactController : SurfaceController
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly ILogger<ContactController> _logger;
        private readonly IGoogleSheetsService _googleSheetsService;
        private readonly IMetaCapiService _metaCapiService;
        private readonly IMemoryCache _cache;
        private const int MaxFormsPerDay = 5;

        public ContactController(
            IUmbracoContextAccessor umbracoContextAccessor,
            IUmbracoDatabaseFactory databaseFactory,
            ServiceContext services,
            AppCaches appCaches,
            IProfilingLogger profilingLogger,
            IPublishedUrlProvider publishedUrlProvider,
            IOptions<SmtpSettings> smtpSettings,
            ILogger<ContactController> logger,
            IGoogleSheetsService googleSheetsService,
            IMetaCapiService metaCapiService,
            IMemoryCache cache)
            : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
        {
            _smtpSettings = smtpSettings.Value;
            _logger = logger;
            _googleSheetsService = googleSheetsService;
            _metaCapiService = metaCapiService;
            _cache = cache;
        }

        // Rate Limiting Kontrolü
        private bool CheckRateLimit(out string errorMessage)
        {
            errorMessage = string.Empty;

            // IP adresini al
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // Bugün için cache key oluştur
            var today = DateTime.UtcNow.Date.ToString("yyyyMMdd");
            var cacheKey = $"FormSubmission_{ipAddress}_{today}";

            // Cache'den mevcut sayıyı al
            if (!_cache.TryGetValue(cacheKey, out int submissionCount))
            {
                submissionCount = 0;
            }

            // Limit kontrolü
            if (submissionCount >= MaxFormsPerDay)
            {
                _logger.LogWarning($"Rate limit aşıldı. IP: {ipAddress}, Günlük gönderim: {submissionCount}");
                errorMessage = $"Günlük form gönderim limitinizi aştınız. Lütfen yarın tekrar deneyin. (Limit: {MaxFormsPerDay} form/gün)";
                return false;
            }

            // Sayacı artır ve cache'e kaydet (gece yarısına kadar geçerli)
            submissionCount++;
            var expirationTime = DateTime.UtcNow.Date.AddDays(1).AddHours(3); // UTC+3 için Türkiye saatine göre gece yarısı
            _cache.Set(cacheKey, submissionCount, expirationTime);

            _logger.LogInformation($"Form gönderimi kabul edildi. IP: {ipAddress}, Günlük gönderim: {submissionCount}/{MaxFormsPerDay}");
            return true;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SubmitContactForm(ContactFormViewModel model)
        {
            // Rate Limiting Kontrolü
            if (!CheckRateLimit(out string rateLimitError))
            {
                return new JsonResult(new { success = false, error = rateLimitError });
            }

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

                // UTM kaynak bilgisini oluştur
                string sourceInfo = BuildSourceInfo(model);

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
                    { "AppointmentDate", model.AppointmentDate },
                    { "AppointmentTime", model.AppointmentTime },
                    { "KvkkConsent", model.KvkkConsent },
                    { "AllowCampaigns", model.AllowCampaigns },
                    { "Source", sourceInfo }
                };

                string sheetName = model.FormType == "contact" ? "İletişim Formları" : "Randevu Talepleri";
                await _googleSheetsService.AppendContactFormAsync(sheetData, sheetName);

                // --- Meta CAPI Integration ---
                string eventId = Guid.NewGuid().ToString();
                string userAgent = Request.Headers["User-Agent"].ToString();
                string userIp = HttpContext.Connection.RemoteIpAddress?.ToString();
                
                // Extract Meta Cookies
                string fbp = Request.Cookies["_fbp"];
                string fbc = Request.Cookies["_fbc"];

                // Fire and forget (or await if critical) - Awaiting to ensure it's sent
                await _metaCapiService.SendLeadEventAsync(eventId, model.Email, model.Phone, "WebForm_" + model.FormType, userAgent, userIp, fbp, fbc);
                // -----------------------------

                string successMessage = model.FormType == "contact"
                    ? "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız."
                    : "Randevu talebiniz başarıyla alındı. Onay için sizinle iletişime geçeceğiz.";

                return new JsonResult(new { success = true, message = successMessage, formType = model.FormType, eventId = eventId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MailKit ile e-posta gönderilirken bir hata oluştu.");
                return new JsonResult(new { success = false, error = "Mesajınız gönderilirken bir sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin." });
            }
        }

        // UTM kaynak bilgisini oluştur (XSS korumalı)
        private string BuildSourceInfo(ContactFormViewModel model)
        {
            var sourceParts = new List<string>();

            if (!string.IsNullOrWhiteSpace(model.UtmSource))
            {
                sourceParts.Add($"Kaynak: {WebUtility.HtmlEncode(model.UtmSource)}");
            }
            if (!string.IsNullOrWhiteSpace(model.UtmMedium))
            {
                sourceParts.Add($"Medya: {WebUtility.HtmlEncode(model.UtmMedium)}");
            }
            if (!string.IsNullOrWhiteSpace(model.UtmCampaign))
            {
                sourceParts.Add($"Kampanya: {WebUtility.HtmlEncode(model.UtmCampaign)}");
            }
            if (!string.IsNullOrWhiteSpace(model.UtmTerm))
            {
                sourceParts.Add($"Anahtar Kelime: {WebUtility.HtmlEncode(model.UtmTerm)}");
            }
            if (!string.IsNullOrWhiteSpace(model.UtmContent))
            {
                sourceParts.Add($"İçerik: {WebUtility.HtmlEncode(model.UtmContent)}");
            }

            return sourceParts.Count > 0 ? string.Join(" | ", sourceParts) : "Doğrudan Trafik";
        }

        private string BuildEmailBody(ContactFormViewModel model)
        {
            var body = "<html><body style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>";
            body += $"<h2 style='color: #045129;'>Yeni bir form gönderimi aldınız: ({WebUtility.HtmlEncode(model.FormType)})</h2>";
            body += "<hr>";
            body += $"<p><strong>Ad Soyad:</strong> {WebUtility.HtmlEncode(model.Name)}</p>";
            body += $"<p><strong>E-posta:</strong> {WebUtility.HtmlEncode(model.Email)}</p>";
            body += $"<p><strong>Telefon:</strong> {WebUtility.HtmlEncode(model.Phone)}</p>";
            body += $"<p><strong>KVKK Onayı:</strong> {(model.KvkkConsent ? "Evet" : "Hayır")}</p>";
            body += $"<p><strong>Kampanya İzni:</strong> {(model.AllowCampaigns ? "Evet" : "Hayır")}</p>";

            if (model.FormType == "contact")
            {
                body += $"<p><strong>Konu:</strong> {WebUtility.HtmlEncode(model.Subject)}</p>";
                body += $"<p><strong>Mesaj:</strong><br><div style='padding: 10px; border: 1px solid #eee; border-radius: 5px;'>{WebUtility.HtmlEncode(model.Message)?.Replace("\n", "<br>")}</div></p>";
            }
            else // appointment
            {
                body += "<hr style='margin: 20px 0;'>";
                body += "<h3>Randevu Detayları</h3>";
                body += $"<p><strong>Randevu Türü:</strong> {WebUtility.HtmlEncode(model.AppointmentType)}</p>";
                body += $"<p><strong>Randevu Tarihi:</strong> {WebUtility.HtmlEncode(model.AppointmentDate)}</p>";
                body += $"<p><strong>Randevu Saati:</strong> {WebUtility.HtmlEncode(model.AppointmentTime)}</p>";
                if (!string.IsNullOrEmpty(model.Message))
                {
                    body += $"<p><strong>Ek Notlar:</strong><br><div style='padding: 10px; border: 1px solid #eee; border-radius: 5px;'>{WebUtility.HtmlEncode(model.Message).Replace("\n", "<br>")}</div></p>";
                }
            }

            body += "<hr style='margin-top: 20px;'>";

            // Kaynak bilgisini ekle (zaten BuildSourceInfo içinde encode ediliyor)
            string sourceInfo = BuildSourceInfo(model);
            body += "<h3>Kaynak Bilgileri</h3>";
            body += $"<p><strong>Trafik Kaynağı:</strong> {sourceInfo}</p>";

            if (!string.IsNullOrWhiteSpace(model.Referrer))
            {
                body += $"<p><strong>Yönlendiren:</strong> {WebUtility.HtmlEncode(model.Referrer)}</p>";
            }
            if (!string.IsNullOrWhiteSpace(model.LandingPage))
            {
                body += $"<p><strong>İlk Giriş Sayfası:</strong> {WebUtility.HtmlEncode(model.LandingPage)}</p>";
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
            // Rate Limiting Kontrolü
            if (!CheckRateLimit(out string rateLimitError))
            {
                return new JsonResult(new { success = false, error = rateLimitError });
            }

            if (string.IsNullOrWhiteSpace(model.Name) || string.IsNullOrWhiteSpace(model.Phone) || !model.KvkkConsent)
            {
                return new JsonResult(new { success = false, error = "Ad Soyad, Telefon ve KVKK onayı zorunludur." });
            }

            try
            {
                // UTM kaynak bilgisini oluştur
                string sourceInfo = BuildSourceInfo(model);

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_smtpSettings.From, _smtpSettings.From));
                email.To.Add(new MailboxAddress("Bereketli Topraklar", _smtpSettings.To));

                email.Subject = $"Web Sitesi Hızlı İletişim Talebi: {WebUtility.HtmlEncode(model.Name)}";

                var emailBody = $"<p><strong>Ad Soyad:</strong> {WebUtility.HtmlEncode(model.Name)}</p>" +
                           $"<p><strong>Telefon:</strong> {WebUtility.HtmlEncode(model.Phone)}</p>" +
                           $"<p><strong>KVKK Onayı:</strong> {(model.KvkkConsent ? "Evet" : "Hayır")}</p>" +
                           $"<p><strong>Kampanya İzni:</strong> {(model.AllowCampaigns ? "Evet" : "Hayır")}</p>" +
                           $"<hr>" +
                           $"<h3>Kaynak Bilgileri</h3>" +
                           $"<p><strong>Trafik Kaynağı:</strong> {sourceInfo}</p>";

                if (!string.IsNullOrWhiteSpace(model.Referrer))
                {
                    emailBody += $"<p><strong>Yönlendiren:</strong> {WebUtility.HtmlEncode(model.Referrer)}</p>";
                }
                if (!string.IsNullOrWhiteSpace(model.LandingPage))
                {
                    emailBody += $"<p><strong>İlk Giriş Sayfası:</strong> {WebUtility.HtmlEncode(model.LandingPage)}</p>";
                }

                emailBody += $"<hr><p style='font-size:12px;color:#888'>Bu form {DateTime.Now:dd.MM.yyyy HH:mm} tarihinde dolduruldu.</p>";

                email.Body = new TextPart(TextFormat.Html)
                {
                    Text = emailBody
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
                    { "AllowCampaigns", model.AllowCampaigns },
                    { "Source", sourceInfo }
                };

                await _googleSheetsService.AppendContactFormAsync(sheetData, "İletişim Formları");

                // --- Meta CAPI Integration ---
                string eventId = Guid.NewGuid().ToString();
                string userAgent = Request.Headers["User-Agent"].ToString();
                string userIp = HttpContext.Connection.RemoteIpAddress?.ToString();
                
                // Extract Meta Cookies
                string fbp = Request.Cookies["_fbp"];
                string fbc = Request.Cookies["_fbc"];

                await _metaCapiService.SendLeadEventAsync(eventId, model.Email, model.Phone, "WebForm_Quick", userAgent, userIp, fbp, fbc);
                // -----------------------------

                return new JsonResult(new { success = true, message = "Teşekkürler! En kısa sürede sizi arayacağız.", eventId = eventId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Hızlı iletişim formu gönderilirken hata oluştu.");
                return new JsonResult(new { success = false, error = "Mesajınız gönderilirken hata oluştu." });
            }
        }


    }
}
