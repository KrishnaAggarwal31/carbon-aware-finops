export interface MetricData {
    namespace: string;
    energyUsage: number; // kWh
    carbonEmission: number; // gCO2eq
    cost: number; // USD
}

export interface MetricsResponse {
    timestamp: string;
    data: MetricData[];
}

export interface Recommendation {
    id: string;
    type: string;
    description: string;
    potentialSavings: number;
    potentialCarbonReduction: number;
    confidence: 'High' | 'Medium' | 'Low';
}

export interface DailyCost {
    date: string;
    namespace: string;
    cpuCost: number;
    gpuCost: number;
    ramCost: number;
    pvCost: number;
    totalCost: number;
}
