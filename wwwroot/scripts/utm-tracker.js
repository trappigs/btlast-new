// UTM Parametrelerini Yakalayan ve localStorage'a Kaydeden Script
(function() {
    'use strict';

    // UTM parametrelerini yakalayıp localStorage'a kaydet
    function captureUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);

        const utmParams = {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || '',
            referrer: document.referrer || '',
            landing_page: window.location.href,
            first_visit: new Date().toISOString()
        };

        // Eğer URL'de en az bir UTM parametresi varsa veya referrer varsa kaydet
        const hasUTM = utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign ||
                       utmParams.utm_term || utmParams.utm_content;

        if (hasUTM || utmParams.referrer) {
            // Mevcut UTM bilgisini kontrol et
            const existingUTM = localStorage.getItem('bt_utm_data');

            if (!existingUTM) {
                // İlk ziyaret - kaydet
                localStorage.setItem('bt_utm_data', JSON.stringify(utmParams));
            } else {
                // Daha önce kaydedilmiş UTM varsa, sadece yeni UTM parametreleri varsa güncelle
                if (hasUTM) {
                    const existing = JSON.parse(existingUTM);
                    // İlk ziyaret tarihini koru
                    utmParams.first_visit = existing.first_visit;
                    localStorage.setItem('bt_utm_data', JSON.stringify(utmParams));
                }
            }
        } else {
            // UTM yok ama localStorage'da da yoksa, doğrudan trafik olarak kaydet
            const existingUTM = localStorage.getItem('bt_utm_data');
            if (!existingUTM) {
                const directTraffic = {
                    utm_source: 'direct',
                    utm_medium: 'none',
                    utm_campaign: '',
                    utm_term: '',
                    utm_content: '',
                    referrer: '',
                    landing_page: window.location.href,
                    first_visit: new Date().toISOString()
                };
                localStorage.setItem('bt_utm_data', JSON.stringify(directTraffic));
            }
        }
    }

    // UTM bilgisini almak için yardımcı fonksiyon
    window.getUTMData = function() {
        const utmData = localStorage.getItem('bt_utm_data');
        if (utmData) {
            return JSON.parse(utmData);
        }
        return {
            utm_source: 'direct',
            utm_medium: 'none',
            utm_campaign: '',
            utm_term: '',
            utm_content: '',
            referrer: '',
            landing_page: window.location.href,
            first_visit: new Date().toISOString()
        };
    };

    // Sayfa yüklendiğinde UTM parametrelerini yakala
    captureUTMParameters();

})();
