// Hero Slider JavaScript
(function() {
    'use strict';

    console.log('Hero slider script loaded');

    // Configuration
    const config = {
        autoPlayDelay: 5000,
        transitionDuration: 800,
        pauseOnHover: true,
        swipeThreshold: 50,
        progressBarAnimation: true
    };

    // DOM Elements
    let slider = null;
    let slides = null;
    let currentSlide = 0;
    let totalSlides = 0;
    let isTransitioning = false;
    let autoPlayTimer = null;
    let progressTimer = null;

    // Navigation elements
    let prevBtn = null;
    let nextBtn = null;
    let paginationDots = null;
    let progressBar = null;
    let prevPreview = null;
    let nextPreview = null;
    
    // Kaydırma ve fare durumu için değişkenler
    let isScrolling = false;
    let scrollTimeout = null;

    // Touch/Swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchMoved = false; // YENİ: Dokunmatik hareket algılaması

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSlider);
    } else {
        initializeSlider();
    }

    function initializeSlider() {
        console.log('Initializing hero slider');

        // Get DOM elements
        slider = document.getElementById('heroSlider');
        if (!slider) {
            console.log('Hero slider container not found');
            return;
        }

        slides = slider.querySelectorAll('.slide');
        prevBtn = document.getElementById('prevBtn');
        nextBtn = document.getElementById('nextBtn');
        paginationDots = slider.querySelectorAll('.pagination-dot');
        progressBar = document.getElementById('progressBar');
        prevPreview = document.getElementById('prevPreview');
        nextPreview = document.getElementById('nextPreview');

        if (!slides.length) {
            console.log('No slides found');
            return;
        }

        totalSlides = slides.length;
        console.log(`Found ${totalSlides} slides`);

        // Set up slides
        setupSlides();

        // Setup navigation previews
        setupNavigationPreviews();

        // Setup event listeners
        setupEventListeners();
        
        // Scroll listener'ı ayarla
        setupScrollListener();

        // Start autoplay
        startAutoPlay();

        // Set initial progress
        resetProgress();

        console.log('Hero slider initialization complete');
    }
    
    // Sayfa kaydırma olayını dinler
    function setupScrollListener() {
        window.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150); 
        }, { passive: true });
    }

    function setupSlides() {
        console.log('Setting up slides');

        slides.forEach((slide, index) => {
            if (!slide.classList.contains('active')) {
                const bgImage = slide.getAttribute('data-bg');
                if (bgImage) {
                    slide.style.backgroundImage = `url(${bgImage})`;
                }
            }

            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
            setupSlideAnimations(slide, index);
        });
        updatePagination();
    }
    
    function setupSlideAnimations(slide, index) {
        const elements = slide.querySelectorAll('.slide-title, .badge-row, .slide-actions, .location-pin, .floating-card');

        elements.forEach((element, i) => {
            element.style.animationDelay = `${0.3 + (i * 0.3)}s`;
        });
    }

    function setupEventListeners() {
        console.log('Setting up event listeners');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Previous button clicked');
                previousSlide();
                resetAutoPlay();
                setTimeout(() => {
                    updatePreview('prev');
                    updatePreview('next');
                }, 100);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                nextSlide();
                resetAutoPlay();
                setTimeout(() => {
                    updatePreview('prev');
                    updatePreview('next');
                }, 100);
            });
        }

        paginationDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log(`Pagination dot ${index} clicked`);
                goToSlide(index);
                resetAutoPlay();
            });
        });

        document.addEventListener('keydown', handleKeyboard);
        slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        slider.addEventListener('touchmove', handleTouchMove, { passive: false }); // passive: false yapıyoruz
        slider.addEventListener('touchend', handleTouchEnd);
        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mousemove', handleMouseMove);
        slider.addEventListener('mouseup', handleMouseUp);
        slider.addEventListener('mouseleave', handleMouseUp);

        if (config.pauseOnHover) {
            slider.addEventListener('mouseenter', () => {
                if (!isScrolling) {
                    pauseAutoPlay();
                }
            });
            slider.addEventListener('mouseleave', resumeAutoPlay);
        }

        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function nextSlide() {
        if (isTransitioning) return;
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex, true); // YENİ: shouldResetAnimations parametresi
    }

    function previousSlide() {
        if (isTransitioning) return;
        const prevIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        goToSlide(prevIndex, true); // YENİ: shouldResetAnimations parametresi
    }

    // YENİ: shouldResetAnimations parametresi eklendi
    function goToSlide(index, shouldResetAnimations = false) {
        if (isTransitioning || index === currentSlide || index < 0 || index >= totalSlides) {
            return;
        }

        console.log(`Going to slide ${index}`);
        isTransitioning = true;
        const previousSlide = currentSlide;
        currentSlide = index;
        slides[previousSlide].classList.remove('active');

        setTimeout(() => {
            slides[currentSlide].classList.add('active');
            
            // Sadece gerçek slide değişikliğinde animasyonları resetle
            if (shouldResetAnimations) {
                resetSlideAnimations(slides[currentSlide]);
            }
            
            setTimeout(() => {
                isTransitioning = false;
            }, config.transitionDuration);
        }, 50);

        updatePagination();
        resetProgress();
    }

    function setupNavigationPreviews() {
        console.log('Setting up navigation previews');
        if (!prevPreview || !nextPreview) return;
        if (prevBtn) prevBtn.addEventListener('mouseenter', () => updatePreview('prev'));
        if (nextBtn) nextBtn.addEventListener('mouseenter', () => updatePreview('next'));
    }

    function updatePreview(direction) {
        const previewElement = direction === 'prev' ? prevPreview : nextPreview;
        const targetSlideIndex = direction === 'prev' ?
            (currentSlide === 0 ? totalSlides - 1 : currentSlide - 1) :
            (currentSlide + 1) % totalSlides;
        const targetSlide = slides[targetSlideIndex];
        if (!targetSlide || !previewElement) return;

        const bgImage = targetSlide.getAttribute('data-bg');
        const title = targetSlide.getAttribute('data-title');
        const subtitle = targetSlide.getAttribute('data-subtitle');

        const previewImage = previewElement.querySelector('.preview-image');
        if (previewImage && bgImage) {
            previewImage.style.backgroundImage = `url(${bgImage})`;
        }

        const previewTitle = previewElement.querySelector('.preview-title');
        if (previewTitle) {
            previewTitle.textContent = title || `Slide ${targetSlideIndex + 1}`;
        }

        const previewSubtitle = previewElement.querySelector('.preview-subtitle');
        if (previewSubtitle) {
            previewSubtitle.textContent = subtitle || 'Nova Arsa Projesi';
        }
    }

    function resetSlideAnimations(slide) {
        const animatedElements = slide.querySelectorAll('.slide-title, .badge-row, .slide-actions, .location-pin, .floating-card, .badge');

        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
    }

    function updatePagination() {
        paginationDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function startAutoPlay() {
        if (totalSlides <= 1 || autoPlayTimer) return;
        console.log('Starting autoplay');
        autoPlayTimer = setInterval(() => {
            if (!isTransitioning && !document.hidden) {
                nextSlide();
            }
        }, config.autoPlayDelay);

        if (config.progressBarAnimation) {
            startProgress();
        }
    }
    
    function pauseAutoPlay() {
        console.log('Pausing autoplay');
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        pauseProgress();
    }

    function resumeAutoPlay() {
        console.log('Resuming autoplay');
        if (!autoPlayTimer && totalSlides > 1) {
            startAutoPlay();
        }
    }

    function resetAutoPlay() {
        pauseAutoPlay();
        if (totalSlides > 1) {
            setTimeout(startAutoPlay, 100);
        }
    }

    function startProgress() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.transition = `width ${config.autoPlayDelay}ms linear`;
            progressBar.style.width = '100%';
        }, 50);
    }

    function pauseProgress() {
        if (!progressBar) return;
        const currentWidth = progressBar.offsetWidth;
        const containerWidth = progressBar.parentElement.offsetWidth;
        const currentPercentage = (currentWidth / containerWidth) * 100;
        progressBar.style.transition = 'none';
        progressBar.style.width = `${currentPercentage}%`;
    }

    function resetProgress() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        if (config.progressBarAnimation && totalSlides > 1 && autoPlayTimer) {
            setTimeout(startProgress, 100);
        }
    }

    // YENİ: Geliştirilmiş touch event handling
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false; // YENİ: Hareket bayrağını resetle
        pauseAutoPlay();
    }

    function handleTouchMove(e) {
        if (!touchStartX || !touchStartY) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);
        
        // YENİ: Yatay kaydırma algılandıysa dikey kaydırmayı engelle
        if (deltaX > deltaY && deltaX > 10) {
            touchMoved = true;
            e.preventDefault(); // Dikey scroll'u engelle
        }
    }

    function handleTouchEnd(e) {
        if (!touchStartX || !touchEndX) {
            resumeAutoPlay();
            return;
        }

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        let slideChanged = false;

        // YENİ: Sadece yeterli yatay hareket varsa ve dikey hareket çok fazla değilse slide değiştir
        if (absDeltaX > config.swipeThreshold && absDeltaX > absDeltaY) {
            if (deltaX > 0) {
                previousSlide();
            } else {
                nextSlide();
            }
            slideChanged = true;
        }

        // Değişkenleri resetle
        touchStartX = touchEndX = touchStartY = touchEndY = 0;
        touchMoved = false;

        if (slideChanged) {
            resetAutoPlay();
        } else {
            resumeAutoPlay();
        }
    }

    let mouseStartX = 0;
    let mouseEndX = 0;
    let isMouseDown = false;

    function handleMouseDown(e) {
        mouseStartX = e.clientX;
        isMouseDown = true;
        slider.style.cursor = 'grabbing';
        pauseAutoPlay();
    }

    function handleMouseMove(e) {
        // Empty
    }

    function handleMouseUp(e) {
        if (!isMouseDown) return;
        isMouseDown = false;
        slider.style.cursor = '';
        mouseEndX = e.clientX;
        const deltaX = mouseEndX - mouseStartX;
        let swiped = false;

        if (Math.abs(deltaX) > config.swipeThreshold) {
            if (deltaX > 0) {
                previousSlide();
            } else {
                nextSlide();
            }
            swiped = true;
        }

        if (swiped) {
            resetAutoPlay();
        } else {
            resumeAutoPlay();
        }
        mouseStartX = mouseEndX = 0;
    }

    function handleKeyboard(e) {
        let userInteracted = false;
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                userInteracted = true;
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                userInteracted = true;
                break;
            case 'Escape':
                pauseAutoPlay();
                break;
        }
        if (userInteracted) {
            resetAutoPlay();
        }
    }

    function handleResize() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            console.log('Window resized, updating slider');
            // YENİ: Resize'da animasyon resetlemeyi kaldırdık
            // resetSlideAnimations(slides[currentSlide]);
        }, 250);
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            pauseAutoPlay();
        } else {
            resumeAutoPlay();
        }
    }

    console.log('Hero slider script fully loaded and ready');

})();