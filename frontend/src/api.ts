import axios from 'axios';
import type { MetricsResponse, Recommendation } from './types';

// In a real scenario, this matches the backend URL
// Backend URL logic:
// Backend URL logic:
// Backend URL logic:
const envUrl = import.meta.env.VITE_API_BASE_URL;
const isBrowser = typeof window !== 'undefined';
const isLocal = isBrowser && window.location.hostname === 'localhost';
const root = envUrl || (isLocal ? 'http://localhost:3001' : '');
const API_BASE_URL = root.endsWith('/api') ? root : `${root}/api`;

export const fetchMetrics = async (): Promise<MetricsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/metrics`);
    return response.data;
};

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
    const response = await axios.get(`${API_BASE_URL}/recommendations`);
    return response.data;
};

export const fetchCostAllocation = async (window: string = '7d', resolution: string = 'Daily', aggregate: string = 'namespace'): Promise<{ data: any[] }> => {
    const response = await axios.get(`${API_BASE_URL}/cost-allocation`, {
        params: { window, resolution, aggregate }
    });
    return response.data;
};
