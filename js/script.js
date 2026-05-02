document.addEventListener('DOMContentLoaded', () => {
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

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Mobile Menu Toggle (Optional enhancement)
    // Add logic here if a mobile menu button is added to the HTML

    // Smooth scroll for nav links
    document.querySelectorAll('nav a, .footer-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
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
