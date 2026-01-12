# Implementation Plan

## 1. Metrics Collector
- **Goal**: Collects real-time Kubernetes and infrastructure metrics.
- **Tools**: Prometheus (presumed existing or installed via helm), Kubernetes Metrics Server.
- **Interface**: The core platform will query Prometheus APIs.

## 2. Carbon Estimation Engine & Cost Attribution
- **Location**: `backend/src/engine`
- **Logic**:
    - Fetch metrics (CPU/RAM) from Prometheus.
    - Fetch Carbon Intensity (CI) from public APIs (e.g., CarbonAwareSDK or mocked for now).
    - Formula: `Carbon = (Energy_Usage) * (Carbon_Intensity)`
    - Energy Usage Model: `Power_Idle + (Power_Max - Power_Idle) * Utilization` (Linear model).
- **Cost**:
    - Map resource usage to cloud pricing (Mocked pricing table for 'AWS us-east-1' etc).
    - Attribute to Namespace based on label.

## 3. Optimization Engine
- **Logic**:
    - Analyze utilization trends.
    - Suggest `Right-sizing` if avg utilization < 20%.
    - Suggest `Time-shifting` if Carbon Intensity variance is high.

## 4. Frontend Dashboard
- **Tech**: React + Recharts (or similar charting lib).
- **Pages**:
    - Overview: Total Carbon/Cost.
    - Workloads: Per-namespace breakdown.
    - Recommendations: Actionable list.

## 5. API (Backend)
- **Tech**: Node.js + Express + TypeScript.
- **Endpoints**:
    - `GET /metrics`: Aggregated metrics.
    - `GET /recommendations`: Generated ideas.
    - `GET /carbon/realtime`: Current CI.
