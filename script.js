
// 1. AOS & Theme Toggle

if (typeof AOS !== 'undefined') {
    AOS.init({
        once: true,
        offset: 70,
        duration: 750,
        easing: 'ease-out-cubic'
    });
}

const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

function syncDarkClass(forceState) {
    if (typeof forceState === 'boolean') {
        htmlEl.classList.toggle('dark', forceState);
        document.body.classList.toggle('dark', forceState);
    } else {
        htmlEl.classList.toggle('dark');
        document.body.classList.toggle('dark', htmlEl.classList.contains('dark'));
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        syncDarkClass();
    });
}


// 2. Typing Effect

const words = [
    "MERN Stack Developer.",
    "CSE Student (VFSTR).",
    "Data & Analytics.",
    "Problem Solver.",
    "wed developer."
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById("typing-text");

function typeEffect() {
    if (!typingEl) return;

    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, Math.max(0, charIndex - 1));
        charIndex--;
    } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}
typeEffect();


// 3. Consolidated Scroll Handler (Progress, Navbar, Buttons)

const siteNavbar = document.querySelector('nav');
const navInner = document.getElementById('nav-inner');
const scrollProgressBar = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    scrollTopBtn.classList.add('transition-all', 'duration-300');
    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

let scrollRafId = null;

function handlePageScroll() {
    scrollRafId = null;
    const scrollTop = window.scrollY || window.pageYOffset || 0;

    // Scroll progress bar
    if (scrollProgressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // Navbar transparency & slim compact height
    if (siteNavbar) {
        if (scrollTop > 24) {
            siteNavbar.classList.add('nav-scrolled');
            siteNavbar.classList.remove('nav-transparent');
        } else {
            siteNavbar.classList.remove('nav-scrolled');
            siteNavbar.classList.add('nav-transparent');
        }

        if (navInner) {
            if (scrollTop > 30) {
                navInner.classList.remove('py-4', 'py-1');
                navInner.classList.add('py-2');
                siteNavbar.style.boxShadow = '0 8px 24px -6px rgba(15, 23, 42, 0.14)';
                siteNavbar.style.borderBottomColor = 'rgba(37, 99, 235, 0.25)';
            } else {
                navInner.classList.remove('py-2', 'py-1');
                navInner.classList.add('py-4');
                siteNavbar.style.boxShadow = 'none';
                siteNavbar.style.borderBottomColor = '';
            }
        }
    }

    // Back to top button (#back-to-top)
    if (backToTopBtn) {
        if (scrollTop > 350) {
            backToTopBtn.classList.remove('hidden');
            backToTopBtn.classList.add('flex');
        } else {
            backToTopBtn.classList.add('hidden');
            backToTopBtn.classList.remove('flex');
        }
    }

    // Optional custom button (#scrollTopBtn)
    if (scrollTopBtn) {
        if (scrollTop > 350) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0) scale(1)';
            scrollTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(14px) scale(0.9)';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    }
}

window.addEventListener('scroll', () => {
    if (!scrollRafId) {
        scrollRafId = requestAnimationFrame(handlePageScroll);
    }
}, { passive: true });

window.addEventListener('load', handlePageScroll);
handlePageScroll();


// 4. Smooth Anchor Scrolling

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// 5. Contact Form (Web3Forms)

const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

if (form && result && submitBtn) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData));

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                await response.json();
                result.classList.remove('hidden');
                if (response.status === 200) {
                    result.className = "text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
                    result.innerHTML = "✅ Message sent successfully! Vijay will reply soon.";
                    form.reset();
                } else {
                    result.className = "text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-red-100 text-red-700";
                    result.innerHTML = "❌ Something went wrong. Please check your Access Key.";
                }
            })
            .catch(() => {
                result.classList.remove('hidden');
                result.className = "text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-red-100 text-red-700";
                result.innerHTML = "❌ Network error. Please try again.";
            })
            .finally(() => {
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane text-xs"></i>';
                submitBtn.disabled = false;
                setTimeout(() => {
                    result.classList.add('hidden');
                }, 5000);
            });
    });
}


// 6. Project Filtering, Modal & Copy Toast

function filterProjects(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-blue-500/25');
        btn.classList.add('bg-white', 'dark:bg-cardDark', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-800');
    });

    if (btnElement) {
        btnElement.classList.remove('bg-white', 'dark:bg-cardDark', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-800');
        btnElement.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-blue-500/25');
    }

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        const matches = category === 'all' || card.getAttribute('data-category') === category;
        card.classList.remove('project-reveal');
        card.style.animationDelay = '0ms';

        if (matches) {
            card.style.display = 'flex';
            void card.offsetWidth;
            card.style.animationDelay = `${index * 55}ms`;
            card.classList.add('project-reveal');
        } else {
            card.style.display = 'none';
        }
    });
}

function openProjectModal(title, subtitle, desc, tags = [], liveUrl = '', repoUrl = '') {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-subtitle').textContent = subtitle;
    document.getElementById('modal-desc').textContent = desc;

    const tagsContainer = document.getElementById('modal-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-blue-50 text-primary dark:bg-blue-900/30';
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });
    }

    const linksContainer = document.getElementById('modal-links');
    if (linksContainer) {
        linksContainer.innerHTML = '';
        if (liveUrl) {
            const liveBtn = document.createElement('a');
            liveBtn.href = liveUrl;
            liveBtn.target = '_blank';
            liveBtn.rel = 'noopener noreferrer';
            liveBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-blue-700 transition inline-flex items-center gap-1.5';
            liveBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
            linksContainer.appendChild(liveBtn);
        }
        if (repoUrl) {
            const repoBtn = document.createElement('a');
            repoBtn.href = repoUrl;
            repoBtn.target = '_blank';
            repoBtn.rel = 'noopener noreferrer';
            repoBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:border-primary border border-slate-200 dark:border-slate-700 transition inline-flex items-center gap-1.5';
            repoBtn.innerHTML = '<i class="fab fa-github"></i> GitHub';
            linksContainer.appendChild(repoBtn);
        }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeProjectModal(event, forceClose = false) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    if (forceClose || (event && event.target === modal)) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
    }
    const toast = document.getElementById('copy-toast');
    const toastText = document.getElementById('copy-toast-text');
    if (!toast) return;

    if (toastText) toastText.textContent = label;
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('flex');
    }, 2200);
}


// 7. Mobile Menu & Stats Counter

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (mobileMenuIcon) {
            mobileMenuIcon.className = isOpen ? 'fas fa-times text-base' : 'fas fa-bars text-base';
        }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (mobileMenuIcon) {
                mobileMenuIcon.className = 'fas fa-bars text-base';
            }
        });
    });
}

const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function runCounters() {
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (Number.isNaN(target)) return;
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easedProgress;

            counter.textContent = currentVal.toFixed(decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toFixed(decimals) + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

const statsSection = document.querySelector('.counter')?.closest('section');
if (statsSection && typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                runCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

// 8. Desktop-Only Cursor Spotlight & 3D Tilt on Motion Cards

const hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

if (hasFinePointer) {
    document.querySelectorAll('.motion-card').forEach(card => {
        let rafId = null;

        card.addEventListener('aos:in', () => {
            if (!card.matches(':hover')) {
                card.style.transform = '';
            }
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.08s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease';
        });

        card.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -7;
                const rotateY = ((x - centerX) / centerX) * 7;

                card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            card.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease';
            card.style.transform = '';
        });
    });
}
