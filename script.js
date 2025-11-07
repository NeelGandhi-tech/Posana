document.addEventListener('DOMContentLoaded', function() {
    const emailPopup = document.getElementById('emailPopup');
    const popupClose = document.getElementById('popupClose');
    const popupOverlay = document.getElementById('popupOverlay');
    const emailForm = document.getElementById('emailForm');
    
    const popupShown = sessionStorage.getItem('popupShown');
    
    if (!popupShown && emailPopup) {
        setTimeout(() => {
            emailPopup.classList.add('active');
        }, 3000);
    }
    
    function closePopup() {
        if (emailPopup) {
            emailPopup.classList.remove('active');
            sessionStorage.setItem('popupShown', 'true');
        }
    }
    
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            console.log('Email submitted:', email);
            
            showNotification('🎉 Welcome to the Posana community! Check your email for 15% off!');
            closePopup();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emailPopup && emailPopup.classList.contains('active')) {
            closePopup();
        }
    });
});

const nav = document.getElementById('mainNav');
let lastScroll = 0;

if (nav) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Cart Management - Shopify Integration
// Load Shopify cart helper
let shopifyCartLoaded = false;

// Update cart badge count from Shopify
async function updateCartBadge() {
    // If shopify-config.js is loaded, use Shopify cart
    if (typeof ShopifyCart !== 'undefined') {
        try {
            const itemCount = await ShopifyCart.getItemCount();
            const cartButtons = document.querySelectorAll('.btn-order');
            
            cartButtons.forEach(button => {
                // Remove existing badge if any
                const existingBadge = button.querySelector('.cart-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // Add badge if cart has items
                if (itemCount > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    badge.textContent = itemCount;
                    button.appendChild(badge);
                }
            });
        } catch (error) {
            console.error('Error updating cart badge:', error);
        }
    } else {
        // Fallback: check if shopify-config.js script exists
        if (!shopifyCartLoaded) {
            const script = document.createElement('script');
            script.src = 'shopify-config.js';
            script.onload = () => {
                shopifyCartLoaded = true;
                updateCartBadge();
            };
            document.head.appendChild(script);
        }
    }
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();

    const cartButtons = document.querySelectorAll('.btn-add-cart');

    if (cartButtons.length === 0) {
        console.log('No cart buttons found on this page');
        return;
    }

    cartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            
            if (this.disabled) return;
            
            // Get product name from parent card and normalize it
            const card = this.closest('.menu-card');
            if (!card) {
                console.error('Could not find menu card parent');
                return;
            }
            
            const productTitle = card.querySelector('h3');
            if (!productTitle) {
                console.error('Could not find product title');
                return;
            }
            
            const productText = productTitle.innerText || productTitle.textContent;
            const productName = productText.replace(/\s+/g, ' ').trim();
            
            // Determine product ID based on content
            let productId = 'cinnavanilla'; // default
            if (productName.toLowerCase().includes('matcha')) {
                productId = 'matcha';
            } else if (productName.toLowerCase().includes('mango')) {
                productId = 'mango';
            } else if (productName.toLowerCase().includes('cinnavanilla')) {
                productId = 'cinnavanilla';
            }
            
            // Add to Shopify cart
            if (typeof ShopifyCart !== 'undefined' && typeof getVariantId !== 'undefined') {
                const variantId = getVariantId(productId);
                
                if (!variantId) {
                    console.error('Variant ID not found for product:', productId);
                    alert('Product not configured. Please add variant IDs in shopify-config.js');
                    return;
                }
                
                // Disable button and show loading
                this.disabled = true;
                const originalText = this.textContent;
                this.textContent = 'Adding...';
                
                try {
                    const result = await ShopifyCart.addItem(variantId, 1);
                    
                    if (result.success) {
                        this.textContent = '✓ Added';
                        this.style.background = '#8B9D83';
                        
                        // Update cart badge
                        updateCartBadge();
                        
                        showNotification('🛒 Item added to cart!');
                        
                        // Redirect to Shopify cart after delay
                        setTimeout(() => {
                            ShopifyCart.redirectToCart();
                        }, 1000);
                    } else {
                        throw new Error(result.error || 'Failed to add to cart');
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Failed to add item to cart: ' + error.message);
                    this.textContent = originalText;
                    this.disabled = false;
                }
            } else {
                // Fallback: redirect directly to product page or use Shopify Buy Button
                console.warn('Shopify cart not configured. Redirecting to store...');
                // You can redirect to the product page on your Shopify store
                window.location.href = `https://eatposana.com/products/${productId}`;
            }
        });
    });
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #8B9D83;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate menu cards
document.querySelectorAll('.menu-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Animate instagram cards
document.querySelectorAll('.insta-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Animate testimonial cards
document.querySelectorAll('.testimonial-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
    observer.observe(card);
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.3;
    }
});

