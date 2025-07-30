// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(number => {
                const target = number.textContent;
                const isPercentage = target.includes('%');
                const isK = target.includes('K');
                const isM = target.includes('M');
                
                let finalValue = parseInt(target.replace(/[^\d]/g, ''));
                if (isK) finalValue *= 1000;
                if (isM) finalValue *= 1000000;
                
                animateNumber(number, 0, finalValue, 2000, isPercentage, isK, isM);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

function animateNumber(element, start, end, duration, isPercentage, isK, isM) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        let displayValue = current;
        
        if (isM) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (isK) {
            displayValue = (current / 1000) + 'K';
        } else if (isPercentage) {
            displayValue = current + '%';
        }
        
        if (current === 999) displayValue = '99.9%'; // Special case for uptime
        
        element.textContent = displayValue + (element.textContent.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Video Modal Functionality
const modal = document.getElementById('videoModal');
const demoVideo = document.getElementById('demoVideo');
const closeBtn = document.querySelector('.close');
const watchDemoBtn = document.querySelector('a[href="#demo"]');

// Open modal when "Watch Demo" is clicked
document.querySelectorAll('a[href="#demo"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close modal when X is clicked
closeBtn.addEventListener('click', function() {
    closeModal();
});

// Close modal when clicking outside the video
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('show');
    demoVideo.pause(); // Pause video when modal closes
    demoVideo.currentTime = 0; // Reset video to beginning
    document.body.style.overflow = 'auto'; // Restore scrolling
}