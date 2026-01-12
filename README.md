# 🌱 Carbon-Aware FinOps Platform

> **Maximize Efficiency. Minimize Emissions.**
> A unified dashboard for Kubernetes cost allocation, carbon footprint tracking, and sustainability-aware optimization.

![Carbon Aware Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## 🚀 Overview

This platform seamlessly bridges the gap between **FinOps** (Financial Operations) and **GreenOps** (Sustainability), enabling engineering teams to:
*   **Visualize Real-Time Costs**: Breakdown spending by Namespace, Pod, or Node.
*   **Track Carbon Footprint**: Estimate energy usage and CO2 emissions for your clusters.
*   **Identify Waste**: Spot idle resources and receive actionable "Right-Sizing" recommendations.
*   **Make Data-Driven Decisions**: Use historical trends to optimize both budget and environmental impact.

## ✨ Key Features

*   **📊 Interactive Dashboard**: Built with React, Recharts, and Vite for a snappy, modern experience.
*   **💰 Granular Cost Allocation**: 
    *   Verify spending with **Daily** vs **Entire Window** views.
    *   Drill down into specific **Namespaces**, **Pods**, or **Nodes**.
    *   Powered by industry-standard OpenCost estimation logic.
*   **🌍 Real-Time Carbon Metrics**:
    *   Live integration with **Prometheus** for CPU/Memory metrics.
    *   Custom energy estimation engine converting Resource Usage → Watts → gCO2eq.
*   **⚡ Optimization Insights**: Automated recommendations to reduce waste (e.g., "Downsize analytics-worker", "Shift jobs to green windows").

## 🛠️ Tech Stack

*   **Frontend**: React (TypeScript), Vite, Recharts, Lucide Icons.
*   **Backend**: Node.js (TypeScript), Express, Axios.
*   **Infrastructure**: Kubernetes, Prometheus, Docker.

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose (Optional, for containerized run)
*   Access to a Kubernetes cluster with Prometheus (for real data)

### 🔧 Local Installation (Development)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/carbon-aware-finops.git
    cd carbon-aware-finops
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend
    cd backend
    npm install
    
    # Install Frontend
    cd ../frontend
    npm install
    ```

3.  **Run Locally**
    Open two terminal windows:
    
    *Terminal 1 (Backend):*
    ```bash
    cd backend
    npm run dev
    # Runs on http://localhost:3001
    ```

    *Terminal 2 (Frontend):*
    ```bash
    cd frontend
    npm run dev
    # Runs on http://localhost:5173
    ```

4.  **Connect to Prometheus (Optional)**
    By default, the app uses mock data if Prometheus is unreachable. To connect to a live cluster:
    ```bash
    kubectl port-forward -n prometheus svc/prometheus-server 9090:80
    ```
    The backend allows configuration via `PROMETHEUS_URL` env variable.

### 🐳 Run with Docker

To spin up the entire stack (Frontend + Backend) in containers:

```bash
docker-compose up --build
```
*   **Dashboard**: [http://localhost:5173](http://localhost:5173)
*   **API**: [http://localhost:3001](http://localhost:3001)

## 📂 Project Structure

```
carbon-aware-finops/
├── backend/                # Node.js API Service
│   ├── src/                # Source code (Express server, Prom queries)
│   └── Dockerfile
├── frontend/               # React Dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI components (Chart, Table)
│   │   ├── services/       # API clients
│   │   └── App.tsx         # Main Controller
│   └── Dockerfile
├── docker-compose.yml      # Container orchestration
└── README.md               # You are here
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
