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

    // Booking form handler
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                sessionType: document.getElementById('session-type').value,
                preferredDate: document.getElementById('preferred-date').value,
                topic: document.getElementById('topic').value
            };

            // Show success message
            alert('Thank you for requesting a ThinkGym session.\n\nWe\'ll confirm your session details via email within 24 hours.\n\nIf you have any urgent questions, please feel free to reach out directly.');
            
            // Reset form
            bookingForm.reset();
            
            // Optional: Send to your backend/email service
            // fetch('/api/booking', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
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