// project-cards.js - Ana projeler için (değişiklik yok)
// Mevcut kodlar aynen kalır

// projectDetail.js - Proje detay sayfası için güncelleme
document.addEventListener('DOMContentLoaded', function() {
    // Ana projeler bölümü için seçiciler (ProjectCards.cshtml)
    const mainProjectCards = document.querySelectorAll('.projects-section .project-card');
    
    // İlgili projeler bölümü için seçiciler (projectDetailPage.cshtml)
    const relatedProjectCards = document.querySelectorAll('.related-projects-section .project-card');
    
    // Ana proje kartları için olay dinleyicileri
    mainProjectCards.forEach(card => {
        // Ana proje kartları için mevcut fonksiyonlar
        initializeMainProjectCard(card);
    });
    
    // İlgili proje kartları için olay dinleyicileri
    relatedProjectCards.forEach(card => {
        // İlgili proje kartları için özel fonksiyonlar
        initializeRelatedProjectCard(card);
    });
});

function initializeMainProjectCard(card) {
    // Ana proje kartları için mevcut fonksiyonlar
    const callButton = card.querySelector('.call-me-detail');
    if (callButton) {
        callButton.addEventListener('click', handleCallButtonClick);
    }
}

function initializeRelatedProjectCard(card) {
    // İlgili proje kartları için özel fonksiyonlar
    const callButton = card.querySelector('.call-me-detail');
    if (callButton) {
        callButton.addEventListener('click', handleCallButtonClick);
    }
    
    // Hover efektleri için ek JavaScript (isteğe bağlı)
    card.addEventListener('mouseenter', function() {
        // Hover animasyonları
    });
}

function handleCallButtonClick(e) {
    e.preventDefault();
    // Form açma fonksiyonu
    console.log('Call button clicked');
}

// Expandable sections için mevcut kod (değişiklik yok)
document.addEventListener('DOMContentLoaded', function() {
    const expandableHeaders = document.querySelectorAll('.expandable-header');
    
    expandableHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Tüm diğer itemleri kapat
            expandableHeaders.forEach(function(otherHeader) {
                otherHeader.parentElement.classList.remove('active');
            });
            
            // Bu item'i toggle et
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
