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

    // Booking form handler with EmailJS
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Prepare email template parameters
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                session_type: document.getElementById('session-type').value,
                preferred_date: document.getElementById('preferred-date').value,
                topic: document.getElementById('topic').value,
                to_email: 'YOUR_EMAIL@example.com' // Replace with your email
            };

            // Send email using EmailJS
            emailjs.send('service_xktby6a', 'template_3115a6k', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    alert('Thank you for requesting a ThinkGym session.\n\nWe\'ll confirm your session details via email within 24 hours.\n\nIf you have any urgent questions, please feel free to reach out directly.');
                    
                    // Reset form
                    bookingForm.reset();
                    
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