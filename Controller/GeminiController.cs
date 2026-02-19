using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;
using Umbraco.Cms.Web.Common.Controllers;

namespace btlast.Controller
{
    public class GeminiController : UmbracoApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public GeminiController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<IActionResult> GenerateProfile([FromBody] Weights weights)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return BadRequest(new { error = "API key not configured on server. Please check appsettings.json section 'Gemini:ApiKey'." });
            }

            var total = weights.trust + weights.profit + weights.life;
            if (total == 0) total = 1;
            
            // Calculate percentages
            double tPer = Math.Round((double)weights.trust / total * 100);
            double pPer = Math.Round((double)weights.profit / total * 100);
            double lPer = Math.Round((double)weights.life / total * 100);

            var prompt = $@"Kullanıcı ""Bereketli Topraklar"" yatırım testinde şu skorları aldı: 
            Güven Odaklılık: %{tPer}
            Kazanç Motivasyonu: %{pPer}
            Toprak/Somutluk Eğilimi: %{lPer}

            Bu verilere göre kullanıcının yatırımcı karakterini belirle. Analiz yaparken ""Bereketli Topraklar"" firmasının değerlerini (şeffaflık, güven, imarlı arsa avantajı) ön plana çıkar.
            Profil isimleri şunlardan biri olabilir: ""Sabırlı Toprak Yatırımcısı"", ""Vizyoner Fırsat Kollayan"", ""Güven Arayan Gelenekselci"", ""Mantıksal Stratejist"", ""Aktif Kazanç Avcısı"".

            Yanıtı JSON formatında şu şemaya göre ver:
            {{
              ""styleName"": ""Profil Adı"",
              ""title"": ""Vurucu Başlık (Bereketli Topraklar vurgulu)"",
              ""description"": ""Karakter analizi (2-3 cümle)"",
              ""riskTolerance"": ""Düşük/Orta/Yüksek"",
              ""recommendation"": ""Spesifik imarlı arsa yatırım tavsiyesi (Bursa-Balıkesir gibi lokasyonlar örnek verilebilir)"",
              ""logicAnalysis"": ""Puan dağılımına göre Bereketli Topraklar'ın sunduğu çözümlerle uyumlu mini bir yorum""
            }}";

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                },
                generationConfig = new
                {
                    responseMimeType = "application/json"
                }
            };

            try
            {
                var client = _httpClientFactory.CreateClient();
                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

                var response = await client.PostAsync(url, new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json"));

                if (!response.IsSuccessStatusCode)
                {
                    var errorDetails = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new { error = "Gemini API Error", details = errorDetails });
                }

                var result = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(result);
                
                // Gemini API returns text in candidates[0].content.parts[0].text
                var textResponse = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return Content(textResponse, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }

        public class Weights
        {
            public int trust { get; set; }
            public int profit { get; set; }
            public int life { get; set; }
        }
    }
}

