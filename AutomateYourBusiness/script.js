// Initialize EmailJS
(function() {
    emailjs.init("pNhQJVEpwaz1Ban6h");
})();

// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Download button handler - show form
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadFormSection = document.getElementById('download-form');
    if (downloadBtn && downloadFormSection) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Show the download form section
            downloadFormSection.style.display = 'block';
            // Scroll to the form
            downloadFormSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Download form handler with EmailJS
    const downloadForm = document.getElementById('downloadForm');
    if (downloadForm) {
        downloadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = downloadForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Prepare email template parameters
            const templateParams = {
                from_name: document.getElementById('download-name').value,
                from_email: document.getElementById('download-email').value,
                phone: document.getElementById('download-phone').value,
                business: document.getElementById('download-business').value,
                form_type: 'PDF Download Request',
                to_email: 'YOUR_EMAIL@example.com' // Replace with your email
            };

            // Send email using EmailJS
            emailjs.send('service_xktby6a', 'template_3115a6k', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    alert('Thank you! Your request has been received.\n\nYou will receive the PDF download link via email shortly.\n\nIf you don\'t see the email, please check your spam folder.');
                    
                    // Reset form
                    downloadForm.reset();
                    
                    // Reset button
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    
                    // Optionally hide the form after successful submission
                    // downloadFormSection.style.display = 'none';
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    alert('Sorry, there was an error processing your request. Please try again or contact us directly.');
                    
                    // Reset button
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }

    // Contact form handler with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Prepare email template parameters
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                business: document.getElementById('business').value,
                interest: document.getElementById('interest').value,
                to_email: 'YOUR_EMAIL@example.com' // Replace with your email
            };

            // Send email using EmailJS
            emailjs.send('service_xktby6a', 'template_3115a6k', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    alert('Thank you for your interest! We\'ll get back to you within 24 hours to discuss your automation needs.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    alert('Sorry, there was an error submitting your request. Please try again or contact us directly.');
                    
                    // Reset button
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }

    // Add animation on scroll
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

    // Observe all feature cards and sections
    document.querySelectorAll('.feature-card, .section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add click tracking (optional - for analytics)
    document.querySelectorAll('.cta-button, .feature-card').forEach(element => {
        element.addEventListener('click', function() {
            // You can add analytics tracking here
            // Example: gtag('event', 'click', { 'event_category': 'CTA', 'event_label': 'Download Button' });
        });
    });
});

// Add a simple scroll-to-top button (optional enhancement)
function createScrollToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });
    
    document.body.appendChild(button);
}

// Initialize scroll-to-top button
createScrollToTop();

