import axios from 'axios';
import type { DailyCost } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
