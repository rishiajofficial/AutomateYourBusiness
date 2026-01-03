// Initialize EmailJS
(function() {
    emailjs.init("pNhQJVEpwaz1Ban6h");
})();

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

    // Membership form handler with EmailJS
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = membershipForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Prepare email template parameters
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                role: document.getElementById('role').value,
                experience: document.getElementById('experience').value,
                situation: document.getElementById('situation').value || 'Not provided',
                expectations: document.getElementById('expectations').value || 'Not provided',
                form_type: 'ClearPath Membership Inquiry',
                to_email: 'YOUR_EMAIL@example.com' // Replace with your email
            };

            // Send email using EmailJS
            emailjs.send('service_xktby6a', 'template_3115a6k', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    alert('Thank you for your interest in ClearPath.\n\nWe\'ll review your information and get back to you within 48 hours to discuss fit and next steps.\n\nWe appreciate your patience as we take time to ensure the right conversations.');
                    
                    // Reset form
                    membershipForm.reset();
                    
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

    // Quick start form handler
    const quickStartForm = document.getElementById('quickStartForm');
    if (quickStartForm) {
        quickStartForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = quickStartForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            const templateParams = {
                from_name: document.getElementById('quick-name').value,
                from_email: document.getElementById('quick-email').value,
                form_type: 'ClearPath Quick Start',
                to_email: 'YOUR_EMAIL@example.com'
            };

            emailjs.send('service_xktby6a', 'template_3115a6k', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Thank you! We\'ll reach out within 48 hours to discuss next steps.');
                    quickStartForm.reset();
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Sorry, there was an error. Please try again or use the full form below.');
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }

    // Sticky header shadow on scroll
    const stickyHeader = document.querySelector('.sticky-header');
    if (stickyHeader) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                stickyHeader.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            } else {
                stickyHeader.style.boxShadow = 'none';
            }
        });
    }
});