// Floating Elements removed

// Instagram Video Play on Hover
document.querySelectorAll('.insta-video').forEach(video => {
    video.addEventListener('mouseenter', function() {
        const playIcon = this.querySelector('.play-icon');
        if (playIcon) {
            playIcon.style.transform = 'scale(1.2)';
            playIcon.style.transition = 'transform 0.3s ease';
        }
    });
    
    video.addEventListener('mouseleave', function() {
        const playIcon = this.querySelector('.play-icon');
        if (playIcon) {
            playIcon.style.transform = 'scale(1)';
        }
    });
});

// Form Validation Enhancement
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = '#D4725C';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
});

// Button Magnetic Effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Performance: Debounce Scroll Events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Video interaction enhancements
document.addEventListener('DOMContentLoaded', function() {
    const videoStories = document.querySelectorAll('.video-story');
    
    videoStories.forEach(story => {
        const video = story.querySelector('video');
        const playBtn = story.querySelector('.video-play-btn');
        
        if (video && playBtn) {
            // Show play button on hover
            story.addEventListener('mouseenter', function() {
                playBtn.style.opacity = '1';
            });
            
            story.addEventListener('mouseleave', function() {
                if (video.paused) {
                    playBtn.style.opacity = '0';
                }
            });
            
            // Hide play button when video starts
            video.addEventListener('play', function() {
                playBtn.style.opacity = '0';
            });
            
            // Show play button when video pauses
            video.addEventListener('pause', function() {
                playBtn.style.opacity = '1';
            });
            
            // Click play button to play video
            playBtn.addEventListener('click', function(e) {
                e.preventDefault();
                video.play();
            });
        }
    });
});

console.log('%c🌱 Welcome to Posana! ', 'background: #8B9D83; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%cLove what we\'re building? careers@posana.co', 'color: #D4725C; font-size: 14px;');

// Analytics Event Tracking (placeholder)
function trackEvent(category, action, label) {
    // Replace with your analytics platform
    console.log('Event:', category, action, label);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-order').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('CTA', 'click', this.textContent);
    });
});

// Track social link clicks
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Social', 'click', this.textContent);
    });
});

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Product Video Hover Logic
document.addEventListener('DOMContentLoaded', function() {
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        const video = card.querySelector('.product-video');
        const image = card.querySelector('.product-image');
        
        if (video && image) {
            card.addEventListener('mouseenter', function() {
                video.style.display = 'block';
                video.style.opacity = '1';
                image.style.opacity = '0';
                
                // Play video
                video.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            });
            
            card.addEventListener('mouseleave', function() {
                video.style.opacity = '0';
                image.style.opacity = '1';
                
                // Pause video
                video.pause();
                video.currentTime = 0;
                
                setTimeout(() => {
                    video.style.display = 'none';
                }, 300);
            });
        }
    });
});

// Influencer Video Logic
document.addEventListener('DOMContentLoaded', function() {
    const influencerCards = document.querySelectorAll('.influencer-card');
    
    influencerCards.forEach(card => {
        const video = card.querySelector('.tiktok-video');
        const playIcon = card.querySelector('.play-icon');
        
        if (video && playIcon) {
            // Auto-play videos on load
            try {
                video.muted = true;
                video.playsInline = true;
                video.play().catch(() => {
                    // If autoplay is blocked, keep poster visible
                });
            } catch (e) {}
            
            // Click to play/pause
            card.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    playIcon.style.opacity = '0';
                } else {
                    video.pause();
                    playIcon.style.opacity = '1';
                }
            });
            
            // Show/hide play icon on hover
            card.addEventListener('mouseenter', function() {
                if (video.paused) {
                    playIcon.style.opacity = '1';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!video.paused) {
                    playIcon.style.opacity = '0';
                }
            });
        }
    });
});

// Hero Video Logic
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-background-video');
    
    if (heroVideo) {
        try {
            heroVideo.muted = true;
            heroVideo.playsInline = true;
            heroVideo.play().catch(() => {
                // If autoplay is blocked, that's okay for hero video
            });
        } catch (e) {}
    }
});

// Background Video Logic
document.addEventListener('DOMContentLoaded', function() {
    const backgroundVideo = document.querySelector('.background-video');
    
    if (backgroundVideo) {
        try {
            backgroundVideo.muted = true;
            backgroundVideo.playsInline = true;
            backgroundVideo.play().catch(() => {
                // If autoplay is blocked, that's okay for background video
            });
        } catch (e) {}
    }
});

// Falling elephants removed per design update

// Accessibility: Focus Management
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
    body:not(.keyboard-nav) *:focus {
        outline: none;
    }
    
    body.keyboard-nav *:focus {
        outline: 3px solid #D4725C;
        outline-offset: 2px;
    }
`;
document.head.appendChild(accessibilityStyles);
