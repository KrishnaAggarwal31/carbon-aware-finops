# ☁️ How to Deploy Carbon-Aware FinOps Platform

You can deploy this project for free using **Render** (easiest for full-stack) or **Vercel** (Frontend only).

## Option 1: One-Click Deployment on Render (Recommended)

Render can hoist both the React Frontend and Node.js Backend from this single repository.

1.  **Sign up/Login** to [Render.com](https://render.com/).
2.  Click **New +** -> **Blueprints**.
3.  Connect your GitHub repository (`carbon-aware-finops`).
4.  Render will automatically detect `render.yaml` and propose two services:
    *   `finops-backend`: The API service.
    *   `finops-frontend`: The dashboard.
5.  **Important**: In the configuration step, ensure the `VITE_API_BASE_URL` for the frontend includes `/api` at the end if the auto-link doesn't add it.
    *   *Example*: `https://finops-backend-xyz.onrender.com/api`
6.  Click **Apply**. Wait about 5 minutes for the build to finish.
7.  Your dashboard will be live at `https://finops-frontend-xyz.onrender.com`!

## Option 2: Vercel (Frontend) + Render (Backend)

If you prefer Vercel for the frontend:

1.  **Deploy Backend on Render**:
    *   New -> Web Service.
    *   Root Directory: `backend`.
    *   Build Command: `npm install && npm run build`.
    *   Start Command: `npm start`.
    *   Copy the **Service URL** (e.g., `https://my-api.onrender.com`).

2.  **Deploy Frontend on Vercel**:
    *   Go to [Vercel](https://vercel.com/) -> Add New Project.
    *   Select your repo.
    *   Root Directory: `frontend`.
    *   **Environment Variables**: Add `VITE_API_BASE_URL` = `https://my-api.onrender.com/api`.
    *   Deploy.

## 🐳 Option 3: Kubernetes / Docker

Since this is a Kubernetes tool, you might want to run it in your cluster.

1.  **Build Images**:
    ```bash
    docker build -t myuser/finops-backend ./backend
    docker build -t myuser/finops-frontend ./frontend
    ```

2.  **Deploy with Helm**:
    (Coming soon - check `helm-charts/` directory)

---
**Note on Live Data**:
The public demo uses simulated "Mock Data". To see real metrics from your cluster, you must deploy this application *inside* your Kubernetes cluster or configure `PROMETHEUS_URL` in the backend to point to your Prometheus instance.
