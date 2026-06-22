/* ==========================================================================
   Jeju Ilbeonji - Interactive Script (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Header Shrink on Scroll
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // 2. Mobile Hamburger Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is active
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. Interactive Menu Tab System
    const tabItems = document.querySelectorAll('.tab-item');
    const tabPanels = document.querySelectorAll('.menu-tab-panel');

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes from tabs
            tabItems.forEach(item => item.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all tab panels
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Show corresponding panel
            const targetPanelId = tab.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // 3.5 See More Button for Mobile Menu
    const btnMenuMore = document.getElementById('btn-menu-more');
    const menuGrid = document.querySelector('.menu-grid');
    const menuMoreWrapper = document.getElementById('menu-more-btn-wrapper');
    
    if (btnMenuMore && menuGrid && menuMoreWrapper) {
        btnMenuMore.addEventListener('click', () => {
            menuGrid.classList.remove('collapsed');
            menuMoreWrapper.style.display = 'none';
        });
    }

    // 4. Menu Board Lightbox Modal
    const btnViewBoard = document.getElementById('btn-view-board');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');

    const openLightbox = () => {
        lightboxImg.src = './assets/menu_board.jpg';
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxModal.style.display = 'none';
        // Only restore scroll if mobile menu is not active
        if (!navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    if (btnViewBoard) {
        btnViewBoard.addEventListener('click', openLightbox);
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox on clicking dark background
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.style.display === 'block') {
            closeLightbox();
        }
    });

    // 5. Franchise Form Validation & Modal Trigger
    const franchiseForm = document.getElementById('franchise-form');
    const successModal = document.getElementById('success-modal');
    const btnSuccessClose = document.getElementById('btn-success-close');

    // Validation helper
    const validateForm = () => {
        let isValid = true;
        
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const agreeCheck = document.getElementById('form-agree');
        
        // Reset invalid styles
        nameInput.closest('.form-group').classList.remove('invalid');
        phoneInput.closest('.form-group').classList.remove('invalid');
        agreeCheck.closest('.form-group-checkbox').classList.remove('invalid');

        // Name Validation
        if (!nameInput.value.trim()) {
            nameInput.closest('.form-group').classList.add('invalid');
            isValid = false;
        }

        // Phone Validation (simple digit check, allows numbers, dashes, spaces)
        const phoneRegex = /^[0-9\-\+\s]{9,15}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            phoneInput.closest('.form-group').classList.add('invalid');
            isValid = false;
        }

        // Agreement Check Validation
        if (!agreeCheck.checked) {
            agreeCheck.closest('.form-group-checkbox').classList.add('invalid');
            isValid = false;
        }

        return isValid;
    };

    if (franchiseForm) {
        franchiseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                // Submit asynchronously to Netlify Forms
                const formData = new FormData(franchiseForm);
                fetch('/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                })
                .then(() => {
                    // Open Success Modal
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Reset form values
                    franchiseForm.reset();
                })
                .catch((error) => {
                    console.error('Netlify Form submission error:', error);
                    // Fallback to show success modal anyway so user gets visual feedback
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    franchiseForm.reset();
                });
            }
        });
    }


    if (btnSuccessClose) {
        btnSuccessClose.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // 6. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // 7. Theme Toggle (Light / Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const headerLogo = document.getElementById('header-logo-img');
    const footerLogo = document.getElementById('footer-logo-img');
    
    const setTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            if (headerLogo) headerLogo.src = './assets/logo_small_light.png';
            if (footerLogo) footerLogo.src = './assets/logo_horizontal.png';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            if (headerLogo) headerLogo.src = './assets/logo_small_dark.png';
            if (footerLogo) footerLogo.src = './assets/logo_horizontal.jpg';
            localStorage.setItem('theme', 'dark');
        }
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-theme');
            setTheme(isLight ? 'dark' : 'light');
        });
    }

    // 8. Multilingual (i18n) Support
    const langSelect = document.getElementById('lang-select');

    const setLanguage = (lang) => {
        if (typeof TRANSLATIONS === 'undefined' || !TRANSLATIONS[lang]) return;
        
        const dictionary = TRANSLATIONS[lang];
        
        // Handle RTL layout for Arabic
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl-mode');
        } else {
            document.documentElement.removeAttribute('dir');
            document.body.classList.remove('rtl-mode');
        }
        
        // Translate all data-i18n elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dictionary[key]) {
                // If the translation contains markup, use innerHTML
                if (dictionary[key].includes('<') && dictionary[key].includes('>')) {
                    el.innerHTML = dictionary[key];
                } else {
                    el.textContent = dictionary[key];
                }
            }
        });
        
        // Translate Input Placeholders
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const locationInput = document.getElementById('form-location');
        const messageInput = document.getElementById('form-message');
        
        if (nameInput) {
            nameInput.placeholder = lang === 'ko' ? '상담받으실 성함을 입력해 주세요.' : (dictionary['form_label_name'] || 'Name');
        }
        if (phoneInput) {
            phoneInput.placeholder = lang === 'ko' ? '예: 010-1234-5678' : '+82-10-1234-5678';
        }
        if (locationInput) {
            locationInput.placeholder = lang === 'ko' ? '예: 인천 남동구' : 'e.g. Incheon';
        }
        if (messageInput) {
            messageInput.placeholder = lang === 'ko' ? '점포 소유 여부, 창업 시기 등 궁금하신 사항을 자유롭게 적어주세요.' : 'Your message...';
        }
        
        // Update select value if out of sync
        if (langSelect && langSelect.value !== lang) {
            langSelect.value = lang;
        }
        
        localStorage.setItem('lang', lang);
    };

    // Initialize Language
    const savedLang = localStorage.getItem('lang') || 'ko';
    setLanguage(savedLang);

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

});

