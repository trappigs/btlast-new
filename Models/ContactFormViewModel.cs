using System.ComponentModel.DataAnnotations;

namespace btlast.Models
{
    public class ContactFormViewModel : IValidatableObject
    {
        // Ortak Alanlar
        [Required(ErrorMessage = "Ad Soyad alanı zorunludur.")]
        [MaxLength(100, ErrorMessage = "Ad Soyad 100 karakterden uzun olamaz.")]
        public string? Name { get; set; }

        // E-posta alanı artık zorunlu değil
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        [MaxLength(100, ErrorMessage = "E-posta 100 karakterden uzun olamaz.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Telefon alanı zorunludur.")]
        [MaxLength(20, ErrorMessage = "Telefon 20 karakterden uzun olamaz.")]
        public string? Phone { get; set; }

        [Range(typeof(bool), "true", "true", ErrorMessage = "KVKK onayı zorunludur.")]
        public bool KvkkConsent { get; set; }
        public bool AllowCampaigns { get; set; }

        // Form Tipini Belirleme
        [Required]
        public string? FormType { get; set; }

        // Sadece İletişim Formu Alanları
        [MaxLength(200, ErrorMessage = "Konu 200 karakterden uzun olamaz.")]
        public string? Subject { get; set; }

        [MaxLength(2000, ErrorMessage = "Mesaj 2000 karakterden uzun olamaz.")]
        public string? Message { get; set; }

        // Randevu/İletişim Formu Alanları
        public string? AppointmentType { get; set; }
        public string? AppointmentDate { get; set; }
        public string? AppointmentTime { get; set; }

        // UTM Tracking Alanları (Güvenlik: MaxLength ile sınırlandırılmış)
        [MaxLength(200, ErrorMessage = "UTM Source 200 karakterden uzun olamaz.")]
        [RegularExpression(@"^[a-zA-Z0-9_\-\.\/\s]*$", ErrorMessage = "UTM Source geçersiz karakterler içeriyor.")]
        public string? UtmSource { get; set; }

        [MaxLength(200, ErrorMessage = "UTM Medium 200 karakterden uzun olamaz.")]
        [RegularExpression(@"^[a-zA-Z0-9_\-\.\/\s]*$", ErrorMessage = "UTM Medium geçersiz karakterler içeriyor.")]
        public string? UtmMedium { get; set; }

        [MaxLength(200, ErrorMessage = "UTM Campaign 200 karakterden uzun olamaz.")]
        [RegularExpression(@"^[a-zA-Z0-9_\-\.\/\s]*$", ErrorMessage = "UTM Campaign geçersiz karakterler içeriyor.")]
        public string? UtmCampaign { get; set; }

        [MaxLength(200, ErrorMessage = "UTM Term 200 karakterden uzun olamaz.")]
        [RegularExpression(@"^[a-zA-Z0-9_\-\.\/\s]*$", ErrorMessage = "UTM Term geçersiz karakterler içeriyor.")]
        public string? UtmTerm { get; set; }

        [MaxLength(200, ErrorMessage = "UTM Content 200 karakterden uzun olamaz.")]
        [RegularExpression(@"^[a-zA-Z0-9_\-\.\/\s]*$", ErrorMessage = "UTM Content geçersiz karakterler içeriyor.")]
        public string? UtmContent { get; set; }

        [MaxLength(500, ErrorMessage = "Referrer 500 karakterden uzun olamaz.")]
        [Url(ErrorMessage = "Referrer geçerli bir URL olmalıdır.")]
        public string? Referrer { get; set; }

        [MaxLength(500, ErrorMessage = "Landing Page 500 karakterden uzun olamaz.")]
        [Url(ErrorMessage = "Landing Page geçerli bir URL olmalıdır.")]
        public string? LandingPage { get; set; }

        // Koşullu Doğrulama Metodu
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrWhiteSpace(AppointmentType))
            {
                yield return new ValidationResult("İletişim Türü alanı zorunludur.", new[] { nameof(AppointmentType) });
            }

            if (AppointmentType == "Online Görüşme" || AppointmentType == "Yüz Yüze Görüşme")
            {
                if (string.IsNullOrWhiteSpace(AppointmentDate))
                {
                    yield return new ValidationResult("Randevu Tarihi alanı zorunludur.", new[] { nameof(AppointmentDate) });
                }
                if (string.IsNullOrWhiteSpace(AppointmentTime))
                {
                    yield return new ValidationResult("Randevu Saati alanı zorunludur.", new[] { nameof(AppointmentTime) });
                }
            }
        }
    }
}