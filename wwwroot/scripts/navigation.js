
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // ELEMENT SELECTIONS
    // ========================================
    const navbar = document.querySelector('.modern-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.nav-menu'); // '.mobile-menu' yerine '.nav-menu' kullanıldı.
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    
    // Side Panel Elements
    const sidePanelToggle = document.querySelector('.side-panel-toggle');
    const sidePanelContainer = document.querySelector('.side-panel-container');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
    const sidePanelClose = document.querySelector('.side-panel-close');
    
    // Mobil menüdeki dropdown linkleri
    const mobileSubmenuButtons = document.querySelectorAll('.nav-item.has-dropdown');
    
    
// MOBILE MENU FUNCTIONS (YENİ VE GÜNCELLENMİŞ)
// ========================================
function openMobileMenu() {
    // Navigasyon yüksekliğini HER AÇILIŞTA yeniden hesapla.
    // Bu, resimlerin yüklenmesinden kaynaklanan zamanlama hatalarını önler.
    const navHeight = navbar.offsetHeight; 
    
    // Menünün pozisyonunu ve yüksekliğini dinamik olarak ayarla
    mobileMenu.style.top = `${navHeight}px`; 
    mobileMenu.style.height = `calc(100vh - ${navHeight}px)`;

    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    mobileMenuBtn.classList.add('open');
    body.style.overflow = 'hidden'; 
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    mobileMenuBtn.classList.remove('open');
    body.style.overflow = 'auto'; 

    // Mobil menü kapanırken tüm alt menüleri de kapat
    document.querySelectorAll('.dropdown-menu.mobile-active').forEach(submenu => {
        submenu.classList.remove('mobile-active');
        // Parent linkin active class'ını da temizle
        const parentLink = submenu.closest('.nav-item-wrapper').querySelector('.nav-item.has-dropdown');
        if (parentLink) {
            parentLink.classList.remove('active');
        }
    });

    // Zıplama sorununu önlemek için stil temizliğini animasyon bittikten sonra yap
    // CSS'deki transition süresi 0.4s olduğu için 400ms bekliyoruz.
    setTimeout(() => {
        // İhtiyaç kalmadığı için bu satırları tamamen kaldırmak daha güvenli olabilir
        // çünkü openMobileMenu artık her seferinde doğru değeri hesaplıyor.
        // Ama temizlik için kalabilirler.
        if (!mobileMenu.classList.contains('active')) {
             mobileMenu.style.top = '';
             mobileMenu.style.height = '';
        }
    }, 400); 
}
    
    // Mobile Menu Event Listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Mobil menüdeki X butonu için (HTML'de varsa)
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // ========================================
    // MOBILE SUBMENU HANDLING
    // ========================================
    // ========================================
// MOBILE SUBMENU HANDLING (YENİ VE SAĞLAMLAŞTIRILMIŞ)
// ========================================
// ========================================
// MOBILE SUBMENU HANDLING (NİHAİ VERSİYON)
// ========================================
mobileSubmenuButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        if (window.innerWidth > 768) {
            return;
        }

        event.preventDefault();

        const parentWrapper = this.closest('.nav-item-wrapper');
        const currentSubmenu = parentWrapper.querySelector('.dropdown-menu');
        const isAlreadyActive = currentSubmenu.classList.contains('mobile-active');

        document.querySelectorAll('.dropdown-menu.mobile-active').forEach(openSubmenu => {
            openSubmenu.classList.remove('mobile-active');
        });
        document.querySelectorAll('.nav-item.has-dropdown.active').forEach(activeLink => {
            activeLink.classList.remove('active');
        });

        if (!isAlreadyActive) {
            // =========================================================================
            // SİHİRLİ SATIR BURADA
            // =========================================================================
            // BROWSER REFLOW HİLESİ: Bu satır, class'ı ekleyip animasyonu başlatmadan hemen önce
            // tarayıcıyı düzeni yeniden hesaplamaya zorlar. Bu, render hatalarını önler.
            void currentSubmenu.offsetHeight; 
            // =========================================================================
            
            currentSubmenu.classList.add('mobile-active');
            this.classList.add('active');
        }
    });
});

    // ========================================
    // SIDE PANEL FUNCTIONS
    // ========================================
    function openSidePanel() {
        sidePanelContainer.classList.add('active');
        sidePanelOverlay.classList.add('active');
        body.classList.add('no-scroll');
    }
    
    function closeSidePanel() {
        sidePanelContainer.classList.remove('active');
        sidePanelOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }
    
    // Side Panel Event Listeners
    if (sidePanelToggle) {
        sidePanelToggle.addEventListener('click', openSidePanel);
    }
    
    if (sidePanelOverlay) {
        sidePanelOverlay.addEventListener('click', closeSidePanel);
    }
    
    if (sidePanelClose) {
        sidePanelClose.addEventListener('click', closeSidePanel);
    }
    
    // ========================================
    // SCROLL BEHAVIOR
    // ========================================
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (window.innerWidth > 768) { // Oval menü scroll davranışını sadece masaüstünde uygula
             if (currentScrollTop > lastScrollTop && currentScrollTop > navbar.offsetHeight) {
                navbar.classList.add('nav-hidden');
             } else {
                navbar.classList.remove('nav-hidden');
             }
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, false);


    // DESKTOP DROPDOWN HANDLING (HOVER)
    // ========================================
    const dropdownWrappers = document.querySelectorAll('.nav-item-wrapper');

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    if (!isTouchDevice()) {
        dropdownWrappers.forEach(wrapper => {
            let timeoutId;
            const dropdown = wrapper.querySelector('.dropdown-menu');

            wrapper.addEventListener('mouseenter', function() {
                // SADECE 768px'DEN BÜYÜK EKRANLARDA ÇALIŞMASINI SAĞLA
                if (window.innerWidth > 768 && dropdown) {
                    clearTimeout(timeoutId);
                    dropdown.style.display = 'block';
                    setTimeout(() => {
                        dropdown.style.opacity = '1';
                        dropdown.style.visibility = 'visible';
                        dropdown.style.transform = 'translateX(-50%) translateY(0)';
                    }, 10);
                }
            });

            wrapper.addEventListener('mouseleave', function() {
                // SADECE 768px'DEN BÜYÜK EKRANLARDA ÇALIŞMASINI SAĞLA
                if (window.innerWidth > 768 && dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateX(-50%) translateY(-10px)';
                    timeoutId = setTimeout(() => {
                        dropdown.style.display = 'none';
                    }, 300);
                }
            });
        });
    }

    // ========================================
    // KEYBOARD NAVIGATION & RESIZE
    // ========================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileMenu.classList.contains('active')) closeMobileMenu();
            if (sidePanelContainer.classList.contains('active')) closeSidePanel();
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

});