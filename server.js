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

// Yardımcı: Hash Fonksiyonu
const hashData = (data) => {
    if (!data) return null;
    return crypto.createHash('sha256').update(data.toString().trim().toLowerCase()).digest('hex');
};

// YENİ: GLOBAL TELEFON FORMATLAYICI
const formatPhone = (phone) => {
    if (!phone) return "";
    let str = phone.toString().trim();
    if (str.startsWith('+') || str.startsWith('00')) return str.replace(/\D/g, ''); 
    let cleaned = str.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    if (cleaned.length === 10) return '90' + cleaned;
    return cleaned;
};

// Yardımcı: Meta CAPI Gönderim Fonksiyonu
async function pushToMeta(eventName, leadData, uniqueEventId) {
    try {
        const formattedPhone = formatPhone(leadData.phoneNumber);

        const payload = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: "system_generated",
                event_id: uniqueEventId, 
                user_data: {
                    lead_id: leadData.cFacebookleadid,
                    em: leadData.emailAddress ? [hashData(leadData.emailAddress)] : [],
                    ph: formattedPhone ? [hashData(formattedPhone)] : [] 
                },
                custom_data: { 
                    event_source: "crm", 
                    lead_event_source: "EspoCRM",
                    status_value: leadData.status 
                }
            }]
        };

        console.log(`\n📤 [META - ${eventName}]: Gönderiliyor... (Event ID: ${uniqueEventId})`);
        await axios.post(`https://graph.facebook.com/v24.0/${DATASET_ID}/events?access_token=${META_ACCESS_TOKEN}`, payload);
        console.log(`🚀 Meta Yanıtı: Başarılı.`);
    } catch (error) {
        console.error(`❌ Meta [${eventName}] Hatası:`, error.response?.data || error.message);
    }
}

// --- 1. DURUM GÜNCELLEME WEBHOOK (GÜNCELLENDİ: ZİNCİRLEME MANTIK) ---
app.post('/webhook', async (req, res) => {
    console.log('\n--- [DURUM GÜNCELLEMESİ] ---');
    const items = Array.isArray(req.body) ? req.body : [req.body];

    // Sadece "Temas" sayılanlar
    const onlyContactStatuses = ['takipEt30', 'potansiyel50', 'musaitDegil', 'butceDisiPositive'];
    
    // Hem "Temas" hem "Nitelikli" sayılanlar
    const qualifiedStatuses = ['sicak80', 'sıcak80'];

    for (const item of items) {
        const leadId = item.id || (item.data && item.data.id);
        if (!leadId) continue;

        try {
            const lead = (await axios.get(`${ESPO_URL}/api/v1/Lead/${leadId}`, { headers: { 'X-Api-Key': ESPO_API_KEY } })).data;
            
            if (lead.cFacebookleadid) {
                
                // SENARYO 1: Müşteri direkt SICAK oldu (Zincirleme)
                if (qualifiedStatuses.includes(lead.status)) {
                    // Adım 1: Önce Contact gönder (Çünkü sıcaksa kesin konuşulmuştur)
                    const contactEventId = `CONTACT_${leadId}_${lead.status}`;
                    await pushToMeta("Contact", lead, contactEventId);

                    // Adım 2: Peşinden QualifiedLead gönder
                    const qualifiedEventId = `QUALIFIED_${leadId}_${lead.status}`;
                    await pushToMeta("QualifiedLead", lead, qualifiedEventId);
                }

                // SENARYO 2: Sadece Temas kuruldu (Henüz sıcak değil)
                else if (onlyContactStatuses.includes(lead.status)) {
                    const contactEventId = `CONTACT_${leadId}_${lead.status}`;
                    await pushToMeta("Contact", lead, contactEventId);
                }
            }
        } catch (e) { 
            console.error(`🔥 Hata (Lead ID: ${leadId}):`, e.message);
        }
    }
    res.status(200).send('OK');
});

// --- 2. TOPLANTI WEBHOOK (Schedule) ---
app.post('/meeting-webhook', async (req, res) => {
    console.log('\n--- [TOPLANTI WEBHOOK] ---');
    
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const item = items[0] || {};
    const meetingId = item.id || (item.data && item.data.id);
    
    if (!meetingId) return res.status(200).send('OK');

    try {
        const meetingRes = await axios.get(`${ESPO_URL}/api/v1/Meeting/${meetingId}`, { headers: { 'X-Api-Key': ESPO_API_KEY } });
        const meeting = meetingRes.data;

        // İptal Kontrolü
        const validMeetingStatuses = ['Planned', 'Held', 'Scheduled', 'Gerçekleşti', 'Planlandı']; 
        if (!validMeetingStatuses.includes(meeting.status)) {
            console.log(`🛑 Toplantı durumu '${meeting.status}' - Gönderilmedi.`);
            return res.status(200).send('OK');
        }

        let targetLeadId = null;
        if (meeting.parentType === 'Lead' && meeting.parentId) {
            targetLeadId = meeting.parentId;
        } else {
            const linkedLeadsRes = await axios.get(`${ESPO_URL}/api/v1/Meeting/${meetingId}/leads`, { headers: { 'X-Api-Key': ESPO_API_KEY } });
            if (linkedLeadsRes.data.list && linkedLeadsRes.data.list.length > 0) {
                targetLeadId = linkedLeadsRes.data.list[0].id;
            }
        }

        if (targetLeadId) {
            const leadRes = await axios.get(`${ESPO_URL}/api/v1/Lead/${targetLeadId}`, { headers: { 'X-Api-Key': ESPO_API_KEY } });
            const lead = leadRes.data;

            if (lead.cFacebookleadid) {
                const uniqueEventId = `MEETING_${meetingId}`;
                await pushToMeta("Schedule", lead, uniqueEventId);
            }
        }
    } catch (e) { console.error(`🔥 Hata:`, e.message); }
    
    res.status(200).send('OK');
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server (Çıkış) Port ${PORT} aktif.`));