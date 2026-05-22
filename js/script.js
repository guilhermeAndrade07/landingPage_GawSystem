document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const header = document.querySelector('header');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intersection Observer for reveal animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.solution-card, .stat-item, .process-item').forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
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
            root.style.setProperty('--hero-parallax', `${Math.max(scrollTop * -0.055, -64).toFixed(1)}px`);
            root.style.setProperty('--workflow-parallax', `${Math.max((scrollTop - window.innerHeight) * -0.018, -42).toFixed(1)}px`);

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

    // Mobile Menu Toggle (Optional enhancement)
    // Add logic here if a mobile menu button is added to the HTML

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

    const projects = [
        {
            id: 'landing-page-leonardo',
            title: 'Landing Page Leonardo',
            description: 'Landing page responsiva criada para apresentar servicos profissionais com uma narrativa direta, visual premium e foco em conversao de visitantes em contatos qualificados.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'UI/UX', 'Responsividade'],
            objective: 'Criar uma presenca digital clara e persuasiva, destacando autoridade, diferenciais e chamada para contato em uma experiencia rapida e adaptada a todos os dispositivos.',
            images: [
                'img/project-01.jpg',
                'img/project-04.jpg'
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

    // Dynamic background effect (subtle parallax or particles could go here)
    // For now, let's add a simple mouse move effect to the hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPos = (clientX / innerWidth - 0.5) * 20;
            const yPos = (clientY / innerHeight - 0.5) * 20;
            
            const content = heroVisual.querySelector('.hero-visual-content');
            if (content) {
                content.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }
        });
    }
});
