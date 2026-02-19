/* PROJECT DETAIL PAGE - MOBILE RESPONSIVE JAVASCRIPT */

// Global variables
let currentSlideIndex = 0;
let galleryMedia = [];
let isLightboxOpen = false;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeExpandables();
    initializeLightbox();
    initializeFormHandlers();
});

// ===== GALLERY INITIALIZATION ===== 
function initializeGallery() {
    // Collect all media items with their metadata
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryMedia = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img, video');
        const isVideo = item.querySelector('video') !== null;
        const src = isVideo ? 
            item.querySelector('source').getAttribute('src') : 
            img.getAttribute('src');
        
        galleryMedia.push({
            src: src,
            alt: img.getAttribute('alt') || `Gallery item ${index + 1}`,
            isVideo: isVideo,
            element: item
        });
    });

    // Set first item as active if exists
    if (galleryItems.length > 0) {
        setActiveGalleryItem(0);
    }
    
    // Initialize mobile scroll behavior
    initializeMobileScroll();
}

// ===== MOBILE SCROLL BEHAVIOR =====
function initializeMobileScroll() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    // Touch scroll optimization for mobile
    if (window.innerWidth < 768) {
        galleryGrid.style.scrollBehavior = 'smooth';
        
        // Add scroll momentum for iOS
        galleryGrid.style.webkitOverflowScrolling = 'touch';
        
        // Auto-scroll active item into view
        const activeItem = document.querySelector('.gallery-item.active');
        if (activeItem) {
            scrollToActiveItem();
        }
    }
}

// Scroll active item into view
function scrollToActiveItem() {
    const galleryGrid = document.getElementById('galleryGrid');
    const activeItem = document.querySelector('.gallery-item.active');
    
    if (galleryGrid && activeItem && window.innerWidth < 768) {
        const itemRect = activeItem.getBoundingClientRect();
        const containerRect = galleryGrid.getBoundingClientRect();
        
        if (itemRect.left < containerRect.left || itemRect.right > containerRect.right) {
            activeItem.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest', 
                inline: 'center' 
            });
        }
    }
}

// ===== MEDIA CHANGE FUNCTION =====
function changeMainMedia(src, alt, index, isVideo) {
    const mainMediaContainer = document.getElementById('mainProjectMedia');
    if (!mainMediaContainer) return;
    
    // --- DÜZELTME BAŞLANGICI ---
    // Eğer sahnede halihazırda bir video varsa, silmeden önce sustur ve durdur.
    if (mainMediaContainer.tagName === 'VIDEO') {
        mainMediaContainer.pause();       // Oynatmayı durdur
        mainMediaContainer.currentTime = 0; // Başa sar
        mainMediaContainer.src = "";      // Kaynağı boşalt (buffer'ı temizler)
        mainMediaContainer.load();        // Boş kaynağı yükle (tamamen durdurur)
    }
    // --- DÜZELTME BİTİŞİ ---

    currentSlideIndex = index;
    
    // Update main media
    if (isVideo === true || isVideo === 'true') {
        // Replace with video element
        const videoElement = document.createElement('video');
        videoElement.src = src;
        videoElement.className = 'main-project-media img-fluid rounded shadow-lg';
        videoElement.id = 'mainProjectMedia';
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.onclick = () => openLightbox(index);
        
        mainMediaContainer.parentNode.replaceChild(videoElement, mainMediaContainer);
    } else {
        // Replace with image element
        const imgElement = document.createElement('img');
        imgElement.src = src;
        imgElement.alt = alt;
        imgElement.className = 'main-project-media img-fluid rounded shadow-lg';
        imgElement.id = 'mainProjectMedia';
        imgElement.onclick = () => openLightbox(index);
        
        mainMediaContainer.parentNode.replaceChild(imgElement, mainMediaContainer);
    }
    
    // Update active gallery item
    setActiveGalleryItem(index);
    scrollToActiveItem();
}

// Set active gallery item
function setActiveGalleryItem(index) {
    // Remove active class from all items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current item
    const currentItem = document.querySelector(`.gallery-item[data-index="${index}"]`);
    if (currentItem) {
        currentItem.classList.add('active');
    }
}

