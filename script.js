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

    // Download button handler
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Replace this URL with your actual PDF download link
            // For now, it will show an alert - you can update this to your Gumroad/Stripe checkout
            const pdfUrl = '#'; // Replace with your actual PDF URL or checkout link
            
            if (pdfUrl && pdfUrl !== '#') {
                window.open(pdfUrl, '_blank');
            } else {
                // Placeholder - replace with your actual checkout flow
                alert('Download link will be configured here. Replace this with your Gumroad/Stripe checkout URL.');
                
                // Example: Redirect to checkout
                // window.location.href = 'https://your-gumroad-link.com/automate-your-business';
            }
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

