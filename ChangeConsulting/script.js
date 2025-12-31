// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handler
    const contactForm = document.getElementById('opsReviewForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                business: document.getElementById('business').value,
                challenge: document.getElementById('challenge').value
            };

            // Here you would typically send this to your backend
            // For now, we'll show a success message
            alert('Thank you! We\'ll reach out to you shortly to schedule your free ops review.\n\n' +
                  'In the meantime, you can also contact us directly via email or WhatsApp.');
            
            // Reset form
            contactForm.reset();
                
            // Optional: Send to your backend/email service
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
        });
    }

    // Add subtle fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in effect
    document.querySelectorAll('.section, .problem-item, .impact-item, .different-item, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Sticky header shadow on scroll
    const stickyHeader = document.querySelector('.sticky-header');
    if (stickyHeader) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                stickyHeader.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            } else {
                stickyHeader.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
    }
});

