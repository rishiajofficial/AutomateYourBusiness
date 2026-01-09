// Analytics Tracking Script
(function() {
    'use strict';

    // Get or initialize analytics data
    function getAnalyticsData() {
        const data = localStorage.getItem('ac_co_analytics');
        return data ? JSON.parse(data) : {
            pageViews: [],
            sessions: [],
            lastVisit: null
        };
    }

    // Save analytics data
    function saveAnalyticsData(data) {
        localStorage.setItem('ac_co_analytics', JSON.stringify(data));
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

    // Track page view
    function trackPageView() {
        const analyticsData = getAnalyticsData();
        const now = new Date();
        const pagePath = window.location.pathname;
        const pageTitle = document.title;
        
        const pageView = {
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

        analyticsData.pageViews.push(pageView);
        
        // Keep only last 1000 page views to prevent localStorage from getting too large
        if (analyticsData.pageViews.length > 1000) {
            analyticsData.pageViews = analyticsData.pageViews.slice(-1000);
        }

        analyticsData.lastVisit = now.toISOString();
        saveAnalyticsData(analyticsData);
    }

    // Generate or retrieve session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('ac_co_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('ac_co_session_id', sessionId);
            
            // Track new session
            const analyticsData = getAnalyticsData();
            const now = new Date();
            analyticsData.sessions.push({
                sessionId: sessionId,
                startTime: now.toISOString(),
                startDate: now.toISOString().split('T')[0],
                startTimeOnly: now.toTimeString().split(' ')[0]
            });
            
            // Keep only last 500 sessions
            if (analyticsData.sessions.length > 500) {
                analyticsData.sessions = analyticsData.sessions.slice(-500);
            }
            
            saveAnalyticsData(analyticsData);
        }
        return sessionId;
    }

    // Track time on page (basic implementation)
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        const analyticsData = getAnalyticsData();
        if (analyticsData.pageViews.length > 0) {
            const lastView = analyticsData.pageViews[analyticsData.pageViews.length - 1];
            lastView.timeOnPage = timeOnPage;
            saveAnalyticsData(analyticsData);
        }
    });

    // Initialize tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
    } else {
        trackPageView();
    }
})();
