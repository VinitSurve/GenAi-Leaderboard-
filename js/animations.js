/* ===================================
   Animations Module
   Handles particle background, counter animations,
   progress bars, and scroll effects
   =================================== */

// Particle Animation System
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853'];
        
        this.init();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        this.setCanvasSize();
        this.createParticles();
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        // Draw connections
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(66, 133, 244, ${1 - distance / 150})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    handleResize() {
        this.setCanvasSize();
        this.createParticles();
    }
}

// Counter Animation
class CounterAnimation {
    /**
     * Animate number counting up
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     * @param {boolean} isPercentage - Add % sign
     */
    static animate(element, target, duration = 2000, isPercentage = false) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString();
            
            if (isPercentage && element.querySelector('.percent-sign')) {
                // Keep the % sign
                const percentSign = element.querySelector('.percent-sign');
                element.textContent = Math.floor(current).toLocaleString();
                element.appendChild(percentSign);
            }
        }, 16);
    }

    /**
     * Initialize all counter animations
     * @param {Object} stats - Statistics object
     */
    static initCounters(stats) {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach((element, index) => {
            const target = element.getAttribute('data-target');
            
            if (target && !isNaN(target)) {
                const isPercentage = index === 2; // Average completion
                this.animate(element, parseInt(target), 2000, isPercentage);
            }
        });
    }

    /**
     * Update stat card values
     * @param {Object} stats - Statistics object
     */
    static updateStats(stats) {
        const statValues = document.querySelectorAll('.stat-value');
        
        // Total Participants
        if (statValues[0]) {
            statValues[0].setAttribute('data-target', stats.totalParticipants);
            this.animate(statValues[0], stats.totalParticipants);
        }
        
        // Total Badges
        if (statValues[1]) {
            statValues[1].setAttribute('data-target', stats.totalBadges);
            this.animate(statValues[1], stats.totalBadges);
        }
        
        // Average Completion
        if (statValues[2]) {
            statValues[2].setAttribute('data-target', stats.averageCompletion);
            this.animate(statValues[2], stats.averageCompletion, 2000, true);
        }
        
        // Top Performer
        if (statValues[3]) {
            statValues[3].textContent = stats.topPerformer;
        }
        
        // Tier 1 Count - Circular Progress
        if (stats.tier1Count !== undefined) {
            this.updateTier1Progress(stats.tier1Count, stats.totalParticipants);
        }
        
        // Active Participants (5th card)
        const activeParticipantsEl = document.getElementById('activeParticipants');
        if (activeParticipantsEl && stats.activeParticipants !== undefined) {
            activeParticipantsEl.setAttribute('data-target', stats.activeParticipants);
            this.animate(activeParticipantsEl, stats.activeParticipants);
        }
        
        // Completion Rate (6th card)
        const completionRateEl = document.getElementById('completionRate');
        if (completionRateEl && stats.completionRate !== undefined) {
            completionRateEl.setAttribute('data-target', stats.completionRate);
            this.animate(completionRateEl, stats.completionRate, 2000, true);
        }
        
        // Average Time Per Badge (7th card)
        const avgTimeEl = document.getElementById('avgTimePerBadge');
        if (avgTimeEl && stats.avgTimePerBadge) {
            avgTimeEl.textContent = stats.avgTimePerBadge;
        }

        // Update participant count in header
        const participantCount = document.getElementById('participantCount');
        if (participantCount) {
            participantCount.textContent = stats.totalParticipants;
        }
    }
    
    /**
     * Update Tier 1 circular progress
     * @param {number} tier1Count - Number of Tier 1 achievers
     * @param {number} totalParticipants - Total participants
     */
    static updateTier1Progress(tier1Count, totalParticipants) {
        const tier1CountElement = document.getElementById('tier1Count');
        const tier1Circle = document.getElementById('tier1Circle');
        
        if (!tier1CountElement || !tier1Circle) return;
        
        // Display count in "X/100" format
        const targetCount = tier1Count;
        let current = 0;
        const increment = targetCount / (2000 / 16); // 2 seconds animation at 60fps
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= targetCount) {
                current = targetCount;
                clearInterval(timer);
            }
            
            // Update text with "X/100" format
            tier1CountElement.textContent = Math.floor(current) + '/100';
        }, 16);
        
        // Calculate percentage for circular progress (out of 100, not total participants)
        const percentage = (tier1Count / 100) * 100; // Direct percentage since we're showing out of 100
        
        // Circle circumference = 2 * PI * radius = 2 * 3.14159 * 52 = 326.73
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (percentage / 100) * circumference;
        
        // Animate the circular progress
        setTimeout(() => {
            tier1Circle.style.strokeDashoffset = offset;
        }, 100);
    }
}

