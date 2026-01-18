// Initialize Animate On Scroll (AOS)
AOS.init({
    once: true,
    offset: 100,
    duration: 800,
    easing: 'ease-out-cubic',
});

// Selectors
const navbar = document.querySelector('.navbar');
const scrollProgress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Mobile Menu Selectors
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Navbar Blur & Scroll Progress
window.addEventListener('scroll', () => {
    // Floating Nav styling on scroll (Active if scrolled > 20px)
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Progress
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = `${progress}%`;

    // Back to Top Button
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Active Link Highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 250)) { // Increased offset for better triggering
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu Toggle Logic
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : 'auto'; // Prevent scrolling when menu open (logic inverted because isExpanded is previous state)
    });
}

// Close Mobile Menu on Link Click
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
});

// Project Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

if (filterBtns) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');

                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; /* trigger reflow */
                item.style.animation = null;

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Optional: Add fade-in animation class here if desired
                } else {
                    item.style.display = 'none';
                }
            });

            // Re-trigger AOS layout refresh if using AOS
            if (window.AOS) setTimeout(() => AOS.refresh(), 100);
        });
    });
}

// Smooth Scrolling (Native + Offset shim)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close standard Bootstrap collapse if open (fallback)
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none' && navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: true });
            }

            // Scroll with offset
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Typing Text Effect
const textElement = document.querySelector('.typing-text');
const words = ['Senior Software Engineer', 'Java Spring Boot Expert', 'Laravel Developer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const textElement = document.querySelector('.typing-text');
    if (!textElement) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex--);
        textElement.classList.add('typing-cursor');
    } else {
        textElement.textContent = currentWord.substring(0, charIndex++);
        textElement.classList.add('typing-cursor');
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', typeEffect);

// --- Premium Terminal Logic ---
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

if (terminalInput && terminalOutput) {
    const commands = {
        'help': 'Available commands: <span class="text-warning">about, experience, projects, skills, contact, clear, whoami, date</span>',
        'whoami': 'User: <span class="text-success">Visitor</span><br>Role: <span class="text-primary">Recruiter / Developer</span><br>Access: <span class="text-warning">Granted</span>',
        'about': 'Full-Stack Engineer specialized in scalable backend systems (Java/PHP) and modern frontend interfaces.',
        'experience': '<span class="text-info">1. Creative City</span> (2023-Present) - Senior Backend Dev<br><span class="text-info">2. Zone Delivery</span> (2021-2023) - Full Stack Dev',
        'projects': 'Launching "Projects" module... <br>Found: <span class="text-success">Creative City, CC Portal, Rider Souq</span>',
        'skills': '<span class="text-warning">Backend:</span> Java, Spring Boot, Laravel<br><span class="text-warning">Frontend:</span> React, Vue, Bootstrap<br><span class="text-warning">DevOps:</span> AWS, Docker',
        'contact': 'Email: <a href="mailto:suhail3k@gmail.com" class="text-primary" target="_blank">suhail3k@gmail.com</a>',
        'date': new Date().toString(),
        'sudo': '<span class="text-danger">Permission denied:</span> You are not root.',
        'clear': function () {
            terminalOutput.innerHTML = '';
            // Re-add welcome message on clear? simpler to just leave empty.
            return '';
        }
    };

    // Keep focus on input
    terminalBody.addEventListener('click', () => terminalInput.focus());

    // Sync custom cursor with input val (optional - CSS caret is hidden, but we might just use input val)
    // Actually, simple input is robust. Let's just rely on standard input but styled.

    terminalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const input = this.value.trim().toLowerCase();
            this.value = '';

            // Add input line to history
            const historyLine = document.createElement('div');
            historyLine.className = 'mb-1';

            // Check for mobile to adjust prompt in history
            const isMobile = window.innerWidth <= 768;
            const promptHTML = isMobile ? '<span class="text-success">$</span> ' : '<span class="prompt-user">visitor@portfolio</span>:<span class="prompt-path">~</span>$ ';

            historyLine.innerHTML = `${promptHTML}<span class="text-light">${input}</span>`;
            terminalOutput.appendChild(historyLine);

            // Process command
            let response = '';
            if (commands[input]) {
                if (typeof commands[input] === 'function') {
                    response = commands[input]();
                } else {
                    response = commands[input];
                }
            } else if (input !== '') {
                response = `<span class="text-danger">bash: ${input}: command not found</span>`;
            }

            if (response) {
                const responseLine = document.createElement('div');
                responseLine.className = 'mb-3 text-light';
                responseLine.style.lineHeight = '1.6';
                responseLine.innerHTML = response;
                terminalOutput.appendChild(responseLine);
            }

            // Scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}
// Focus input on click
document.querySelector('.terminal-window').addEventListener('click', () => {
    terminalInput.focus();
});

// --- 3D Tilt Effect (Hero + Premium Cards) ---
const tiltCards = document.querySelectorAll('.hero-card-enhanced, .card-stack-item');

if (tiltCards.length > 0) {
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation
            const xRotation = -((y - rect.height / 2) / rect.height * 20);
            const yRotation = (x - rect.width / 2) / rect.width * 20;

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}


// --- Contact Form Handling with Validation ---
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Close Modal Logic
if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
}

const validateInput = (input) => {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Create or select feedback element
    let feedback = input.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentElement.appendChild(feedback);
    }

    // Validation Rules
    if (input.name === 'name') {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
    } else if (input.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (input.name === 'subject') {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'Subject must be at least 3 characters';
        }
    } else if (input.name === 'message') {
        if (value.length < 5) {
            isValid = false;
            errorMessage = 'Message must be at least 5 characters';
        }
    }

    if (value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Update UI
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        feedback.textContent = errorMessage;
    }

    return isValid;
};

if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateInput(input);
            }
        });
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalBtnContent = btn.innerHTML;

        // Loading State
        btn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const scriptURL = 'https://script.google.com/macros/s/AKfycbyr5xiM3JxX9sVXhFe9jdYkUqfZung0Sutd3vnJyzL7npl2f_txUaCuJIJ40UTzBP4B1g/exec';

        fetch(scriptURL, {
            method: 'POST',
            body: new FormData(contactForm)
        })
            .then(response => {
                // Reset Form
                contactForm.reset();
                inputs.forEach(input => {
                    input.classList.remove('is-valid');
                    input.classList.remove('is-invalid');
                });

                // Success Feedback
                btn.innerHTML = '<span>Sent!</span><i class="fa-solid fa-check"></i>';
                btn.classList.remove('btn-lux');
                btn.classList.add('btn-success');

                setTimeout(() => {
                    // Show Custom Modal
                    if (successModal) successModal.classList.add('active');

                    // Reset Button
                    btn.innerHTML = originalBtnContent;
                    btn.classList.add('btn-lux');
                    btn.classList.remove('btn-success');
                    btn.disabled = false;
                }, 1000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.innerHTML = '<span>Failed</span><i class="fa-solid fa-triangle-exclamation"></i>';
                setTimeout(() => {
                    btn.innerHTML = originalBtnContent;
                    btn.disabled = false;
                    alert("Oops! Something went wrong. Please try again.");
                }, 3000);
            });
    });
}
