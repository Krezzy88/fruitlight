/* =============================================
   FRUIT LIGHT — JavaScript Interactions
   ============================================= */

(function () {
    'use strict';

    // ---- Navbar scroll behaviour ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        backToTop.classList.toggle('visible', y > 400);
        highlightNavLink();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- Hamburger menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Click outside to close menu
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNavLink() {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    // ---- Smooth back to top ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Scroll reveal ----
    const revealEls = document.querySelectorAll(
        '.step, .product-card, .af-item, .benefit-item, .gallery-item, .about-grid, .why-grid, .contact-grid, .letter-card, .section-header'
    );

    // Add reveal class dynamically
    revealEls.forEach((el, i) => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal');
            el.style.transitionDelay = (i % 5) * 0.08 + 's';
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    // ---- Lightbox gallery ----
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    let currentIdx = 0;

    function openLightbox(idx) {
        currentIdx = idx;
        const src = galleryItems[idx].dataset.src;
        const alt = galleryItems[idx].querySelector('img').alt;
        lbImg.src = src;
        lbImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function showPrev() {
        currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src = galleryItems[currentIdx].dataset.src;
            lbImg.style.opacity = '1';
        }, 200);
    }

    function showNext() {
        currentIdx = (currentIdx + 1) % galleryItems.length;
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src = galleryItems[currentIdx].dataset.src;
            lbImg.style.opacity = '1';
        }, 200);
    }

    if (lightbox) {
        lbImg.style.transition = 'opacity 0.2s';

        galleryItems.forEach((item, idx) => {
            item.addEventListener('click', () => openLightbox(idx));
        });

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', showPrev);
        lbNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    // ---- Contact form ----
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;

            // Clear previous error states
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

            // Validate required fields
            const name = form.querySelector('#name');
            const phone = form.querySelector('#phone');

            if (!name.value.trim()) {
                name.classList.add('error');
                name.focus();
                valid = false;
            }
            if (!phone.value.trim() || !/^[0-9\s\+\-]{9,15}$/.test(phone.value.trim())) {
                phone.classList.add('error');
                if (valid) phone.focus();
                valid = false;
            }

            if (!valid) return;

            // Simulate form submission (replace with actual API call)
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang gửi...';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gửi Yêu Cầu 🌿';
                formSuccess.style.display = 'block';
                setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
            }, 1200);
        });

        // Real-time clear error on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Parallax subtle effect on hero ----
    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBanner.style.transform = `scale(1.05) translateY(${y * 0.18}px)`;
            }
        }, { passive: true });
    }

    // ---- Number counter animation for hero stats ----
    function animateCounters() {
        const statNums = document.querySelectorAll('.stat-num');
        statNums.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s, transform 0.5s';
        });

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.querySelectorAll('.stat-num').forEach((el, i) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 150);
                    });
                    statsObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) statsObserver.observe(heroStats);
    }
    animateCounters();

    // Initial call
    onScroll();
})();
