document.addEventListener('DOMContentLoaded', function() {
    // Selectors for contact buttons
    const whatsappBtns = document.querySelectorAll('.fixed-whatsapp-btn, .whatsapp, [href*="wa.me"], [href*="whatsapp.com"]');
    const phoneBtns = document.querySelectorAll('.fixed-phone-btn, .call-me-detail, [href^="tel:"]');

    function trackContactEvent(type) {
        if (typeof fbq === 'function') {
            fbq('track', 'Contact', {
                contact_method: type
            });
            console.log('Meta Pixel Contact event sent: ' + type);
        }
    }

    // Attach listeners to WhatsApp buttons
    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            trackContactEvent('whatsapp');
        });
    });

    // Attach listeners to Phone buttons
    phoneBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            trackContactEvent('phone');
        });
    });
});
