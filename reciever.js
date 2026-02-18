const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const app = express();

app.use(express.json());

// --- AYARLAR ---
const DATASET_ID = "1164374851913494"; 
const META_ACCESS_TOKEN = "EAAKf7ec5RTIBQky16FO7JtY62p0ju0DF0G8yFrNSUFbf46Ke4Dv7nhZAKM8Ckl2WW40bAzeCS9UQg4p8HeJDpl3D914SEL5CJJeJbNL4oy2tIhY9i2iTwcs8PJjZCk6DZBzcGeAX2dM5rsd6dK75NzrlRh3wU4xmUIZAYVIFpU3KsUQxiMzkr1h1ud9BQgGLxwZDZD";
const ESPO_URL = "https://crm.bereketlitopraklar.com.tr";
const ESPO_API_KEY = "1437a850a04bd4291a4b432bdd6ac02c";

// -----------------------------------------------------------------------------
// YARDIMCI FONKSİYONLAR
// -----------------------------------------------------------------------------

// 1. Hash Fonksiyonu (SHA-256) - Meta İçin
const hashData = (data) => {
    if (!data) return null;
    return crypto.createHash('sha256').update(data.toString().trim().toLowerCase()).digest('hex');
};

// 2. Akıllı Telefon Formatlayıcı
const formatPhone = (phone) => {
    if (!phone) return "";
    
    let str = phone.toString().trim();

    // Facebook Test Verisi Gelirse Temizle (<test lead...>)
    if (str.includes('test lead') || str.includes('dummy data')) return "";

    // Uluslararası format (+ veya 00 ile başlıyorsa) temizle
    if (str.startsWith('+') || str.startsWith('00')) {
        return str.replace(/\D/g, ''); 
    }

    // Sadece rakamları al
    let cleaned = str.replace(/\D/g, '');

    // Başında '0' varsa ve 11 haneyse (0532...) -> 532... yap
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }

    // Eğer 10 hane kaldıysa (532xxxxxxx), başına 90 ekle
    if (cleaned.length === 10) {
        return '90' + cleaned;
    }

    return cleaned;
};

// -----------------------------------------------------------------------------
// META CAPI FONKSİYONU
// -----------------------------------------------------------------------------

async function sendRawLead(leadId, email, phoneBase) {
    try {
        // Event ID: Deduplication için kritik (Lead ID'ye bağlıyoruz)
        const uniqueEventId = `LEAD_${leadId}`;
        
        // Telefon veya Email yoksa boş array gönderilir
        const userData = {
            lead_id: leadId,
            em: email && !email.includes('test lead') ? [hashData(email)] : [],
            ph: phoneBase ? [hashData(phoneBase)] : [] 
        };

        const payload = {
            data: [{
                event_name: "Lead",
                event_time: Math.floor(Date.now() / 1000),
                action_source: "system_generated",
                event_id: uniqueEventId,
                user_data: userData,
                custom_data: { 
                    event_source: "crm", 
                    lead_event_source: "EspoCRM_Webhook" 
                }
            }]
        };

        await axios.post(`https://graph.facebook.com/v24.0/${DATASET_ID}/events?access_token=${META_ACCESS_TOKEN}`, payload);
        console.log(`🚀 Meta [Raw Lead] Bildirildi. (Event ID: ${uniqueEventId})`);
    } catch (error) {
        console.error(`❌ Meta [Raw Lead] Hatası:`, error.response?.data || error.message);
    }
}

// -----------------------------------------------------------------------------
// WEBHOOK ENDPOINT (MAKE -> BURAYA)
// -----------------------------------------------------------------------------

