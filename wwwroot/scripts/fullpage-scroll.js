// Full Page Scroll JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Ana sayfa bölümlerini seç
    const sections = document.querySelectorAll('.scroll-section');
    let currentSectionIndex = 0;
    let isScrolling = false;
    const scrollDelay = 1000; // 1 saniye bekleme süresi

    // Her bölüme index ekle
    sections.forEach((section, index) => {
        section.setAttribute('data-index', index);
    });

    // Scroll event listener
    function handleScroll(event) {
        if (isScrolling) return;

        const deltaY = event.deltaY;
        
        if (deltaY > 0) {
            // Aşağı scroll
            scrollToSection(currentSectionIndex + 1);
        } else {
            // Yukarı scroll
            scrollToSection(currentSectionIndex - 1);
        }
    }

    // Belirli bölüme git
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length || isScrolling) return;

        isScrolling = true;
        currentSectionIndex = index;

        const targetSection = sections[index];
        
        // Smooth scroll
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Navigation dots güncelle (varsa)
        updateNavDots();

        // Scroll kilidi kaldır
        setTimeout(() => {
            isScrolling = false;
        }, scrollDelay);
    }

    // Navigation dots oluştur
    function createNavDots() {
        const navContainer = document.createElement('div');
        navContainer.className = 'scroll-nav';
        navContainer.innerHTML = `
            <div class="nav-dots">
                ${sections.map((_, index) => 
                    `<button class="nav-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
                ).join('')}
            </div>
        `;
        document.body.appendChild(navContainer);

        // Dot click events
        const dots = navContainer.querySelectorAll('.nav-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                scrollToSection(index);
            });
        });
    }

    // Navigation dots güncelle
    function updateNavDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSectionIndex);
        });
    }

    // Keyboard navigation
    function handleKeydown(event) {
        if (isScrolling) return;

        switch(event.key) {
            case 'ArrowDown':
            case 'PageDown':
                event.preventDefault();
                scrollToSection(currentSectionIndex + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                event.preventDefault();
                scrollToSection(currentSectionIndex - 1);
                break;
            case 'Home':
                event.preventDefault();
                scrollToSection(0);
                break;
            case 'End':
                event.preventDefault();
                scrollToSection(sections.length - 1);
                break;
        }
    }

    // Touch support (mobile)
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchEnd(event) {
        touchEndY = event.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            if (deltaY > 0) {
                // Swipe up (scroll down)
                scrollToSection(currentSectionIndex + 1);
            } else {
                // Swipe down (scroll up)
                scrollToSection(currentSectionIndex - 1);
            }
        }
    }

    // Event listeners
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Initialize
    createNavDots();

    // URL hash support
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetIndex = parseInt(hash) || 0;
            if (targetIndex >= 0 && targetIndex < sections.length) {
                scrollToSection(targetIndex);
            }
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    // Resize handler
    window.addEventListener('resize', () => {
        // Reset scroll position on resize
        setTimeout(() => {
            scrollToSection(currentSectionIndex);
        }, 100);
    });

    // Intersection Observer for better section detection
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isScrolling) {
                const index = parseInt(entry.target.dataset.index);
                if (index !== currentSectionIndex) {
                    currentSectionIndex = index;
                    updateNavDots();
                    // Update URL hash
                    history.replaceState(null, null, `#${index}`);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});