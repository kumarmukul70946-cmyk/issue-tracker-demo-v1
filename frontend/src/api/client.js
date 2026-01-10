import axios from 'axios';
import { mockIssues, mockStats, mockAssignees, mockLabels } from './mock';

// Detect if we are in "Demo Mode" (GitHub Pages default)
const isDemoMode = import.meta.env.PROD && !import.meta.env.VITE_API_URL;
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

// Mock Adapter Interceptor for Demo Mode
if (isDemoMode) {
    console.log("Running in DEMO MODE with Mock Data");
    api.interceptors.request.use(config => {
        return Promise.reject({
            config,
            response: { status: 200, data: getMockData(config.url) }
        });
    });
}

// Helper to return mock data based on URL
function getMockData(url) {
    if (url.includes('/issues/') && url.includes('/timeline')) return []; // Timeline mock
    if (url.includes('/issues/')) {
        // Detail mock (return first issue)
        const id = url.split('/issues/')[1];
        if (id && !id.includes('/')) return { ...mockIssues[0], id: id };
        return mockIssues; // List
    }
    if (url.includes('/reports/latency')) return { average_resolution_time: mockStats.average_resolution_time };
    if (url.includes('/reports/top-assignees')) return mockAssignees;
    if (url.includes('/labels/')) return mockLabels;
    return {};
}

// Also intercept errors to fallback to mock if backend is down in dev
api.interceptors.response.use(
    response => response,
    error => {
        // If we are in demo mode, we returned a rejected promise with data above to bypass network
        if (error.response && error.response.data) {
            return Promise.resolve(error.response);
        }
        return Promise.reject(error);
    }
);

export default api;
