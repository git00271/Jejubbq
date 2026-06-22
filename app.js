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
                // Open Success Modal
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset form values
                franchiseForm.reset();
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

});
