# Analytics Backend Setup

This project includes a backend analytics system that stores all visitor data in a centralized database.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `better-sqlite3` - SQLite database driver
- `nodemon` - Development server (optional, for auto-restart)

### 2. Start the Backend Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Access the Dashboard

1. Open your website (served on port 8000 or your web server)
2. Navigate to the Analytics Dashboard link in the footer
3. Login with credentials:
   - Username: `admin`
   - Password: `admin123`

## How It Works

### Data Storage

- **Database**: SQLite (`analytics.db`)
- **Location**: Stored in the project root directory
- **Tables**: 
  - `page_views` - All page view events
  - `sessions` - User session tracking

### API Endpoints

- `POST /api/analytics/track` - Track a page view
- `POST /api/analytics/session` - Track a new session
- `GET /api/analytics/summary` - Get summary statistics
- `GET /api/analytics/views-over-time` - Get page views over time
- `GET /api/analytics/sources` - Get traffic sources breakdown
- `GET /api/analytics/pages` - Get most visited pages
- `GET /api/analytics/recent` - Get recent page views
- `GET /api/analytics/export` - Export all data as JSON

### Configuration

#### For Local Development

The analytics script automatically detects `localhost` and uses `http://localhost:3000` as the API URL.

#### For Production

Update the `API_BASE_URL` in:
- `analytics.js` (line 6-8)
- `analytics-dashboard.js` (line 16-18)

Set it to your production API URL, for example:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com';
```

## Running Both Servers

You'll need to run two servers:

1. **Backend API Server** (port 3000):
   ```bash
   npm start
   ```

2. **Web Server** (port 8000):
   ```bash
   python3 -m http.server 8000
   ```

Or use any other web server to serve your static files.

## Database Management

The database file `analytics.db` is created automatically on first run.

To reset analytics data:
- Delete the `analytics.db` file
- Restart the server (it will create a new database)

## Security Notes

- The login system uses client-side session storage (basic protection)
- For production, consider:
  - Server-side authentication
  - HTTPS
  - Rate limiting on API endpoints
  - Input validation and sanitization

## Troubleshooting

### Dashboard shows "Unable to load analytics data"

- Make sure the backend server is running on port 3000
- Check browser console for CORS errors
- Verify the API_BASE_URL is correctly configured

### No data appearing

- Check that `analytics.js` is loaded on all pages
- Verify the backend server is receiving requests (check server logs)
- Ensure the database file `analytics.db` exists and is writable
