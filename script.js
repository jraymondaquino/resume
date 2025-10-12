// script.js - Interactive Features for Black-Themed Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const animatableElements = document.querySelectorAll('.video-item, .tool-card, .gallery-item, .section');

    // 1. Hamburger Menu Toggle (Mobile)
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMenu);

        // Close menu on nav link click (mobile only)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 767) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // 2. Navbar Scroll Effects
    window.addEventListener('scroll', function() {
        // Opaque navbar on scroll
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        }

        // Active nav link highlighting
        let currentSection = '';
        animatableElements.forEach(section => {
            if (section.id && window.scrollY >= (section.offsetTop - 100)) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Gallery Lightbox Modal
    let lightboxModal = null;
    let lightboxImage = null;
    let lightboxCloseBtn = null;

    function createLightbox() {
        if (!lightboxModal) {
            lightboxModal = document.createElement('div');
            lightboxModal.className = 'lightbox';
            lightboxModal.innerHTML = `
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-img" src="" alt="Enlarged Image">
            `;
            document.body.appendChild(lightboxModal);

            lightboxCloseBtn = lightboxModal.querySelector('.lightbox-close');
            lightboxImage = lightboxModal.querySelector('.lightbox-img');

            // Event listeners for closing
            lightboxCloseBtn.addEventListener('click', closeLightbox);
            lightboxModal.addEventListener('click', function(e) {
                if (e.target === lightboxModal) {
                    closeLightbox();
                }
            });

            // ESC key to close
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }
    }

    function openLightbox(src, alt) {
        createLightbox();
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Add click events to gallery images
    galleryImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(this.src, this.alt);
        });
    });

    // 4. Scroll Animations (Fade-in)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target); // One-time animation
            }
        });
    }, observerOptions);

    // Initialize and observe elements
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });

    // Hero content initial animation (ensure it's visible)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    // 5. Performance: Debounce scroll (optional for smoother perf)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Scroll logic runs here (already handled above)
        }, 10);
    }, { passive: true });
});
