document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const header = document.querySelector('header');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intersection Observer for reveal animations
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

    document.querySelectorAll('.reveal:not(.hero-content):not(.portfolio-card)').forEach((el, index) => {
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

    // Mobile Nav (hamburger) logic
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

    // Smooth scroll for internal page links
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

    const projects = [
        {
            id: 'landing-page-leonardo',
            title: 'Landing Page Leonardo',
            description: 'Landing page responsiva criada para apresentar servicos profissionais com uma narrativa direta, visual premium e foco em conversao de visitantes em contatos qualificados.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'UI/UX', 'Responsividade'],
            objective: 'Criar uma presenca digital clara e persuasiva, destacando autoridade, diferenciais e chamada para contato em uma experiencia rapida e adaptada a todos os dispositivos.',
            images: [
                'img/project-01.jpg',
                'img/project-03.jpg'
            ]
        },
        {
            id: 'nexus-fitness-center',
            title: 'Nexus Fitness Center',
            description: 'Interface institucional para uma academia moderna, com destaque para posicionamento visual forte, apresentacao de estrutura e direcionamento rapido para captacao de alunos.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Landing Page', 'Performance'],
            objective: 'Valorizar a marca, comunicar beneficios de forma objetiva e conduzir o usuario para uma acao de contato ou matricula sem friccao.',
            images: [
                'img/project-02.jpg'
            ]
        },
        {
            id: 'gaw-finance',
            title: 'Gaw Finance',
            description: 'O Gaw Finance é um sistema de gestão financeira desenvolvido para ajudar usuários a organizarem receitas, despesas, assinaturas e investimentos de forma prática e intuitiva.',
            technologies: ["Python", "Django", "Django REST Framework", "PostgreSQL", "Docker", "Bootstrap", "Controle Financeiro"],
            objective: 'Facilitar o controle financeiro pessoal através de uma plataforma moderna, acessível e eficiente, auxiliando na tomada de decisões financeiras.',
            images: [
                'img/gaw_finace01.png',
                'img/gaw_finace02.png',
                'img/gaw_finace03.png',
                'img/gaw_finace04.png'
            ]
        }
    ];

    const portfolioModal = document.getElementById('portfolio-modal');
    const portfolioTitle = document.getElementById('portfolio-modal-title');
    const portfolioDescription = document.querySelector('[data-project-description]');
    const portfolioObjective = document.querySelector('[data-project-objective]');
    const portfolioTechnologies = document.querySelector('[data-project-technologies]');
    const carouselTrack = document.querySelector('[data-project-carousel-track]');
    const carouselIndicators = document.querySelector('[data-project-indicators]');
    const prevButton = document.querySelector('[data-project-prev]');
    const nextButton = document.querySelector('[data-project-next]');
    const closeButtons = document.querySelectorAll('[data-project-close]');
    const portfolioCards = document.querySelectorAll('.portfolio-card[data-project-id]');

    let activeProject = null;
    let activeSlide = 0;
    let lastFocusedElement = null;
    let closeTimer = null;

    const getFocusableElements = () => {
        if (!portfolioModal) {
            return [];
        }

        return Array.from(portfolioModal.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    };

    const updateCarousel = () => {
        if (!activeProject || !carouselTrack || !carouselIndicators) {
            return;
        }

        carouselTrack.style.transform = `translateX(-${activeSlide * 100}%)`;

        carouselIndicators.querySelectorAll('.portfolio-carousel-indicator').forEach((indicator, index) => {
            const isActive = index === activeSlide;
            indicator.classList.toggle('is-active', isActive);
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const renderProjectDetails = (project) => {
        activeProject = project;
        activeSlide = 0;

        portfolioTitle.textContent = project.title;
        portfolioDescription.textContent = project.description;
        portfolioObjective.textContent = project.objective;

        portfolioTechnologies.innerHTML = project.technologies
            .map((technology) => `<li>${technology}</li>`)
            .join('');

        carouselTrack.innerHTML = project.images
            .map((image, index) => `
                <figure class="portfolio-carousel-slide">
                    <img src="${image}" alt="${project.title} - imagem ${index + 1}">
                </figure>
            `)
            .join('');

        carouselIndicators.innerHTML = project.images
            .map((_, index) => `
                <button type="button" class="portfolio-carousel-indicator" data-slide-index="${index}" aria-label="Ir para imagem ${index + 1}"></button>
            `)
            .join('');

        const hasMultipleImages = project.images.length > 1;
        prevButton.disabled = !hasMultipleImages;
        nextButton.disabled = !hasMultipleImages;

        updateCarousel();
    };

    const openProjectDetails = (projectId) => {
        const project = projects.find((item) => item.id === projectId);

        if (!project || !portfolioModal) {
            return;
        }

        window.clearTimeout(closeTimer);
        lastFocusedElement = document.activeElement;

        renderProjectDetails(project);
        portfolioModal.hidden = false;
        portfolioModal.dataset.activeProject = project.id;
        portfolioModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('portfolio-modal-open');

        window.requestAnimationFrame(() => {
            portfolioModal.classList.add('is-open');
            portfolioModal.querySelector('.portfolio-modal-close')?.focus();
        });
    };

    const closeProjectDetails = () => {
        if (!portfolioModal || portfolioModal.hidden) {
            return;
        }

        portfolioModal.classList.remove('is-open');
        portfolioModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('portfolio-modal-open');

        closeTimer = window.setTimeout(() => {
            portfolioModal.hidden = true;
            delete portfolioModal.dataset.activeProject;
            activeProject = null;
            lastFocusedElement?.focus();
        }, 250);
    };

    const showNextSlide = () => {
        if (!activeProject || activeProject.images.length <= 1) {
            return;
        }

        activeSlide = (activeSlide + 1) % activeProject.images.length;
        updateCarousel();
    };

    const showPreviousSlide = () => {
        if (!activeProject || activeProject.images.length <= 1) {
            return;
        }

        activeSlide = (activeSlide - 1 + activeProject.images.length) % activeProject.images.length;
        updateCarousel();
    };

    portfolioCards.forEach((card) => {
        card.addEventListener('click', () => {
            openProjectDetails(card.dataset.projectId);
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeProjectDetails);
    });

    prevButton?.addEventListener('click', showPreviousSlide);
    nextButton?.addEventListener('click', showNextSlide);

    carouselIndicators?.addEventListener('click', (event) => {
        const indicator = event.target.closest('[data-slide-index]');

        if (!indicator) {
            return;
        }

        activeSlide = Number(indicator.dataset.slideIndex);
        updateCarousel();
    });

    document.addEventListener('keydown', (event) => {
        if (!portfolioModal || portfolioModal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            closeProjectDetails();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
            return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    const feedbacks = [
        {
            name: 'Ricardo Almeida',
            role: 'Empresário',
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
            role: 'Gerente Financeiro',
            projectType: 'Sistema Personalizado',
            text: 'O sistema que a GAW desenvolveu para nós otimizou processos que antes eram feitos manualmente. A equipe entendeu nossa dor e entregou uma solução que realmente funciona no dia a dia.'
        },
        {
            name: 'Patrícia Rocha',
            role: 'Proprietária de Clínica',
            projectType: 'Landing Page',
            text: 'Desde o lançamento da landing page, o número de agendamentos online triplicou. Profissionalismo, prazo cumprido e um resultado que superou minhas expectativas. Recomendo de olhos fechados.'
        }
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

    // Scroll-interactive ambient animation
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
});
