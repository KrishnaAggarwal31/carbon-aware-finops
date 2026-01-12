import axios from 'axios';
import type { MetricsResponse, Recommendation } from './types';

// Backend URL logic:
// Relative path only.
const API_BASE_URL = '/api';

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
