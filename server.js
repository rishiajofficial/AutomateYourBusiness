const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Initialize database
const db = new Database('analytics.db');

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        page TEXT NOT NULL,
        page_title TEXT,
        referrer TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_term TEXT,
        utm_content TEXT,
        user_agent TEXT,
        platform TEXT,
        language TEXT,
        screen_width INTEGER,
        screen_height INTEGER,
        viewport_width INTEGER,
        viewport_height INTEGER,
        session_id TEXT,
        time_on_page INTEGER,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        start_time TEXT NOT NULL,
        start_date TEXT NOT NULL,
        start_time_only TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date);
    CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
    CREATE INDEX IF NOT EXISTS idx_page_views_referrer ON page_views(referrer);
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(start_date);
`);

// Helper function to get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           'unknown';
}

// API: Track page view
app.post('/api/analytics/track', (req, res) => {
    try {
        const {
            timestamp,
            date,
            time,
            page,
            pageTitle,
            referrer,
            utm,
            device,
            sessionId,
            timeOnPage
        } = req.body;

        const ip = getClientIP(req);

        const stmt = db.prepare(`
            INSERT INTO page_views (
                timestamp, date, time, page, page_title, referrer,
                utm_source, utm_medium, utm_campaign, utm_term, utm_content,
                user_agent, platform, language,
                screen_width, screen_height, viewport_width, viewport_height,
                session_id, time_on_page, ip_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            timestamp,
            date,
            time,
            page,
            pageTitle,
            referrer,
            utm?.utm_source || null,
            utm?.utm_medium || null,
            utm?.utm_campaign || null,
            utm?.utm_term || null,
            utm?.utm_content || null,
            device?.userAgent || null,
            device?.platform || null,
            device?.language || null,
            device?.screenWidth || null,
            device?.screenHeight || null,
            device?.viewportWidth || null,
            device?.viewportHeight || null,
            sessionId,
            timeOnPage || null,
            ip
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking page view:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Track new session
app.post('/api/analytics/session', (req, res) => {
    try {
        const { sessionId, startTime, startDate, startTimeOnly } = req.body;
        const ip = getClientIP(req);
        const userAgent = req.headers['user-agent'];

        const stmt = db.prepare(`
            INSERT OR IGNORE INTO sessions (session_id, start_time, start_date, start_time_only, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        stmt.run(sessionId, startTime, startDate, startTimeOnly, ip, userAgent);

        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking session:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get analytics summary
app.get('/api/analytics/summary', (req, res) => {
    try {
        const totalViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get();
        const totalSessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get();
        const uniquePages = db.prepare('SELECT COUNT(DISTINCT page) as count FROM page_views').get();
        
        const topReferrer = db.prepare(`
            SELECT referrer, COUNT(*) as count 
            FROM page_views 
            WHERE referrer IS NOT NULL AND referrer != 'direct'
            GROUP BY referrer 
            ORDER BY count DESC 
            LIMIT 1
        `).get();

        res.json({
            totalViews: totalViews.count,
            totalSessions: totalSessions.count,
            uniquePages: uniquePages.count,
            topReferrer: topReferrer ? `${topReferrer.referrer} (${topReferrer.count})` : '-'
        });
    } catch (error) {
        console.error('Error getting summary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get page views over time
app.get('/api/analytics/views-over-time', (req, res) => {
    try {
        const { days = 30 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const stmt = db.prepare(`
            SELECT date, COUNT(*) as count
            FROM page_views
            WHERE date >= ?
            GROUP BY date
            ORDER BY date ASC
        `);

        const results = stmt.all(cutoffDate.toISOString().split('T')[0]);
        res.json(results);
    } catch (error) {
        console.error('Error getting views over time:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get traffic sources
app.get('/api/analytics/sources', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT referrer, COUNT(*) as count
            FROM page_views
            WHERE referrer IS NOT NULL
            GROUP BY referrer
            ORDER BY count DESC
            LIMIT 20
        `);

        const results = stmt.all();
        res.json(results);
    } catch (error) {
        console.error('Error getting sources:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get most visited pages
app.get('/api/analytics/pages', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT page, COUNT(*) as count
            FROM page_views
            GROUP BY page
            ORDER BY count DESC
            LIMIT 20
        `);

        const results = stmt.all();
        res.json(results);
    } catch (error) {
        console.error('Error getting pages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get recent page views
app.get('/api/analytics/recent', (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const stmt = db.prepare(`
            SELECT timestamp, page, referrer, utm_campaign
            FROM page_views
            ORDER BY timestamp DESC
            LIMIT ?
        `);

        const results = stmt.all(parseInt(limit));
        res.json(results);
    } catch (error) {
        console.error('Error getting recent views:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Get all analytics data (for export)
app.get('/api/analytics/export', (req, res) => {
    try {
        const pageViews = db.prepare('SELECT * FROM page_views ORDER BY timestamp DESC').all();
        const sessions = db.prepare('SELECT * FROM sessions ORDER BY start_time DESC').all();
        
        res.json({
            pageViews,
            sessions,
            exportedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Analytics server running on http://localhost:${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}/analytics-dashboard.html`);
});
