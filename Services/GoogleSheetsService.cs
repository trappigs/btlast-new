using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace btlast.Services
{
    public class GoogleSheetsSettings
    {
        public string? CredentialsPath { get; set; }
        public string? SpreadsheetId { get; set; }
        public string? ContactFormSheetName { get; set; }
        public string? AppointmentSheetName { get; set; }
    }

    public interface IGoogleSheetsService
    {
        Task<bool> AppendContactFormAsync(Dictionary<string, object?> data, string sheetName);
    }

    public class GoogleSheetsService : IGoogleSheetsService
    {
        private readonly GoogleSheetsSettings _settings;
        private readonly ILogger<GoogleSheetsService> _logger;

        public GoogleSheetsService(IOptions<GoogleSheetsSettings> settings, ILogger<GoogleSheetsService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        // Formula/CSV Injection koruması
        private string SanitizeForSheet(object? value)
        {
            if (value == null) return "";

            var stringValue = value.ToString() ?? "";

            // Boş string ise doğrudan dön
            if (string.IsNullOrWhiteSpace(stringValue)) return stringValue;

            // Eğer =, +, -, @ ile başlıyorsa, önüne tek tırnak (') ekle
            // Bu Excel/Sheets'in formül olarak yorumlamasını engeller
            char firstChar = stringValue.TrimStart()[0];
            if (firstChar == '=' || firstChar == '+' || firstChar == '-' || firstChar == '@')
            {
                return "'" + stringValue;
            }

            return stringValue;
        }

        public async Task<bool> AppendContactFormAsync(Dictionary<string, object?> data, string sheetName)
        {
            try
            {
                if (string.IsNullOrEmpty(_settings.CredentialsPath) ||
                    string.IsNullOrEmpty(_settings.SpreadsheetId))
                {
                    _logger.LogError("Google Sheets ayarları yapılandırılmamış.");
                    return false;
                }

                // Credentials dosyasını oku
                GoogleCredential credential;
                var credentialsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, _settings.CredentialsPath);

                if (!File.Exists(credentialsPath))
                {
                    _logger.LogError($"Credentials dosyası bulunamadı: {credentialsPath}");
                    return false;
                }

                using (var stream = new FileStream(credentialsPath, FileMode.Open, FileAccess.Read))
                {
                    credential = GoogleCredential.FromStream(stream)
                        .CreateScoped(SheetsService.Scope.Spreadsheets);
                }

                // Sheets service oluştur
                using var service = new SheetsService(new Google.Apis.Services.BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "bereketli-topraklar"
                });

                // Veri satırını hazırla
                var values = new List<object?>();

                // Sütun sırasına göre veriyi düzenle (Formula Injection korumalı)
                if (sheetName == _settings.ContactFormSheetName)
                {
                    // İletişim Formları: Tarih/Saat, Ad Soyad, E-posta, Telefon, Konu, Mesaj, KVKK Onayı, Kampanya İzni, Kaynak
                    values.Add(SanitizeForSheet(data.ContainsKey("Tarih") ? data["Tarih"] : DateTime.Now.ToString("dd.MM.yyyy HH:mm")));
                    values.Add(SanitizeForSheet(data.ContainsKey("Name") ? data["Name"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Email") ? data["Email"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Phone") ? data["Phone"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Subject") ? data["Subject"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Message") ? data["Message"] : ""));
                    values.Add(data.ContainsKey("KvkkConsent") ? (bool)data["KvkkConsent"] ? "Evet" : "Hayır" : "Hayır");
                    values.Add(data.ContainsKey("AllowCampaigns") ? (bool)data["AllowCampaigns"] ? "Evet" : "Hayır" : "Hayır");
                    values.Add(SanitizeForSheet(data.ContainsKey("Source") ? data["Source"] : ""));
                }
                else if (sheetName == _settings.AppointmentSheetName)
                {
                    // Randevu Talepleri: Tarih/Saat, Ad Soyad, E-posta, Telefon, Konu, Mesaj, Randevu Türü, Randevu Tarihi, Randevu Saati, KVKK Onayı, Kampanya İzni, Kaynak
                    values.Add(SanitizeForSheet(data.ContainsKey("Tarih") ? data["Tarih"] : DateTime.Now.ToString("dd.MM.yyyy HH:mm")));
                    values.Add(SanitizeForSheet(data.ContainsKey("Name") ? data["Name"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Email") ? data["Email"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Phone") ? data["Phone"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Subject") ? data["Subject"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("Message") ? data["Message"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("AppointmentType") ? data["AppointmentType"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("AppointmentDate") ? data["AppointmentDate"] : ""));
                    values.Add(SanitizeForSheet(data.ContainsKey("AppointmentTime") ? data["AppointmentTime"] : ""));
                    values.Add(data.ContainsKey("KvkkConsent") ? (bool)data["KvkkConsent"] ? "Evet" : "Hayır" : "Hayır");
                    values.Add(data.ContainsKey("AllowCampaigns") ? (bool)data["AllowCampaigns"] ? "Evet" : "Hayır" : "Hayır");
                    values.Add(SanitizeForSheet(data.ContainsKey("Source") ? data["Source"] : ""));
                }
                else
                {
                    _logger.LogError($"Bilinmeyen sheet adı: {sheetName}");
                    return false;
                }

                // AppendValues isteğini hazırla
                // İletişim Formları: A:J (10 sütun), Randevu Talepleri: A:L (12 sütun)
                var range = sheetName == _settings.AppointmentSheetName ? $"'{sheetName}'!A:L" : $"'{sheetName}'!A:J";
                var valueRange = new ValueRange() { Values = new List<IList<object?>> { values } };

                var appendRequest = service.Spreadsheets.Values.Append(valueRange, _settings.SpreadsheetId, range);
                appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.USERENTERED;

                var appendResponse = await appendRequest.ExecuteAsync();

                if (appendResponse?.Updates?.UpdatedRows > 0)
                {
                    _logger.LogInformation($"Google Sheets'e {sheetName} sayfasına başarıyla veri eklendi.");
                    return true;
                }
                else
                {
                    _logger.LogWarning("Google Sheets'e veri eklenirken beklenmeyen bir durum oluştu.");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Google Sheets'e veri eklenirken hata oluştu.");
                return false;
            }
        }
    }
}