// Progress Bar Animation
class ProgressBarAnimation {
    /**
     * Animate progress bar fill
     * @param {HTMLElement} progressBar - Progress bar element
     * @param {number} percentage - Target percentage
     */
    static animate(progressBar, percentage) {
        if (!progressBar) return;
        
        // Set width with animation
        setTimeout(() => {
            progressBar.style.width = percentage + '%';
        }, 100);
        
        // Set color based on percentage
        progressBar.classList.remove('low', 'medium', 'high');
        
        if (percentage < 30) {
            progressBar.classList.add('low');
        } else if (percentage < 70) {
            progressBar.classList.add('medium');
        } else {
            progressBar.classList.add('high');
        }
    }

    /**
     * Initialize all progress bars on page
     */
    static initAll() {
        const progressBars = document.querySelectorAll('.progress-bar-fill, .card-progress-fill');
        
        progressBars.forEach(bar => {
            const percentage = parseInt(bar.getAttribute('data-percentage')) || 0;
            this.animate(bar, percentage);
        });
    }
}

// Scroll Animations using Intersection Observer
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        // Create observer for fade-in animations
        this.fadeObserver = new IntersectionObserver(
            (entries) => this.handleFadeIntersect(entries),
            this.observerOptions
        );
        
        // Observe all elements with data-animate attribute
        const animateElements = document.querySelectorAll('[data-animate]');
        animateElements.forEach(el => this.fadeObserver.observe(el));
        
        // Observe progress bars
        this.progressObserver = new IntersectionObserver(
            (entries) => this.handleProgressIntersect(entries),
            this.observerOptions
        );
        
        const progressBars = document.querySelectorAll('.progress-bar-fill, .card-progress-fill');
        progressBars.forEach(bar => this.progressObserver.observe(bar));
    }

    handleFadeIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }

    handleProgressIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percentage = parseInt(entry.target.getAttribute('data-percentage')) || 0;
                ProgressBarAnimation.animate(entry.target, percentage);
                this.progressObserver.unobserve(entry.target);
            }
        });
    }

    /**
     * Reinitialize observers (call after DOM updates)
     */
    refresh() {
        // Disconnect existing observers
        if (this.fadeObserver) this.fadeObserver.disconnect();
        if (this.progressObserver) this.progressObserver.disconnect();
        
        // Reinitialize
        this.init();
    }
}

// Sticky Header Effect
class StickyHeader {
    constructor(headerId) {
        this.header = document.getElementById(headerId);
        if (!this.header) return;
        
        this.init();
    }

    init() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.header.classList.add('sticky');
            } else {
                this.header.classList.remove('sticky');
            }
            
            lastScroll = currentScroll;
        });
    }
}

// Rank Change Animation
class RankChangeAnimation {
    /**
     * Add rank change indicator
     * @param {HTMLElement} element - Rank cell element
     * @param {string} change - Change type (up, down, same, new)
     * @param {number} diff - Rank difference
     */
    static addIndicator(element, change, diff) {
        if (!element || change === 'same') return;
        
        const indicator = document.createElement('span');
        indicator.className = `rank-change ${change}`;
        
        if (change === 'up') {
            indicator.textContent = `↑${diff}`;
        } else if (change === 'down') {
            indicator.textContent = `↓${diff}`;
        } else if (change === 'new') {
            indicator.textContent = '🆕';
        }
        
        element.appendChild(indicator);
    }
}

// Pulse Animation for Update Indicators
class PulseAnimation {
    /**
     * Add pulse animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {number} duration - Duration in ms
     */
    static pulse(element, duration = 1000) {
        if (!element) return;
        
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

// Loading Spinner Animation
class LoadingAnimation {
    /**
     * Show loading spinner
     * @param {string} containerId - Container element ID
     */
    static show(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.style.display = 'flex';
    }

    /**
     * Hide loading spinner
     * @param {string} containerId - Container element ID
     */
    static hide(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.style.display = 'none';
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    if (document.getElementById('particleCanvas')) {
        new ParticleSystem('particleCanvas');
    }
    
    // Initialize sticky header
    new StickyHeader('header');
    
    // Initialize scroll animations
    window.scrollAnimations = new ScrollAnimations();
});

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        CounterAnimation,
        ProgressBarAnimation,
        ScrollAnimations,
        StickyHeader,
        RankChangeAnimation,
        PulseAnimation,
        LoadingAnimation
    };
}
