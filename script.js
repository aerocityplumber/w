document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    var navCta = document.querySelector('.nav-cta');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navCta.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                navLinks.classList.remove('active');
                navCta.classList.remove('active');
            }
        });
    });
    
    // Google Apps Script Web App URL
    var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIWXVZXuuRV4jaZpFlbYUq0vZlff34QPOiEwdcaEh-ERuZmJV_IZ3rLWVCJd73IOGJ/exec';

    // Generate or get session ID
    function getSessionId() {
        var sessionId = sessionStorage.getItem('visitorSessionId');
        if (!sessionId) {
            sessionId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('visitorSessionId', sessionId);
        }
        return sessionId;
    }

    // Track visitor
    function trackVisitor() {
        if (!APPS_SCRIPT_URL) return;
        
        var data = new URLSearchParams();
        data.append('action', 'visitor');
        data.append('pageUrl', window.location.href);
        data.append('referrer', document.referrer || 'Direct');
        data.append('userAgent', navigator.userAgent);
        data.append('screenSize', window.screen.width + 'x' + window.screen.height);
        data.append('sessionId', getSessionId());
        data.append('t', Date.now());
        
        fetch(APPS_SCRIPT_URL + '?nocache=' + Date.now(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            body: data.toString(),
            mode: 'no-cors'
        }).catch(function(e) { console.log('Visitor tracked'); });
    }

    // Track visitor on page load
    trackVisitor();

    // Contact form
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            var name = document.getElementById('name').value;
            var phone = document.getElementById('phone').value;
            var service = document.getElementById('service').value;
            var message = document.getElementById('message').value;
            var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            
            // Send data to Google Sheets
            var data = new URLSearchParams();
            data.append('action', 'contact');
            data.append('name', name);
            data.append('phone', phone);
            data.append('service', service || 'General');
            data.append('message', message);
            data.append('timestamp', timestamp);
            
            fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data.toString(),
                mode: 'no-cors'
            });
            
            alert('Thank you ' + name + '! Your details have been saved. We\'ll contact you at ' + phone + ' shortly.');
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            contactForm.reset();
        });
    }
    
    // Smooth scroll for services page
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});