// Analytics Tracking Script
(function() {
    'use strict';

    // API endpoint configuration
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : ''; // Set to your production API URL

    // Send data to backend API
    function sendToAPI(endpoint, data) {
        if (!API_BASE_URL) {
            console.warn('Analytics API URL not configured');
            return;
        }

        fetch(`${API_BASE_URL}/api/analytics/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            keepalive: true // Ensures request completes even if page is closing
        }).catch(error => {
            console.error('Analytics API error:', error);
        });
    }

    // Get referrer information
    function getReferrer() {
        const referrer = document.referrer;
        if (!referrer) return 'direct';
        
        try {
            const referrerUrl = new URL(referrer);
            const hostname = referrerUrl.hostname;
            
            // Check if it's an internal referrer
            if (hostname === window.location.hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'internal';
            }
            
            // Check for common search engines
            if (hostname.includes('google')) return 'google';
            if (hostname.includes('bing')) return 'bing';
            if (hostname.includes('yahoo')) return 'yahoo';
            if (hostname.includes('duckduckgo')) return 'duckduckgo';
            
            // Social media
            if (hostname.includes('facebook')) return 'facebook';
            if (hostname.includes('twitter') || hostname.includes('x.com')) return 'twitter';
            if (hostname.includes('linkedin')) return 'linkedin';
            if (hostname.includes('instagram')) return 'instagram';
            
            // Return domain name
            return hostname.replace('www.', '');
        } catch (e) {
            return 'unknown';
        }
    }

    // Get UTM parameters
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source') || null,
            utm_medium: params.get('utm_medium') || null,
            utm_campaign: params.get('utm_campaign') || null,
            utm_term: params.get('utm_term') || null,
            utm_content: params.get('utm_content') || null
        };
    }

    // Get device and browser info
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }

    // Track time on page
    let startTime = Date.now();
    let lastPageView = null;

    // Track page view
    function trackPageView() {
        const now = new Date();
        const pagePath = window.location.pathname;
        const pageTitle = document.title;
        
        lastPageView = {
            timestamp: now.toISOString(),
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
            page: pagePath,
            pageTitle: pageTitle,
            referrer: getReferrer(),
            utm: getUTMParams(),
            device: getDeviceInfo(),
            sessionId: getSessionId()
        };

        // Send to backend API
        sendToAPI('track', lastPageView);
        startTime = Date.now(); // Reset timer for this page
    }

    // Track time on page when leaving
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (lastPageView && timeOnPage > 0) {
            // Send update with time on page
            sendToAPI('track', { ...lastPageView, timeOnPage });
        }
    });

    // Generate or retrieve session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('ac_co_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('ac_co_session_id', sessionId);
            
            // Track new session
            const now = new Date();
            const sessionData = {
                sessionId: sessionId,
                startTime: now.toISOString(),
                startDate: now.toISOString().split('T')[0],
                startTimeOnly: now.toTimeString().split(' ')[0]
            };
            
            // Send to backend API
            sendToAPI('session', sessionData);
        }
        return sessionId;
    }

    // Initialize tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
    } else {
        trackPageView();
    }
})();
