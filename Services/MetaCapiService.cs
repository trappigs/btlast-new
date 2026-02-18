using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace btlast.Services
{
    public class MetaCapiService : IMetaCapiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<MetaCapiService> _logger;

        // Constants from the provided reference files
        private const string DATASET_ID = "1164374851913494";
        private const string ACCESS_TOKEN = "EAAKf7ec5RTIBQky16FO7JtY62p0ju0DF0G8yFrNSUFbf46Ke4Dv7nhZAKM8Ckl2WW40bAzeCS9UQg4p8HeJDpl3D914SEL5CJJeJbNL4oy2tIhY9i2iTwcs8PJjZCk6DZBzcGeAX2dM5rsd6dK75NzrlRh3wU4xmUIZAYVIFpU3KsUQxiMzkr1h1ud9BQgGLxwZDZD";
        private const string API_VERSION = "v24.0";
        
        // Buraya Meta'dan aldığınız test kodunu yazın (Örn: "TEST12345"). 
        // Canlıya alırken boş bırakın ("").
        private const string TEST_CODE = ""; 

        public MetaCapiService(HttpClient httpClient, ILogger<MetaCapiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task SendLeadEventAsync(string eventId, string email, string phone, string source, string userAgent, string userIp, string fbp, string fbc)
        {
            await SendEventAsync("Lead", eventId, email, phone, source, userAgent, userIp, fbp, fbc);
        }

        public async Task SendViewContentEventAsync(string eventId, string contentName, string source, string userAgent, string userIp, string currentUrl, string fbp, string fbc)
        {
            try
            {
                var userData = new Dictionary<string, object>();
                
                if (!string.IsNullOrWhiteSpace(userIp)) userData["client_ip_address"] = userIp;
                if (!string.IsNullOrWhiteSpace(userAgent)) userData["client_user_agent"] = userAgent;
                if (!string.IsNullOrWhiteSpace(fbp)) userData["fbp"] = fbp;
                if (!string.IsNullOrWhiteSpace(fbc)) userData["fbc"] = fbc;

                var customData = new Dictionary<string, object>
                {
                    { "event_source", source ?? "website" },
                    { "content_name", contentName ?? "" }
                };

                var eventData = new
                {
                    event_name = "ViewContent",
                    event_time = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    action_source = "website",
                    event_id = eventId,
                    event_source_url = currentUrl,
                    user_data = userData,
                    custom_data = customData
                };

                var payload = new { data = new[] { eventData } };
                await SendToMetaAsync(payload, "ViewContent");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception sending Meta CAPI event ViewContent");
            }
        }

        public async Task SendEventAsync(string eventName, string eventId, string email, string phone, string source, string userAgent, string userIp, string fbp, string fbc)
        {
            try
            {
                var userData = new Dictionary<string, object>();

                if (!string.IsNullOrWhiteSpace(email) && !email.Contains("test lead"))
                {
                    userData["em"] = new[] { HashData(email) };
                }

                string formattedPhone = FormatPhone(phone);
                if (!string.IsNullOrWhiteSpace(formattedPhone))
                {
                    userData["ph"] = new[] { HashData(formattedPhone) };
                }
                
                // Add IP and User Agent for better match quality
                if (!string.IsNullOrWhiteSpace(userIp)) userData["client_ip_address"] = userIp;
                if (!string.IsNullOrWhiteSpace(userAgent)) userData["client_user_agent"] = userAgent;
                if (!string.IsNullOrWhiteSpace(fbp)) userData["fbp"] = fbp;
                if (!string.IsNullOrWhiteSpace(fbc)) userData["fbc"] = fbc;

                var eventData = new
                {
                    event_name = eventName,
                    event_time = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    action_source = "website", 
                    event_id = eventId,
                    user_data = userData,
                    custom_data = new
                    {
                        event_source = source ?? "website",
                        lead_event_source = "CAPI_NetCore"
                    }
                };

                var payload = new
                {
                    data = new[] { eventData },
                    test_event_code = !string.IsNullOrEmpty(TEST_CODE) ? TEST_CODE : null
                };

                await SendToMetaAsync(payload, eventName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception sending Meta CAPI event {eventName}");
            }
        }

        private async Task SendToMetaAsync(object payload, string eventName)
        {
            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var url = $"https://graph.facebook.com/{API_VERSION}/{DATASET_ID}/events?access_token={ACCESS_TOKEN}";

            _logger.LogInformation($"Sending Meta CAPI event: {eventName}");

            var response = await _httpClient.PostAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation($"Meta CAPI event {eventName} sent successfully.");
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"Meta CAPI event {eventName} failed. Status: {response.StatusCode}, Error: {errorContent}");
            }
        }

        private string HashData(string data)
        {
            if (string.IsNullOrWhiteSpace(data)) return null;

            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(data.Trim().ToLowerInvariant());
                var hash = sha256.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
            }
        }

        private string FormatPhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return "";

            string str = phone.Trim();

            // Clean international prefixes
            if (str.StartsWith("+") || str.StartsWith("00"))
            {
                 // Remove non-digit chars
                 return System.Text.RegularExpressions.Regex.Replace(str, @"\D", "");
            }

            // Remove non-digit chars
            string cleaned = System.Text.RegularExpressions.Regex.Replace(str, @"\D", "");

            // If starts with 0 and length is 11 (e.g. 0532...), remove 0
            if (cleaned.Length == 11 && cleaned.StartsWith("0"))
            {
                cleaned = cleaned.Substring(1);
            }

            // If length is 10, add 90
            if (cleaned.Length == 10)
            {
                return "90" + cleaned;
            }

            return cleaned;
        }
    }
}
