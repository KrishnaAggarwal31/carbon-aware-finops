import axios from 'axios';
import type { DailyCost } from '../types';

// Backend URL logic:
// Relative path only.
// In dev: handled by Vite proxy.
// In prod: handled by Vercel rewrite.
const API_BASE_URL = '/api';

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
