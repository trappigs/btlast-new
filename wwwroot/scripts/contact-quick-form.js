(function () {
    'use strict';

    const form = document.getElementById('quickContactForm');
    if (!form) return;

    const submitButton = form.querySelector('.btn-submit');
    const formContainer = document.getElementById('quickContactFormContainer');
    const popup = document.getElementById('quickContactPopup');

    async function handleFormSubmit(event) {
        event.preventDefault();

        // Basit validasyon
        const name = form.querySelector('[name="Name"]').value;
        const phone = form.querySelector('[name="Phone"]').value.trim();
        const kvkk = form.querySelector('[name="KvkkConsent"]').checked;
        const campaign = form.querySelector('[name="AllowCampaigns"]').checked;

        // Sadece boşluklardan oluşuyorsa geçersiz say
        if (!name || /^\s+$/.test(name)) {
            showGlobalError("Lütfen ad soyad alanını doldurun.");
            return;
        }

        submitButton.disabled = true;
        submitButton.classList.add('loading');

        const formData = new FormData(form);
        // Checkbox değerlerini açıkça ayarla (FormData checkbox değerlerini doğru şekilde işlemesi için)
        formData.set('KvkkConsent', kvkk ? 'true' : 'false');
        formData.set('AllowCampaigns', campaign ? 'true' : 'false');

        // UTM parametrelerini ekle
        if (typeof window.getUTMData === 'function') {
            const utmData = window.getUTMData();
            formData.set('UtmSource', utmData.utm_source || '');
            formData.set('UtmMedium', utmData.utm_medium || '');
            formData.set('UtmCampaign', utmData.utm_campaign || '');
            formData.set('UtmTerm', utmData.utm_term || '');
            formData.set('UtmContent', utmData.utm_content || '');
            formData.set('Referrer', utmData.referrer || '');
            formData.set('LandingPage', utmData.landing_page || '');
        }

        const actionUrl = form.getAttribute('action');
        const token = form.querySelector('input[name="__RequestVerificationToken"]').value;

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'RequestVerificationToken': token,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            handleServerResponse(data);

        } catch (error) {
            console.error('Gönderim hatası:', error);
            showGlobalError("Bir hata oluştu. Lütfen tekrar deneyiniz.");
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    function handleServerResponse(data) {
        if (data.success) {
            // --- Meta Pixel Event (Deduplication) ---
            if (data.eventId && typeof fbq === 'function') {
                fbq('track', 'Lead', {}, { eventID: data.eventId });
            }
            // ----------------------------------------

            formContainer.innerHTML = `
                <div class="success-message">
                     <div class="success-icon">✓</div>
                     <h3>Teşekkür Ederiz!</h3>
                     <p>${data.message}</p>
                </div>`;

            // 3 saniye sonra popup kapanacak
            setTimeout(() => {
                if (popup) popup.style.display = "none";
            }, 3000);

        } else {
            showGlobalError(data.error || "Form gönderilirken hata oluştu.");
        }
    }

    function showGlobalError(message) {
        let container = form.querySelector('#global-error-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-error-container';
            form.insertBefore(container, form.firstChild);
        }
        container.innerHTML = `<div class="global-error" role="alert">${message}</div>`;
    }

    form.addEventListener('submit', handleFormSubmit);
})();
