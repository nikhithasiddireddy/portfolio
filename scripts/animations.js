// Animation Controller using Intersection Observer API

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.createObservers();
        this.observeElements();
        this.initializeOnLoadAnimations();
    }

    createObservers() {
        // Standard reveal observer
        this.observers.set('reveal', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.revealElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        }));

        // Staggered animation observer
        this.observers.set('stagger', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.staggeredReveal(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        }));

        // Skills animation observer
        this.observers.set('skills', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateSkills(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -20px 0px'
        }));

        // Timeline animation observer
        this.observers.set('timeline', new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateTimelineItem(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.2
        }));
    }

    observeElements() {
        // Standard reveal elements
        const revealElements = document.querySelectorAll('.reveal-element:not(.timeline-item):not(.skill-category)');
        revealElements.forEach(el => {
            this.observers.get('reveal').observe(el);
        });

        // Staggered elements (projects, experience cards)
        const projectCards = document.querySelectorAll('.project-card');
        const experienceCards = document.querySelectorAll('.experience-card');
        
        [...projectCards, ...experienceCards].forEach(el => {
            this.observers.get('stagger').observe(el);
        });

        // Skills elements
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach(el => {
            this.observers.get('skills').observe(el);
        });

        // Timeline elements
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(el => {
            this.observers.get('timeline').observe(el);
        });
    }

    initializeOnLoadAnimations() {
        // Hero section animations
        const heroElements = document.querySelectorAll('.hero .animate-fade-in, .hero .animate-slide-up');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 + (index * 200));
        });
    }

    revealElement(element) {
        element.classList.add('revealed');
        
        // Add specific animation classes based on element type
        if (element.classList.contains('section-title')) {
            this.animateSectionTitle(element);
        }
    }

    staggeredReveal(element) {
        const container = element.parentElement;
        const siblings = Array.from(container.children);
        const index = siblings.indexOf(element);
        
        setTimeout(() => {
            element.classList.add('revealed');
            this.addBounceEffect(element);
        }, index * 150);
    }

    animateSkills(skillCategory) {
        skillCategory.classList.add('revealed');
        
        // Animate progress bars
        const progressBars = skillCategory.querySelectorAll('.skill-progress');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                if (width) {
                    bar.style.width = width + '%';
                }
                
                // Add pulse effect
                bar.style.animation = 'pulse 0.5s ease-in-out';
            }, index * 200);
        });

        // Animate tech icons
        const techIcons = skillCategory.querySelectorAll('.tech-icon');
        techIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotateY(0deg)';
                icon.style.opacity = '1';
            }, index * 100);
        });
    }

    animateTimelineItem(item) {
        const isEven = Array.from(item.parentElement.children).indexOf(item) % 2 === 1;
        
        item.style.transform = isEven ? 'translateX(50px)' : 'translateX(-50px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            item.classList.add('revealed');
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
            
            // Animate the dot
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                setTimeout(() => {
                    dot.style.transform = 'scale(1.2)';
                    dot.style.background = 'linear-gradient(45deg, #1e3a8a, #06b6d4)';
                    
                    setTimeout(() => {
                        dot.style.transform = 'scale(1)';
                    }, 200);
                }, 300);
            }
        }, 100);
    }

    animateSectionTitle(title) {
        // Animate the underline
        const underline = title.querySelector('::after');
        title.style.setProperty('--underline-width', '100%');
        
        // Letter by letter animation for the title
        const text = title.textContent;
        title.innerHTML = '';
        
        [...text].forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = 'all 0.3s ease';
            title.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    addBounceEffect(element) {
        element.style.animation = 'bounceIn 0.6s ease-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    // Parallax scrolling effect
    initializeParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Mouse follow effect
    initializeMouseEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #06b6d4, #1e3a8a);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Hide cursor on touch devices
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
        }
    }

    // Scroll-triggered counter animation
    animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const timer = setInterval(() => {
                            current += increment;
                            counter.textContent = Math.floor(current);
                            
                            if (current >= target) {
                                counter.textContent = target + '+';
                                clearInterval(timer);
                            }
                        }, 20);
                        
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    // Text reveal animation
    initializeTextReveal() {
        const textElements = document.querySelectorAll('.text-reveal');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            const words = text.split(' ');
            words.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word + ' ';
                wordSpan.style.opacity = '0';
                wordSpan.style.transform = 'translateY(20px)';
                wordSpan.style.transition = `all 0.5s ease ${index * 0.1}s`;
                element.appendChild(wordSpan);
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0)';
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(element);
        });
    }

    // Floating animation for decorative elements
    initializeFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
            element.style.animation = `float 3s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // Magnetic effect for buttons
    initializeMagneticEffect() {
        const magneticElements = document.querySelectorAll('.btn, .project-card, .social-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Initialize all effects
    initializeAllEffects() {
        this.animateCounters();
        this.initializeTextReveal();
        this.initializeFloatingElements();
        this.initializeMagneticEffect();
        this.initializeMouseEffects();
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const animationController = new AnimationController();
    
    // Initialize additional effects after a short delay
    setTimeout(() => {
        animationController.initializeAllEffects();
    }, 500);
});

// Smooth scroll polyfill for older browsers
if (!CSS.supports('scroll-behavior: smooth')) {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                smoothScrollTo(offsetTop, 800);
            }
        });
    });
}

function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Performance optimization: Use passive event listeners
const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
passiveEvents.forEach(eventType => {
    document.addEventListener(eventType, function() {}, { passive: true });
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Error handling for animations
window.addEventListener('error', function(e) {
    console.warn('Animation error caught:', e.error);
    // Gracefully degrade by removing problematic animations
});

// Viewport height fix for mobile browsers
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController };
}