// ===== LIGHTBOX FUNCTIONALITY =====
function initializeLightbox() {
    // Create lightbox HTML if it doesn't exist
    if (!document.getElementById('lightboxModal')) {
        createLightboxHTML();
    }
    
    // Add event listeners
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.querySelector('.lightbox-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Create lightbox HTML structure
function createLightboxHTML() {
    const lightboxHTML = `
        <div id="lightboxModal" class="lightbox-modal">
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                
                <div class="lightbox-container">
                    <!-- Navigation arrows -->
                    <button class="lightbox-prev" onclick="changeSlide(-1)">❮</button>
                    <button class="lightbox-next" onclick="changeSlide(1)">❯</button>
                    
                    <!-- Main media -->
                    <div class="lightbox-image-wrapper">
                        <img id="lightboxImage" src="" alt="" class="lightbox-image" style="display: none;">
                        <video id="lightboxVideo" class="lightbox-video" controls style="display: none;">
                            <source src="" type="video/mp4">
                        </video>
                    </div>
                    
                    <!-- Image counter -->
                    <div class="lightbox-counter">
                        <span id="currentSlide">1</span> / <span id="totalSlides">${galleryMedia.length}</span>
                    </div>
                    
                    <!-- Thumbnail navigation -->
                    <div class="lightbox-thumbnails-container">
                        <button class="thumbnail-nav-btn thumbnail-prev" onclick="scrollThumbnails(-1)">‹</button>
                        <div class="lightbox-thumbnails" id="lightboxThumbnails">
                            <!-- Thumbnails will be generated by JavaScript -->
                        </div>
                        <button class="thumbnail-nav-btn thumbnail-next" onclick="scrollThumbnails(1)">›</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

// Open lightbox
function openLightbox(index = 0) {
    if (galleryMedia.length === 0) return;
    
    currentSlideIndex = index;
    isLightboxOpen = true;
    
    const modal = document.getElementById('lightboxModal');
    if (!modal) {
        createLightboxHTML();
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Generate thumbnails
    generateLightboxThumbnails();
    
    // Show current slide
    showLightboxSlide(currentSlideIndex);
    
    // Update counter
    updateSlideCounter();
}

// Close lightbox
function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
    isLightboxOpen = false;
    
    // Pause any playing video
    const lightboxVideo = document.getElementById('lightboxVideo');
    if (lightboxVideo) {
        lightboxVideo.pause();
    }
}

// Generate lightbox thumbnails
function generateLightboxThumbnails() {
    const thumbnailsContainer = document.getElementById('lightboxThumbnails');
    if (!thumbnailsContainer || galleryMedia.length === 0) return;
    
    thumbnailsContainer.innerHTML = '';
    
    galleryMedia.forEach((media, index) => {
        const thumbnailElement = document.createElement(media.isVideo ? 'video' : 'img');
        thumbnailElement.className = `lightbox-thumbnail ${index === currentSlideIndex ? 'active' : ''}`;
        thumbnailElement.src = media.src;
        
        if (media.isVideo) {
            thumbnailElement.muted = true;
            thumbnailElement.playsInline = true;
        } else {
            thumbnailElement.alt = media.alt;
        }
        
        thumbnailElement.onclick = () => {
            currentSlideIndex = index;
            showLightboxSlide(index);
            updateSlideCounter();
            updateThumbnailsActive();
        };
        
        thumbnailsContainer.appendChild(thumbnailElement);
    });
}

// Show specific slide in lightbox
function showLightboxSlide(index) {
    if (!galleryMedia[index]) return;
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const media = galleryMedia[index];
    
    // Hide both elements first
    lightboxImage.style.display = 'none';
    lightboxVideo.style.display = 'none';
     // Video oynuyorsa durdur
    if (lightboxVideo) {
        lightboxVideo.pause();
    }

    // Hide both elements first
           lightboxImage.style.display = 'none';
       lightboxVideo.style.display = 'none';
    if (media.isVideo) {
        // Show video
        const videoSource = lightboxVideo.querySelector('source');
        videoSource.src = media.src;
        lightboxVideo.load();
        lightboxVideo.style.display = 'block';
        lightboxVideo.play().catch(e => console.log('Autoplay prevented:', e));
    } else {
        // Show image
        lightboxImage.src = media.src;
        lightboxImage.alt = media.alt;
        lightboxImage.style.display = 'block';
    }
    
    updateThumbnailsActive();
    scrollToActiveThumbnail();
}

// Change slide (navigation)
function changeSlide(direction) {
    if (galleryMedia.length === 0) return;
    
    currentSlideIndex += direction;
    
    // Loop around
    if (currentSlideIndex >= galleryMedia.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = galleryMedia.length - 1;
    }
    
    showLightboxSlide(currentSlideIndex);
    updateSlideCounter();
}

// Update slide counter
function updateSlideCounter() {
    const currentSlideSpan = document.getElementById('currentSlide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    
    if (currentSlideSpan && totalSlidesSpan) {
        currentSlideSpan.textContent = currentSlideIndex + 1;
        totalSlidesSpan.textContent = galleryMedia.length;
    }
}

// Update active thumbnail
function updateThumbnailsActive() {
    const thumbnails = document.querySelectorAll('.lightbox-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentSlideIndex);
    });
}

// Scroll thumbnails
function scrollThumbnails(direction) {
    const thumbnailsContainer = document.getElementById('lightboxThumbnails');
    if (!thumbnailsContainer) return;
    
    const scrollAmount = 100;
    thumbnailsContainer.scrollLeft += direction * scrollAmount;
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    if (!isLightboxOpen) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
            changeSlide(1);
            break;
    }
}



// ===== FORM HANDLERS =====
function initializeFormHandlers() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Smooth scroll for anchor links
    const callUsBtn = document.querySelector('.call-us-pulse');
    if (callUsBtn) {
        callUsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#contact-sec');
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// ===== RESPONSIVE UTILITIES =====
function handleResize() {
    // Reinitialize mobile scroll behavior
    initializeMobileScroll();
    
    // Update lightbox thumbnails if open
    if (isLightboxOpen) {
        updateSlideCounter();
    }
}



// Add resize listener
window.addEventListener('resize', handleResize);

// ===== TOUCH GESTURES FOR MOBILE =====
function initializeTouchGestures() {
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const lightboxContent = document.querySelector('.lightbox-content');
        if (lightboxContent) {
            lightboxContent.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            lightboxContent.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipeGesture();
            });
        }
        
        function handleSwipeGesture() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold && isLightboxOpen) {
                if (diff > 0) {
                    // Swipe left - next slide
                    changeSlide(1);
                } else {
                    // Swipe right - previous slide
                    changeSlide(-1);
                }
            }
        }
    }
}

// Initialize touch gestures when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTouchGestures);

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizeForMobile() {
    // Lazy load non-visible gallery items
    if ('IntersectionObserver' in window) {
        const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const media = entry.target;
                    if (media.dataset.src) {
                        media.src = media.dataset.src;
                        media.removeAttribute('data-src');
                        observer.unobserve(media);
                    }
                }
            });
        });
        
        galleryItems.forEach(item => imageObserver.observe(item));
    }
    
    // Preload main media
    const mainMedia = document.getElementById('mainProjectMedia');
    if (mainMedia && mainMedia.tagName === 'IMG') {
        const img = new Image();
        img.src = mainMedia.src;
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', optimizeForMobile);

function initializeExpandables() {
  const accordions = document.querySelectorAll('.expandable');
  if (!accordions.length) return;

  // Hepsini kapat (opsiyonel: biri hariç)
  const collapseAll = (except = null) => {
    accordions.forEach(acc => {
      if (acc === except) return;
      acc.classList.remove('is-open');
      const c = acc.querySelector('.expandable-content');
      const btn = acc.querySelector('.expandable-header');
      if (c) c.style.maxHeight = '0px';
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  accordions.forEach(acc => {
    const btn = acc.querySelector('.expandable-header');
    const content = acc.querySelector('.expandable-content');
    if (!btn || !content) return;

    // Başlangıç: kapalı
    content.style.maxHeight = '0px';
    content.style.overflow = 'hidden';

    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const isOpen = acc.classList.contains('is-open');
      // Akordeon davranışı: sadece biri açık kalsın
      collapseAll(isOpen ? null : acc);

      if (isOpen) {
        acc.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        acc.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Resize olduğunda açık olanların yüksekliğini güncelle
  window.addEventListener('resize', () => {
    document.querySelectorAll('.expandable.is-open .expandable-content')
      .forEach(c => c.style.maxHeight = c.scrollHeight + 'px');
  });
}



// DOSYANIN EN ALTINA BU YENİ FONKSİYONU EKLEYİN

function scrollToActiveThumbnail() {
    const thumbnailsContainer = document.getElementById('lightboxThumbnails');
    const activeThumbnail = thumbnailsContainer.querySelector('.lightbox-thumbnail.active');

    if (!thumbnailsContainer || !activeThumbnail) return;

    // scrollIntoView metodu, modern tarayıcılarda elementi
    // pürüzsüz bir şekilde ve ortalayarak görünür alana taşır.
    activeThumbnail.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
    });
}