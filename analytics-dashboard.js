// Analytics Dashboard Script
(function() {
    'use strict';

    let analyticsData = null;
    let viewsChart = null;
    let sourcesChart = null;

    // Get analytics data from localStorage
    function getAnalyticsData() {
        const data = localStorage.getItem('ac_co_analytics');
        return data ? JSON.parse(data) : { pageViews: [], sessions: [] };
    }

    // Initialize dashboard
    function initDashboard() {
        analyticsData = getAnalyticsData();
        
        if (analyticsData.pageViews.length === 0) {
            showEmptyState();
            return;
        }

        updateSummaryCards();
        updateCharts();
        updateTables();
        setupEventListeners();
    }

    // Show empty state
    function showEmptyState() {
        const content = document.querySelector('.dashboard-content');
        content.innerHTML = `
            <div class="empty-state">
                <h2>No Analytics Data Yet</h2>
                <p>Start browsing your site to collect analytics data.</p>
                <a href="index.html" class="btn-link" style="margin-top: 1rem; display: inline-block;">Go to Site</a>
            </div>
        `;
    }

    // Update summary cards
    function updateSummaryCards() {
        const pageViews = analyticsData.pageViews;
        const sessions = analyticsData.sessions;
        
        // Total page views
        document.getElementById('totalViews').textContent = pageViews.length.toLocaleString();
        
        // Total sessions
        document.getElementById('totalSessions').textContent = sessions.length.toLocaleString();
        
        // Unique pages
        const uniquePages = new Set(pageViews.map(pv => pv.page));
        document.getElementById('uniquePages').textContent = uniquePages.size;
        
        // Top referrer
        const referrerCounts = {};
        pageViews.forEach(pv => {
            referrerCounts[pv.referrer] = (referrerCounts[pv.referrer] || 0) + 1;
        });
        const topReferrer = Object.entries(referrerCounts)
            .sort((a, b) => b[1] - a[1])[0];
        document.getElementById('topReferrer').textContent = topReferrer 
            ? `${topReferrer[0]} (${topReferrer[1]})` 
            : '-';
    }

    // Update charts
    function updateCharts() {
        updateViewsChart();
        updateSourcesChart();
    }

    // Update page views over time chart
    function updateViewsChart() {
        const pageViews = analyticsData.pageViews;
        
        // Group by date
        const dateCounts = {};
        pageViews.forEach(pv => {
            const date = pv.date;
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });
        
        const dates = Object.keys(dateCounts).sort();
        const counts = dates.map(date => dateCounts[date]);
        
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
        const pageViews = analyticsData.pageViews;
        
        // Count referrers
        const referrerCounts = {};
        pageViews.forEach(pv => {
            const ref = pv.referrer || 'direct';
            referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
        });
        
        const sorted = Object.entries(referrerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const labels = sorted.map(item => item[0]);
        const data = sorted.map(item => item[1]);
        
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
        const pageViews = analyticsData.pageViews;
        
        // Count page views
        const pageCounts = {};
        pageViews.forEach(pv => {
            const page = pv.page || '/';
            pageCounts[page] = (pageCounts[page] || 0) + 1;
        });
        
        const sorted = Object.entries(pageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const total = pageViews.length;
        const tbody = document.querySelector('#pagesTable tbody');
        tbody.innerHTML = sorted.map(([page, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                <tr>
                    <td>${page || '/'}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');
    }

    // Update traffic sources table
    function updateSourcesTable() {
        const pageViews = analyticsData.pageViews;
        
        // Count referrers
        const referrerCounts = {};
        pageViews.forEach(pv => {
            const ref = pv.referrer || 'direct';
            referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
        });
        
        const sorted = Object.entries(referrerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        const total = pageViews.length;
        const tbody = document.querySelector('#sourcesTable tbody');
        tbody.innerHTML = sorted.map(([source, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                <tr>
                    <td>${source}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');
    }

    // Update recent activity table
    function updateRecentTable() {
        const pageViews = analyticsData.pageViews;
        
        // Get last 20 page views
        const recent = pageViews.slice(-20).reverse();
        
        const tbody = document.querySelector('#recentTable tbody');
        tbody.innerHTML = recent.map(pv => {
            const date = new Date(pv.timestamp);
            const timeStr = date.toLocaleString();
            const page = pv.page || '/';
            const referrer = pv.referrer || 'direct';
            const campaign = pv.utm?.utm_campaign || '-';
            
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
        document.getElementById('exportBtn').addEventListener('click', function() {
            const dataStr = JSON.stringify(analyticsData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        });

        // Clear data
        document.getElementById('clearBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
                localStorage.removeItem('ac_co_analytics');
                location.reload();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();
