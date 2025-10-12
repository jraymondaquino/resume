// script.js - Vanilla JavaScript for Portfolio Website Interactions
// Handles: Mobile navbar toggle, smooth scrolling, scroll reveal animations,
// hero particle background (subtle), image gallery lightbox modal.
// No frameworks; uses modern APIs like IntersectionObserver for performance.
// Well-commented for easy editing/customization.

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navbar Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Optional: Animate hamburger bars to X
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scrolling for Nav Links (Enhances CSS scroll-behavior)
    // Already handled by CSS, but JS ensures compatibility and adds offset for fixed navbar
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Animations using IntersectionObserver
    // Observes sections and adds 'visible' class when they enter viewport
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px 0px -50px 0px' // Offset to start animation earlier
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Hero Particle Background (Subtle Animation)
    // Creates simple floating particles in the hero section for a modern, dynamic feel
    // Editable: Adjust particle count, speed, size in variables below
    function initHeroParticles() {
        const hero = document.querySelector('.hero');
        const heroBg = document.querySelector('.hero-bg');
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none'; // Allow clicks through
        canvas.style.zIndex = '-1';
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50; // Number of particles (keep low for performance)
        const maxSpeed = 0.5; // Slow for subtlety

        // Set canvas size
        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1; // 1-4px
                this.speedX = (Math.random() - 0.5) * maxSpeed;
                this.speedY = (Math.random() - 0.5) * maxSpeed;
                this.color = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2})`; // Indigo with opacity
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges for continuous movement
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
    initHeroParticles(); // Start particles only in hero

    // Image Gallery Lightbox Modal
    // Simple modal for viewing full-size images on click
    // Editable: Add data attributes to images if needed for custom captions
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let modal, modalImg, closeBtn;

    function createModal() {
        // Create modal elements
        modal = document.createElement('div');
        modal.className = 'lightbox-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;

        modalImg = document.createElement('img');
        modalImg.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
        `;

        closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: -15px;
            right: -15px;
            color: white;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeBtn.addEventListener('click', closeModal);

        modalContent.appendChild(modalImg);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close on outside click or ESC key
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal(imgSrc, caption = '') {
        if (!modal) createModal();
        modal.style.display = 'flex';
        modalImg.src = imgSrc;
        // Optional: Add caption if data-caption attribute is used
        // modalImg.alt = caption;
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Add click listeners to gallery images
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src, this.alt);
        });
    });

    // Optional: Preload modal styles if needed, but inline for simplicity

    // Additional: Navbar background opacity on scroll (enhance visibility)
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });

    // Performance: Pause particles on scroll or when out of view (optional optimization)
    // Can be added if needed for better perf on low-end devices

});

// Tools Section Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    const toolItems = document.querySelectorAll('#tools-section .tool-item');
    let lightbox = null; // Will be created dynamically

    // Tool data: Name and description for each (index matches HTML order; customize as needed)
    const toolData = [
        { name: 'Notion', description: 'All-in-one workspace for notes, tasks, and databases.' },
        { name: 'ChatGPT', description: 'AI-powered conversational assistant for content and ideas.' },
        { name: 'Google Drive', description: 'Cloud storage and file sharing service.' },
        { name: 'Gmail', description: 'Secure email platform with integrated productivity tools.' },
        { name: 'Google Docs', description: 'Collaborative word processing application.' },
        { name: 'Google Sheets', description: 'Online spreadsheet tool for data analysis.' },
        { name: 'Adobe Illustrator', description: 'Vector graphics editor for illustrations and logos.' },
        { name: 'Adobe Photoshop', description: 'Raster graphics editor for photo manipulation.' },
        { name: 'n8n', description: 'Open-source workflow automation tool for integrations.' }
    ];

    // Function to create lightbox if it doesn't exist
    function createLightbox() {
        if (lightbox) return; // Already created

        lightbox = document.createElement('div');
        lightbox.id = 'tools-lightbox';
        lightbox.className = 'lightbox-modal';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <div class="lightbox-tool-info">
                    <img src="" alt="" class="lightbox-icon">
                    <h3 class="tool-name"></h3>
                    <p class="tool-description"></p>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Close event listeners
        const closeBtn = lightbox.querySelector('.close-lightbox');
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === closeBtn) {
                closeLightbox();
            }
        });

        // Escape key close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });
    }

    function openLightbox(index) {
        if (!lightbox) createLightbox();
        
        const tool = toolData[index];
        const img = toolItems[index].querySelector('.tool-icon');
        
        lightbox.querySelector('.lightbox-icon').src = img.src;
        lightbox.querySelector('.lightbox-icon').alt = img.alt;
        lightbox.querySelector('.tool-name').textContent = tool.name;
        lightbox.querySelector('.tool-description').textContent = tool.description;
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Add click listeners to each tool item
    toolItems.forEach((item, index) => {
        const overlay = item.querySelector('.tool-overlay');
        const icon = item.querySelector('.tool-icon');
        
        // Make overlay clickable for lightbox
        if (overlay) {
            overlay.style.cursor = 'pointer';
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(index);
            });
        }
        
        // Also allow clicking the icon itself
        if (icon) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(index);
            });
        }
    });
});
