// Nova Arsa Navigation JavaScript
(function() {
    'use strict';

    console.log('Nova navigation script loaded');

    // DOM Elements
    let navbar = null;
    let mobileMenuBtn = null;
    let mobileMenu = null;
    let mobileMenuOverlay = null;
    let mobileDropdowns = null;
    let megaMenu = null;
    let dropdownMenus = null;

    // Navigation state
    let lastScrollTop = 0;
    let isMenuOpen = false;
    let scrollThreshold = 10;
    let navHeight = 0;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    } else {
        initializeNavigation();
    }

    function initializeNavigation() {
        console.log('Initializing Nova navigation');

        // Get DOM elements
        navbar = document.querySelector('.nova-nav');
        mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        mobileMenu = document.querySelector('.mobile-menu');
        mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        megaMenu = document.querySelector('.mega-menu');
        dropdownMenus = document.querySelectorAll('.dropdown-menu');

        if (!navbar) {
            console.log('Navigation not found');
            return;
        }

        navHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navHeight + 'px';

        // Setup event listeners
        setupEventListeners();
        setupScrollBehavior();
        setupMobileMenu();
        setupDropdowns();
        setupMegaMenu();

        console.log('Nova navigation initialization complete');
    }

    function setupEventListeners() {
        console.log('Setting up navigation event listeners');

        // Mobile menu button
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Mobile menu overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        // Mobile dropdowns
        mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => toggleMobileDropdown(dropdown));
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', handleResize);

        // Language switcher
        setupLanguageSwitcher();

        // Project buttons
        setupProjectButtons();
    }

    function setupScrollBehavior() {
        console.log('Setting up scroll behavior');

        function handleScroll() {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Don't hide nav if mobile menu is open
            if (isMenuOpen) {
                return;
            }

            // Add scrolled class for backdrop blur
            if (currentScrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Show/hide navigation based on scroll direction
            if (currentScrollTop <= navHeight) {
                navbar.classList.remove('nav-hidden');
                navbar.classList.add('nav-visible');
            } else if (Math.abs(lastScrollTop - currentScrollTop) > scrollThreshold) {
                if (currentScrollTop > lastScrollTop) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('nav-hidden');
                    navbar.classList.remove('nav-visible');
                } else {
                    // Scrolling up - show navbar
                    navbar.classList.remove('nav-hidden');
                    navbar.classList.add('nav-visible');
                }
            }

            lastScrollTop = currentScrollTop;
        }

        // Throttle scroll events for performance
        let scrollTimer = null;
        function throttledScroll() {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(handleScroll, 10);
        }

        window.addEventListener('scroll', throttledScroll, { passive: true });
    }

    function setupMobileMenu() {
        console.log('Setting up mobile menu');

        // Close menu when clicking on nav items
        const mobileNavItems = mobileMenu?.querySelectorAll('.mobile-nav-item:not(.sub)');
        mobileNavItems?.forEach(item => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('disabled')) {
                    closeMobileMenu();
                }
            });
        });
    }

    function toggleMobileMenu() {
        console.log('Toggling mobile menu');
        
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        console.log('Opening mobile menu');
        
        isMenuOpen = true;
        mobileMenu?.classList.add('active');
        mobileMenuOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate hamburger
        animateHamburger(true);
    }

    function closeMobileMenu() {
        console.log('Closing mobile menu');
        
        isMenuOpen = false;
        mobileMenu?.classList.remove('active');
        mobileMenuOverlay?.classList.remove('active');
        document.body.style.overflow = '';

        // Close all mobile dropdowns
        mobileDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });

        // Animate hamburger back
        animateHamburger(false);
    }

    function animateHamburger(isOpen) {
        const spans = mobileMenuBtn?.querySelectorAll('span');
        if (!spans) return;

        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    function toggleMobileDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        mobileDropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                otherDropdown.classList.remove('active');
            }
        });

        // Toggle current dropdown
        if (isActive) {
            dropdown.classList.remove('active');
        } else {
            dropdown.classList.add('active');
        }

        console.log(`Mobile dropdown ${isActive ? 'closed' : 'opened'}`);
    }

    function setupDropdowns() {
        console.log('Setting up dropdown menus');

        const navDropdowns = document.querySelectorAll('.nav-dropdown:not(.mega-menu-container)');
        
        navDropdowns.forEach(dropdown => {
            let hoverTimer = null;

            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);
                dropdown.classList.add('active');
            });

            dropdown.addEventListener('mouseleave', () => {
                hoverTimer = setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 150);
            });
        });
    }

    function setupMegaMenu() {
        console.log('Setting up mega menu');

        const megaMenuContainer = document.querySelector('.mega-menu-container');
        if (!megaMenuContainer) return;

        let megaHoverTimer = null;

        megaMenuContainer.addEventListener('mouseenter', () => {
            clearTimeout(megaHoverTimer);
            megaMenuContainer.classList.add('active');
            
            // Add overlay to body
            document.body.classList.add('mega-menu-open');
        });

        megaMenuContainer.addEventListener('mouseleave', () => {
            megaHoverTimer = setTimeout(() => {
                megaMenuContainer.classList.remove('active');
                document.body.classList.remove('mega-menu-open');
            }, 200);
        });
    }

    function setupLanguageSwitcher() {
        console.log('Setting up language switcher');

        const langItems = document.querySelectorAll('.lang-item, .mobile-lang-item');
        
        langItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = item.textContent.trim();
                switchLanguage(lang);
            });
        });
    }

    function switchLanguage(lang) {
        console.log(`Switching language to: ${lang}`);
        
        // Remove active class from all language items
        document.querySelectorAll('.lang-item, .mobile-lang-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to selected language
        document.querySelectorAll('.lang-item, .mobile-lang-item').forEach(item => {
            if (item.textContent.trim() === lang) {
                item.classList.add('active');
            }
        });

        // Here you would typically redirect to the language version
        // window.location.href = `${window.location.pathname}?lang=${lang.toLowerCase()}`;
        
        showNotification(`Dil ${lang} olarak değiştirildi`, 'success');
    }

    function setupProjectButtons() {
        console.log('Setting up project buttons');

        const projectBtns = document.querySelectorAll('.project-btn:not(.yakinda-btn)');
        
        projectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('loading')) {
                    e.preventDefault();
                    return;
                }

                // Add loading state
                btn.classList.add('loading');
                const originalText = btn.textContent;
                
                setTimeout(() => {
                    btn.classList.remove('loading');
                    btn.textContent = originalText;
                }, 1500);

                console.log(`Project button clicked: ${btn.textContent}`);
            });
        });

        // Special button handler
        const specialBtn = document.querySelector('.special-btn');
        if (specialBtn) {
            specialBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openPreApplicationForm();
            });
        }
    }

    function handleResize() {
        navHeight = navbar.offsetHeight;
        document.body.style.paddingTop = navHeight + 'px';

        // Close mobile menu on desktop
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `nova-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#045129' : '#067d3c'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Global function for pre-application form
    window.openPreApplicationForm = function() {
        console.log('Opening pre-application form');
        showNotification('Ön başvuru formu açılıyor...', 'info');
        
        // Here you would open a modal or redirect to form
        // For demo purposes, just show notification
        setTimeout(() => {
            showNotification('Form hazırlanıyor...', 'success');
        }, 1000);
    };

    // Public API
    window.NovaNavigation = {
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu,
        switchLanguage: switchLanguage,
        isMenuOpen: () => isMenuOpen
    };

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .nova-notification .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .nova-notification .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        .mega-menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    console.log('Nova navigation script fully loaded and ready');

})();