app.post('/meta-webhook', async (req, res) => {
    console.log('\n--- [YENİ LEAD GELDİ (Giriş)] ---');
    
    // Değişkenleri try dışında tanımla (Catch bloğunda erişebilmek için)
    let email = "";
    let basePhone = "";
    let leadId = "";

    try {
        const body = req.body;
        
        // Gelen verileri al
        leadId = body.leadId;
        email = body.email;
        const { 
            fullName, 
            phoneNumber, 
            inboxUrl,         
            investmentHistory, 
            preferredRegion,   
            investmentGoal,    
            budgetRange,       
            source,
            formId // <-- Yeni eklenen Form ID
        } = body;
        
        // 1. İsim Temizleme ve Ayrıştırma
        const cleanName = (fullName || "Isimsiz").replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ\s]/g, "").trim();
        const parts = cleanName.split(/\s+/);
        const lastName = parts.length > 1 ? parts.pop() : 'Belirtilmedi';
        const firstName = parts.join(' ') || 'Isim';

        // 2. Telefon Formatlama
        basePhone = formatPhone(phoneNumber); // 90532... (Meta için)
        const crmPhone = basePhone ? `+${basePhone}` : ""; // +90532... (CRM için)

        // 3. Kaynak (Source) Belirleme
        let finalSource = 'Facebook'; // Varsayılan
        if (source) {
            const s = source.toString().toLowerCase();
            if (s === 'ig' || s.includes('insta')) {
                finalSource = 'Instagram';
            } else {
                finalSource = source; 
            }
        }

        // 4. CRM Payload Hazırlama
        const espoPayload = {
            firstName: firstName,
            lastName: lastName,
            name: cleanName,           
            cIsim: cleanName,          
            phoneNumber: crmPhone,
            emailAddress: email,
            
            // Özel Alanlar
            cArsagecmisi: investmentHistory || '', 
            cIlgilenilenBolge: preferredRegion || '', 
            cArsaamaci: investmentGoal || '', 
            cButce: budgetRange || '', 
            cInboxurl: inboxUrl || '', 
            cFacebookleadid: leadId,
            cFormid: formId || '', // <-- Form ID CRM'e gidiyor
            
            // Sistem Alanları
            source: finalSource,
            status: 'New',
            cFirstContactDateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        // 5. CRM'e Gönder (EspoCRM API)
        const espoRes = await axios.post(`${ESPO_URL}/api/v1/Lead`, espoPayload, { headers: { 'X-Api-Key': ESPO_API_KEY } });

        console.log(`✅ CRM Kaydı Başarılı: ${cleanName} | Kaynak: ${finalSource} | Form: ${formId}`);
        
        // 6. Başarılıysa Meta'ya Sinyal Çak
        if (leadId) await sendRawLead(leadId, email, basePhone);

        // Make'e Yanıt Dön
        res.status(200).json({ success: true, id: espoRes.data.id });

    } catch (error) {
        
        // -----------------------------------------------------
        // AKILLI HATA YÖNETİMİ (Mükerrer Kayıt / Duplicate)
        // -----------------------------------------------------
        const errorData = error.response?.data;
        const existingRecord = Array.isArray(errorData) ? errorData[0] : errorData;

        // Eğer CRM "Bu kayıt zaten var" derse (ID dönerse)
        if (existingRecord && existingRecord.id) {
            console.log(`⚠️ Mükerrer Kayıt Tespit Edildi! Mevcut ID: ${existingRecord.id}`);
            console.log(`🔄 Mevcut kayıt için Meta sinyali gönderiliyor...`);

            // Mükerrer olsa bile Meta'ya "Lead" olduğunu bildir (Optimizasyon için şart)
            if (leadId) await sendRawLead(leadId, email, basePhone);

            // Make'e hata döndürme, 200 dön ki akış bozulmasın
            return res.status(200).json({ success: true, id: existingRecord.id, note: "Duplicate accepted" });
        }

        // Gerçekten beklenmedik bir hataysa
        console.error("🔥 Kritik Giriş Hatası:", errorData || error.message);
        res.status(400).json({ success: false });
    }
});

// Port Dinleme (Cloudflare Tüneli Buraya Yönleniyor)
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Receiver (Giriş) Port ${PORT} aktif.`));