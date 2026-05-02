/**
 * Webappzo — Premium Anime.js Animations
 * Works alongside AOS — only enhances elements WITHOUT data-aos attributes.
 */

(function () {
    'use strict';

    // Run after page fully loads (after AOS and preloader)
    window.addEventListener('load', function () {
        setTimeout(function() {
            initAnimeAnimations();
            initHeroVisual();
        }, 800);
    });

    function initHeroVisual() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let points = [];
        const numPoints = 40;
        const maxDist = 150;

        function resize() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 51, 51, ${1 - dist / maxDist})`;
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw points
            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ff3333';
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            requestAnimationFrame(draw);
        }
        draw();

        // Pulsing effect using Anime.js for the points indirectly
        anime({
            targets: points,
            radius: [
                { value: (p) => p.radius * 1.5, duration: 1000, easing: 'easeInOutQuad' },
                { value: (p) => p.radius, duration: 1000, easing: 'easeInOutQuad' }
            ],
            loop: true,
            delay: anime.stagger(100)
        });
    }

    function initAnimeAnimations() {
        if (typeof anime === 'undefined') return;

        // ── 1. Magnetic effect on ALL CTA buttons ──────────────────
        document.querySelectorAll('.btn-primary, .btn-cta-pulse, .back-btn').forEach(function (btn) {
            // Skip nav buttons (too small)
            if (btn.closest('nav') || btn.closest('.nav-links')) return;

            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                anime.remove(btn);
                anime({
                    targets: btn,
                    translateX: x * 0.2,
                    translateY: y * 0.2,
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            });

            btn.addEventListener('mouseleave', function () {
                anime.remove(btn);
                anime({
                    targets: btn,
                    translateX: 0,
                    translateY: 0,
                    duration: 700,
                    easing: 'easeOutElastic(1, .5)'
                });
            });
        });

        // ── 2. Stat number count-up ────────────────────────────────
        var statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length) {
            var statObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        if (el.dataset.animated) return;
                        el.dataset.animated = '1';

                        var raw = el.textContent.trim();
                        var num = parseInt(raw);
                        var suffix = raw.replace(/[\d]/g, '');

                        if (!isNaN(num) && num > 0) {
                            var obj = { val: 0 };
                            anime({
                                targets: obj,
                                val: num,
                                round: 1,
                                duration: 2000,
                                easing: 'easeOutExpo',
                                update: function () {
                                    el.textContent = obj.val + suffix;
                                }
                            });
                        }
                        statObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            statNumbers.forEach(function (s) { statObserver.observe(s); });
        }

        // ── 3. Glass card hover enhancement (scale + glow) ────────
        document.querySelectorAll('.glass, .feature-item, .benefit-card, .faq-item, .step-card').forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                anime.remove(card);
                anime({
                    targets: card,
                    scale: 1.03,
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            });
            card.addEventListener('mouseleave', function () {
                anime.remove(card);
                anime({
                    targets: card,
                    scale: 1,
                    duration: 600,
                    easing: 'easeOutElastic(1, .6)'
                });
            });
        });

        // ── 4. Logo subtle pulse ───────────────────────────────────
        var logoImg = document.querySelector('.logo img');
        if (logoImg) {
            anime({
                targets: logoImg,
                scale: [1, 1.06, 1],
                duration: 3000,
                loop: true,
                easing: 'easeInOutSine',
                delay: 2000
            });
        }

        // ── 5. Pricing "Featured" card pop on scroll ───────────────
        var featuredCard = document.querySelector('.pricing-card.featured');
        if (featuredCard) {
            var featuredObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.animated) return;
                        entry.target.dataset.animated = '1';
                        anime({
                            targets: entry.target,
                            scale: [1, 1.08, 1.05],
                            duration: 1200,
                            easing: 'easeOutElastic(1, .7)'
                        });
                        featuredObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            featuredObserver.observe(featuredCard);
        }

        // ── 6. Comparison table rows — slide in from left ─────────
        var tableRows = document.querySelectorAll('#comparison table tbody tr, .comparison-table tbody tr');
        if (tableRows.length) {
            var tableObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.animated) return;
                        entry.target.dataset.animated = '1';
                        anime({
                            targets: tableRows,
                            translateX: [-40, 0],
                            opacity: [0, 1],
                            delay: anime.stagger(100),
                            duration: 800,
                            easing: 'easeOutCubic'
                        });
                        tableObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            tableRows.forEach(function (r) {
                r.style.opacity = '0';
                r.style.transform = 'translateX(-40px)';
            });
            if (tableRows[0]) {
                var section = tableRows[0].closest('section') || tableRows[0].closest('.glass');
                if (section) tableObserver.observe(section);
            }
        }

        // ── 7. Step numbers — bounce in ────────────────────────────
        var stepNumbers = document.querySelectorAll('.step-number');
        if (stepNumbers.length) {
            var stepObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.animated) return;
                        entry.target.dataset.animated = '1';
                        anime({
                            targets: stepNumbers,
                            scale: [0, 1],
                            opacity: [0, 1],
                            delay: anime.stagger(150),
                            duration: 900,
                            easing: 'easeOutElastic(1, .5)'
                        });
                        stepObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            stepNumbers.forEach(function (s) {
                s.style.opacity = '0';
                s.style.transform = 'scale(0)';
            });
            var stepsGrid = document.querySelector('.steps-grid');
            if (stepsGrid) stepObserver.observe(stepsGrid);
        }

        // ── 8. Footer links stagger ────────────────────────────────
        var footer = document.querySelector('footer');
        if (footer) {
            var footerLinks = footer.querySelectorAll('.footer-links a');
            if (footerLinks.length) {
                var footerObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            if (entry.target.dataset.animated) return;
                            entry.target.dataset.animated = '1';
                            anime({
                                targets: footerLinks,
                                translateX: [-20, 0],
                                opacity: [0, 1],
                                delay: anime.stagger(40),
                                duration: 500,
                                easing: 'easeOutQuad'
                            });
                            footerObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                footerLinks.forEach(function (l) {
                    l.style.opacity = '0';
                    l.style.transform = 'translateX(-20px)';
                });
                footerObserver.observe(footer);
            }
        }

        // ── 9. Gauge / SEO score animation ─────────────────────────
        var gaugeProgress = document.querySelector('.gauge-progress');
        if (gaugeProgress) {
            var gaugeObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.animated) return;
                        entry.target.dataset.animated = '1';

                        anime({
                            targets: gaugeProgress,
                            strokeDashoffset: [anime.setDashoffset, 0],
                            duration: 2500,
                            easing: 'easeOutQuart'
                        });

                        var scoreEl = document.getElementById('gauge-score');
                        if (scoreEl) {
                            var obj = { val: 0 };
                            anime({
                                targets: obj,
                                val: 99,
                                round: 1,
                                duration: 2500,
                                easing: 'easeOutQuart',
                                update: function () { scoreEl.textContent = obj.val; }
                            });
                        }
                        gaugeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            gaugeObserver.observe(gaugeProgress);
        }

        // ── 10. Client logo entrance ───────────────────────────────
        var clientWrapper = document.querySelector('.clients-wrapper');
        if (clientWrapper) {
            var clientImages = clientWrapper.querySelectorAll('img');
            var clientObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.animated) return;
                        entry.target.dataset.animated = '1';
                        anime({
                            targets: clientImages,
                            scale: [0.6, 1],
                            opacity: [0, 1],
                            delay: anime.stagger(80),
                            duration: 700,
                            easing: 'easeOutBack'
                        });
                        clientObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            clientImages.forEach(function (img) {
                img.style.opacity = '0';
                img.style.transform = 'scale(0.6)';
            });
            clientObserver.observe(clientWrapper);
        }

        // ── 11. Blog cards (blog.html) ─────────────────────────────
        var blogCards = document.querySelectorAll('.blog-card');
        if (blogCards.length) {
            var blogObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.animated) return;
                        entry.target.dataset.animated = '1';
                        anime({
                            targets: entry.target,
                            translateY: [30, 0],
                            opacity: [0, 1],
                            scale: [0.97, 1],
                            duration: 800,
                            easing: 'easeOutCubic'
                        });
                        blogObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            blogCards.forEach(function (c) {
                c.style.opacity = '0';
                blogObserver.observe(c);
            });
        // ── 12. Tech Float Background Elements ──────────────────
        anime({
            targets: '.tech-float',
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            scale: () => anime.random(0.8, 1.2),
            rotate: () => anime.random(-15, 15),
            duration: () => anime.random(6000, 12000),
            delay: () => anime.random(0, 2000),
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });

        console.log('[Webappzo] Anime.js animations initialized ✓');
    }
})();
