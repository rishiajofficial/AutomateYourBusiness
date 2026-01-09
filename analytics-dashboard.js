// Analytics Dashboard Script
(function() {
    'use strict';

    let analyticsData = {
        summary: null,
        viewsOverTime: [],
        sources: [],
        pages: [],
        recent: []
    };
    let viewsChart = null;
    let sourcesChart = null;

    // API endpoint configuration
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : ''; // Set to your production API URL

    // Fetch data from API
    async function fetchAnalyticsData() {
        try {
            if (!API_BASE_URL) {
                throw new Error('API URL not configured');
            }

            const [summary, viewsOverTime, sources, pages, recent] = await Promise.all([
                fetch(`${API_BASE_URL}/api/analytics/summary`).then(r => r.json()),
                fetch(`${API_BASE_URL}/api/analytics/views-over-time?days=30`).then(r => r.json()),
                fetch(`${API_BASE_URL}/api/analytics/sources`).then(r => r.json()),
                fetch(`${API_BASE_URL}/api/analytics/pages?limit=10`).then(r => r.json()),
                fetch(`${API_BASE_URL}/api/analytics/recent?limit=20`).then(r => r.json())
            ]);

            analyticsData = {
                summary,
                viewsOverTime,
                sources,
                pages,
                recent
            };

            return true;
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            return false;
        }
    }

    // Initialize dashboard
    async function initDashboard() {
        const success = await fetchAnalyticsData();
        
        if (!success || !analyticsData.summary) {
            showEmptyState('Unable to load analytics data. Make sure the backend server is running.');
            return;
        }

        if (analyticsData.summary.totalViews === 0) {
            showEmptyState();
            return;
        }

        updateSummaryCards();
        updateCharts();
        updateTables();
        setupEventListeners();
    }

    // Show empty state
    function showEmptyState(message) {
        const content = document.querySelector('.dashboard-content');
        const defaultMessage = 'Start browsing your site to collect analytics data.';
        content.innerHTML = `
            <div class="empty-state">
                <h2>No Analytics Data Yet</h2>
                <p>${message || defaultMessage}</p>
                <a href="index.html" class="btn-link" style="margin-top: 1rem; display: inline-block;">Go to Site</a>
            </div>
        `;
    }

    // Update summary cards
    function updateSummaryCards() {
        const summary = analyticsData.summary;
        
        document.getElementById('totalViews').textContent = summary.totalViews.toLocaleString();
        document.getElementById('totalSessions').textContent = summary.totalSessions.toLocaleString();
        document.getElementById('uniquePages').textContent = summary.uniquePages;
        document.getElementById('topReferrer').textContent = summary.topReferrer;
    }

    // Update charts
    function updateCharts() {
        updateViewsChart();
        updateSourcesChart();
    }

    // Update page views over time chart
    function updateViewsChart() {
        const viewsOverTime = analyticsData.viewsOverTime;
        
        const dates = viewsOverTime.map(item => item.date);
        const counts = viewsOverTime.map(item => item.count);
        
        const ctx = document.getElementById('viewsChart').getContext('2d');
        
        if (viewsChart) {
            viewsChart.destroy();
        }
        
        viewsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Page Views',
                    data: counts,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Update traffic sources chart
    function updateSourcesChart() {
        const sources = analyticsData.sources.slice(0, 10);
        
        const labels = sources.map(item => item.referrer);
        const data = sources.map(item => item.count);
        
        const ctx = document.getElementById('sourcesChart').getContext('2d');
        
        if (sourcesChart) {
            sourcesChart.destroy();
        }
        
        sourcesChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#ec4899',
                        '#06b6d4',
                        '#84cc16',
                        '#f97316',
                        '#6366f1'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Update tables
    function updateTables() {
        updatePagesTable();
        updateSourcesTable();
        updateRecentTable();
    }

    // Update most visited pages table
    function updatePagesTable() {
        const pages = analyticsData.pages;
        const total = analyticsData.summary.totalViews;
        
        const tbody = document.querySelector('#pagesTable tbody');
        tbody.innerHTML = pages.map(item => {
            const percentage = ((item.count / total) * 100).toFixed(1);
            return `
                <tr>
                    <td>${item.page || '/'}</td>
                    <td>${item.count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');
    }

    // Update traffic sources table
    function updateSourcesTable() {
        const sources = analyticsData.sources.slice(0, 10);
        const total = analyticsData.summary.totalViews;
        
        const tbody = document.querySelector('#sourcesTable tbody');
        tbody.innerHTML = sources.map(item => {
            const percentage = ((item.count / total) * 100).toFixed(1);
            return `
                <tr>
                    <td>${item.referrer}</td>
                    <td>${item.count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');
    }

    // Update recent activity table
    function updateRecentTable() {
        const recent = analyticsData.recent;
        
        const tbody = document.querySelector('#recentTable tbody');
        tbody.innerHTML = recent.map(item => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleString();
            const page = item.page || '/';
            const referrer = item.referrer || 'direct';
            const campaign = item.utm_campaign || '-';
            
            return `
                <tr>
                    <td>${timeStr}</td>
                    <td>${page}</td>
                    <td>${referrer}</td>
                    <td>${campaign}</td>
                </tr>
            `;
        }).join('');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Export data
        document.getElementById('exportBtn').addEventListener('click', async function() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/analytics/export`);
                const data = await response.json();
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
            } catch (error) {
                alert('Failed to export data. Please try again.');
                console.error('Export error:', error);
            }
        });

        // Clear data
        document.getElementById('clearBtn').addEventListener('click', async function() {
            if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
                try {
                    // Note: You'll need to add a DELETE endpoint to the backend if you want this functionality
                    // For now, this is a placeholder
                    alert('Clear data functionality requires a backend endpoint. Please delete the analytics.db file manually.');
                } catch (error) {
                    console.error('Error clearing data:', error);
                    alert('Error clearing data. Please check the console.');
                }
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            sessionStorage.removeItem('analytics_authenticated');
            window.location.href = 'login.html';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();
