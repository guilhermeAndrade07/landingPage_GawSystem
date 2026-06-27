document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const header = document.querySelector('header');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.solution-card, .stat-item, .process-item').forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 180}ms`);
    });

    document.querySelectorAll('.reveal:not(.hero-content)').forEach((el, index) => {
        el.classList.add(index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right');
        el.style.setProperty('--reveal-delay', `${(index % 4) * 120}ms`);
    });

    document.querySelectorAll('.reveal, .scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    if (!prefersReducedMotion) {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollTop = window.scrollY || window.pageYOffset;
            const scrollable = Math.max(root.scrollHeight - window.innerHeight, 1);
            const progress = Math.min(scrollTop / scrollable, 1);

            root.style.setProperty('--scroll-progress', progress.toFixed(4));

            header?.classList.toggle('is-scrolled', scrollTop > 16);
            ticking = false;
        };

        const requestScrollEffects = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        updateScrollEffects();
        window.addEventListener('scroll', requestScrollEffects, { passive: true });
        window.addEventListener('resize', requestScrollEffects);
    } else {
        root.style.setProperty('--scroll-progress', '0');
    }

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavCloseBtns = document.querySelectorAll('[data-mobile-nav-close]');
    const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
    let lastFocusedBeforeNav = null;

    const isMobileNavOpen = () => document.body.classList.contains('mobile-nav-open');

    const openMobileNav = () => {
        if (!mobileNav || !hamburgerBtn) {
            return;
        }

        lastFocusedBeforeNav = document.activeElement;

        const scrollY = window.scrollY || window.pageYOffset || 0;
        document.body.dataset.scrollLockY = String(scrollY);
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.classList.add('mobile-nav-open');

        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileNavOverlay?.classList.add('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Fechar menu de navegação');

        window.requestAnimationFrame(() => {
            mobileNav.querySelector('a, button')?.focus();
        });
    };

    const closeMobileNav = () => {
        if (!mobileNav || !hamburgerBtn) {
            return;
        }

        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNavOverlay?.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Abrir menu de navegação');
        document.body.classList.remove('mobile-nav-open');

        const scrollY = Number(document.body.dataset.scrollLockY || 0);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        delete document.body.dataset.scrollLockY;
        window.scrollTo(0, scrollY);

        if (lastFocusedBeforeNav && typeof lastFocusedBeforeNav.focus === 'function') {
            lastFocusedBeforeNav.focus();
        }
    };

    hamburgerBtn?.addEventListener('click', () => {
        if (isMobileNavOpen()) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    mobileNavCloseBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            closeMobileNav();
        });
    });

    mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMobileNavOpen()) {
            closeMobileNav();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && isMobileNavOpen()) {
            closeMobileNav();
        }
    });

    document.querySelectorAll('nav a[href^="#"], .footer-nav a[href^="#"], .hero-actions a[href^="#"], .logo[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = href === '#' ? document.body : document.querySelector(href);

            if (!target) {
                return;
            }

            e.preventDefault();

            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetTop = target === document.body
                ? 0
                : target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll('.plan-card').forEach((card) => {
        const toggleButton = card.querySelector('.plan-toggle');
        const toggleLabel = toggleButton?.querySelector('span');
        const details = card.querySelector('.plan-details');

        if (!toggleButton || !toggleLabel || !details) {
            return;
        }

        toggleButton.addEventListener('click', () => {
            const isExpanded = card.classList.toggle('is-expanded');

            toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            details.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
            toggleLabel.textContent = isExpanded ? 'Ver menos' : 'Ver mais';
        });
    });

    const feedbacks = [
        {
            name: 'Karen Monarkia',
            role: 'Empresária',
            projectType: 'Landing Page',
            text: 'A GAW Systems entregou muito além do que eu esperava. O site ficou impecável, rápido e já comecei a receber contatos qualificados pela internet. O atendimento foi direto e sem burocracia.'
        },
        {
            name: 'Camila Ferreira',
            role: 'Personal Trainer',
            projectType: 'Site Institucional',
            text: 'Eu precisava de uma presença digital que passasse profissionalismo, e foi exatamente o que recebi. O site ficou moderno, funciona perfeitamente no celular e reflete a qualidade do meu trabalho.'
        },
        {
            name: 'André Martins',
            role: 'Barbeiro',
            projectType: 'Sistema Personalizado',
            text: 'O sistema que a GAW desenvolveu para nós otimizou processos que antes eram feitos manualmente. A equipe entendeu nossa dor e entregou uma solução que realmente funciona no dia a dia.'
        },
    ];

    const feedbacksTrack = document.querySelector('[data-feedbacks-track]');
    const feedbackIndicators = document.querySelector('[data-feedback-indicators]');
    const feedbackPrev = document.querySelector('[data-feedback-prev]');
    const feedbackNext = document.querySelector('[data-feedback-next]');

    if (feedbacksTrack && feedbackIndicators) {
        feedbacks.forEach((fb, i) => {
            const slide = document.createElement('div');
            slide.className = 'feedback-slide';
            slide.setAttribute('aria-label', `Depoimento ${i + 1} de ${feedbacks.length}`);
            slide.innerHTML = `
                <div class="feedback-card">
                    <div class="feedback-header">
                        <div class="feedback-avatar">
                            <iconify-icon icon="solar:user-circle-linear" style="font-size: 2.5rem; color: var(--primary);"></iconify-icon>
                        </div>
                        <div class="feedback-info">
                            <span class="feedback-name">${fb.name}</span>
                            <span class="feedback-meta">${fb.role} &middot; ${fb.projectType}</span>
                        </div>
                    </div>
                    <p class="feedback-text">${fb.text}</p>
                </div>
            `;
            feedbacksTrack.appendChild(slide);
        });

        feedbacks.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'feedbacks-indicator' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
            dot.dataset.feedbackIndex = i;
            feedbackIndicators.appendChild(dot);
        });

        let currentFeedback = 0;
        let feedbackTimer = null;
        const totalFeedbacks = feedbacks.length;

        const goToFeedback = (index) => {
            currentFeedback = ((index % totalFeedbacks) + totalFeedbacks) % totalFeedbacks;
            feedbacksTrack.style.transform = `translateX(-${currentFeedback * 100}%)`;
            feedbackIndicators.querySelectorAll('.feedbacks-indicator').forEach((dot, i) => {
                dot.classList.toggle('is-active', i === currentFeedback);
            });
        };

        const startFeedbackTimer = () => {
            stopFeedbackTimer();
            feedbackTimer = window.setInterval(() => {
                goToFeedback(currentFeedback + 1);
            }, 6000);
        };

        const stopFeedbackTimer = () => {
            if (feedbackTimer) {
                window.clearInterval(feedbackTimer);
                feedbackTimer = null;
            }
        };

        feedbackPrev?.addEventListener('click', () => {
            goToFeedback(currentFeedback - 1);
            startFeedbackTimer();
        });

        feedbackNext?.addEventListener('click', () => {
            goToFeedback(currentFeedback + 1);
            startFeedbackTimer();
        });

        feedbackIndicators.addEventListener('click', (e) => {
            const dot = e.target.closest('[data-feedback-index]');
            if (!dot) return;
            goToFeedback(Number(dot.dataset.feedbackIndex));
            startFeedbackTimer();
        });

        startFeedbackTimer();
    }

    const ambientCanvas = document.querySelector('[data-ambient-canvas]');
    if (ambientCanvas) {
        const ctx = ambientCanvas.getContext('2d');
        const particles = [];
        const particleCount = 120;

        const resizeCanvas = () => {
            ambientCanvas.width = window.innerWidth;
            ambientCanvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const totalHeight = () => Math.max(document.body.scrollHeight, window.innerHeight);

        for (let i = 0; i < particleCount; i++) {
            const baseY = Math.random() * totalHeight();
            particles.push({
                x: Math.random() * window.innerWidth,
                y: baseY,
                baseY: baseY,
                radius: Math.random() * 2 + 0.8,
                speed: Math.random() * 0.12 + 0.04,
                drift: Math.random() * 0.4 - 0.2,
                opacity: Math.random() * 0.35 + 0.1,
                parallaxFactor: Math.random() * 0.06 + 0.01
            });
        }

        let scrollY = 0;

        const drawAmbient = () => {
            ctx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

            const h = totalHeight();

            particles.forEach((p) => {
                const rawY = p.baseY - (scrollY * p.parallaxFactor);
                const loopH = h * 0.95;
                const loopY = ((rawY % loopH) + loopH) % loopH;
                const offsetX = Math.sin(Date.now() * p.speed * 0.001 + p.drift * 10) * 20;
                const drawX = p.x + offsetX;
                const drawY = loopY + Math.cos(Date.now() * p.speed * 0.0008 + p.drift * 5) * 8;

                ctx.beginPath();
                ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 38, ${p.opacity})`;
                ctx.fill();

                if (p.radius > 1.4) {
                    ctx.beginPath();
                    ctx.arc(drawX, drawY, p.radius * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 255, 38, ${p.opacity * 0.15})`;
                    ctx.fill();
                }
            });

            const maxDist = 170;

            for (let i = 0; i < particles.length; i++) {
                const pi = particles[i];
                const rawYi = pi.baseY - (scrollY * pi.parallaxFactor);
                const loopH = h * 0.95;
                const liY = ((rawYi % loopH) + loopH) % loopH + Math.cos(Date.now() * pi.speed * 0.0008 + pi.drift * 5) * 8;
                const liX = pi.x + Math.sin(Date.now() * pi.speed * 0.001 + pi.drift * 10) * 20;

                for (let j = i + 1; j < particles.length; j++) {
                    const pj = particles[j];
                    const rawYj = pj.baseY - (scrollY * pj.parallaxFactor);
                    const ljY = ((rawYj % loopH) + loopH) % loopH + Math.cos(Date.now() * pj.speed * 0.0008 + pj.drift * 5) * 8;
                    const ljX = pj.x + Math.sin(Date.now() * pj.speed * 0.001 + pj.drift * 10) * 20;

                    const dx = liX - ljX;
                    const dy = liY - ljY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const lineOpacity = 0.06 * (1 - dist / maxDist);
                        ctx.beginPath();
                        ctx.moveTo(liX, liY);
                        ctx.lineTo(ljX, ljY);
                        ctx.strokeStyle = `rgba(0, 255, 38, ${lineOpacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(drawAmbient);
        };

        const updateScrollForAmbient = () => {
            scrollY = window.scrollY || window.pageYOffset;
            if (ambientCanvas.height < document.body.scrollHeight) {
                ambientCanvas.height = document.body.scrollHeight;
            }
        };

        window.addEventListener('scroll', updateScrollForAmbient, { passive: true });
        window.addEventListener('resize', () => {
            resizeCanvas();
            particles.forEach(p => {
                p.x = Math.random() * window.innerWidth;
            });
        });
        updateScrollForAmbient();
        drawAmbient();
    }

    // ============================================
    // Scroll-driven interactions
    // ============================================

    const heroMain = document.querySelector('.hero-main');
    if (heroMain && !prefersReducedMotion) {
        let heroTicking = false;
        const updateHeroParallax = () => {
            const rect = heroMain.getBoundingClientRect();
            const windowH = window.innerHeight;
            const total = rect.height + windowH * 0.6;
            const scrolled = windowH - rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / total));
            heroMain.style.setProperty('--hero-progress', progress.toFixed(4));
            heroTicking = false;
        };
        const requestHeroParallax = () => {
            if (!heroTicking) {
                window.requestAnimationFrame(updateHeroParallax);
                heroTicking = true;
            }
        };
        window.addEventListener('scroll', requestHeroParallax, { passive: true });
        window.addEventListener('resize', requestHeroParallax);
        updateHeroParallax();
    }

    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length) {
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animateNumber = (el, from, to, duration, format) => {
            const start = performance.now();
            const step = (now) => {
                const t = Math.min((now - start) / duration, 1);
                const value = from + (to - from) * easeOutCubic(t);
                el.textContent = format(value);
                if (t < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.classList.remove('is-counting');
                }
            };
            el.classList.add('is-counting');
            requestAnimationFrame(step);
        };

        const animateTypewriter = (el, text, perChar) => {
            el.textContent = '';
            let i = 0;
            const tick = () => {
                i += 1;
                el.textContent = text.slice(0, i);
                if (i < text.length) {
                    window.setTimeout(tick, perChar);
                } else {
                    el.classList.remove('is-counting');
                }
            };
            el.classList.add('is-counting');
            tick();
        };

        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                const el = entry.target;
                if (!el.dataset.statValue) {
                    el.dataset.statValue = el.textContent.trim();
                }
                const original = el.dataset.statValue;

                if (prefersReducedMotion) {
                    el.textContent = original;
                } else if (/^\d+%$/.test(original)) {
                    animateNumber(el, 0, parseInt(original, 10), 1400, (v) => `${Math.round(v)}%`);
                } else if (/^<\s*1s$/.test(original)) {
                    animateNumber(el, 0, 0.9, 1400, (v) => `< ${v.toFixed(1)}s`);
                } else {
                    animateTypewriter(el, original, 90);
                }
                statObserver.unobserve(el);
            });
        }, { threshold: 0.55 });

        statValues.forEach((el) => statObserver.observe(el));
    }

    if (!prefersReducedMotion) {
        const tiltCards = document.querySelectorAll('.solution-card');
        tiltCards.forEach((card) => {
            let rafId = null;
            const onMove = (event) => {
                const rect = card.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                rafId = requestAnimationFrame(() => {
                    card.style.setProperty('--mx', `${x}%`);
                    card.style.setProperty('--my', `${y}%`);
                    const tiltX = ((y - 50) / 50) * -4;
                    const tiltY = ((x - 50) / 50) * 4;
                    card.style.setProperty('--tilt-x', `${tiltX}deg`);
                    card.style.setProperty('--tilt-y', `${tiltY}deg`);
                    rafId = null;
                });
            };
            const onLeave = () => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            };
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
        });
    }
});
