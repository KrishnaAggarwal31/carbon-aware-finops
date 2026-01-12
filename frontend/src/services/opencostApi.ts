import axios from 'axios';
import type { DailyCost } from '../types';

// Backend URL logic:
// 1. Deployment: VITE_API_BASE_URL will be https://backend.onrender.com (Root) -> Append /api
// 2. Local: Fallback is http://localhost:3001 -> Append /api
// Result: Always ensure we talk to /api endpoint
// Backend URL logic:
// 1. Env Var: Always use if set
// 2. Dev Mode: Default to localhost:3001
// 3. Prod Mode: Default to relative path (assumes same-domain proxy/rewrite)
const isDev = import.meta.env.MODE === 'development';
const envUrl = import.meta.env.VITE_API_BASE_URL;
const root = envUrl || (isDev ? 'http://localhost:3001' : '');
const API_BASE_URL = root.endsWith('/api') ? root : `${root}/api`;

export interface AllocationParams {
    window: string;        // e.g., "7d" or "24h"
    aggregate: string;     // e.g., "namespace" or "pod"
    step?: string;         // e.g., "1h"
    resolution?: string;   // optional: "Daily" or "Entire window"
}

export async function getAllocation(
    params: AllocationParams
): Promise<{ data: DailyCost[] }> {
    const queryParams: any = {
        window: params.window,
        aggregate: params.aggregate,
        resolution: params.resolution
    };

    if (params.step) {
        queryParams.step = params.step;
    }

    const response = await axios.get(`${API_BASE_URL}/cost-allocation`, {
        params: queryParams
    });

    return response.data;
}
