import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, Leaf, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { fetchMetrics, fetchRecommendations } from './api';
import { getAllocation } from './services/opencostApi';
import { AllocationChart } from './components/AllocationChart';
import { AllocationTable } from './components/AllocationTable';
import type { MetricsResponse, Recommendation, DailyCost } from './types';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [allocationData, setAllocationData] = useState<DailyCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [selectedWindow, setSelectedWindow] = useState('7d');
  const [selectedResolution, setSelectedResolution] = useState('Daily'); // 'Daily' or 'Entire window'
  const [selectedAggregation, setSelectedAggregation] = useState('namespace'); // 'namespace', 'pod', 'node'

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching data for window:", selectedWindow);
        // Only show full loading on initial mount, otherwise just update chart silently or with small indicator
        if (!metrics) setLoading(true);

        const [metricsData, recsData, allocData] = await Promise.all([
          fetchMetrics(),
          fetchRecommendations(),
          getAllocation({ window: selectedWindow, resolution: selectedResolution, aggregate: selectedAggregation })
        ]);
        console.log("Data received:", metricsData);
        setMetrics(metricsData);
        setRecommendations(recsData);
        setAllocationData(allocData.data);
      } catch (err: any) {
        console.error("Failed to load data", err);
        setError(err.message || "Failed to connect to backend");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedWindow, selectedResolution, selectedAggregation]);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        <div style={{ fontSize: '1.2rem' }}>Loading Carbon Intelligence...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <p style={{ color: '#aaa', marginTop: '1rem' }}>Backend Unavailable</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return <div style={{ padding: '2rem', color: 'white' }}>No metrics data found.</div>;
  }

  // Safe Access with Fallback
  const data = metrics.data || [];

  // Calculate Aggregates
  const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
  const totalCarbon = data.reduce((acc, curr) => acc + curr.carbonEmission, 0);
  const totalEnergy = data.reduce((acc, curr) => acc + curr.energyUsage, 0);
  const carbonIntensityAvg = totalEnergy ? (totalCarbon / totalEnergy).toFixed(2) : 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Leaf size={32} color="var(--accent-green)" />
          <h1>Carbon-Aware FinOps</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Optimizing cloud cost and carbon emissions through intelligence and visibility.
        </p>
      </header>

      {/* KPI Stats Grid */}
      <div className="stat-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Projected Cost</span>
            <DollarSign size={20} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>${totalCost.toFixed(2)}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--accent-green)', marginTop: '0.5rem' }}>
            -12% vs last month
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Carbon Footprint</span>
            <Zap size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{totalCarbon} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>gCO2eq</span></div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Avg Intensity: {carbonIntensityAvg} g/kWh
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Active Workloads</span>
            <Activity size={20} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 600 }}>{data.length}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Across 1 Cluster
          </div>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="chart-grid">
        {/* Left: Visualization */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BarChart3 size={20} color="var(--text-secondary)" />
            <h3>Namespace Emissions vs. Cost</h3>
          </div>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="namespace" stroke="var(--text-secondary)" />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <Bar yAxisId="left" dataKey="carbonEmission" name="Carbon (g)" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="cost" name="Cost ($)" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recommendations */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3>Optimization Insights</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--accent-green)', background: 'var(--accent-green-dim)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              {recommendations.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendations.map(rec => (
              <div key={rec.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{rec.type}</span>
                  <span style={{ fontSize: '0.8rem', color: rec.confidence === 'High' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                    {rec.confidence} Confidence
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {rec.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: 'var(--accent-blue)' }}>-${rec.potentialSavings}/mo</span>
                    <span style={{ color: 'var(--accent-green)' }}>-{rec.potentialCarbonReduction}g Carbon</span>
                  </div>
                  <button
                    onClick={() => setSelectedRec(rec)}
                    className="btn-outline"
                    style={{ padding: '0.25rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Allocation Section (OpenCost Style) */}
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Cost Allocation</h2>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {selectedWindow === '24h' ? 'Last 24 hours' : selectedWindow === '7d' ? 'Last 7 days' : 'Last 30 days'} by {selectedAggregation} {selectedResolution.toLowerCase()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedWindow}
                onChange={e => setSelectedWindow(e.target.value)}
                style={{
                  appearance: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 2rem 0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <option value="24h">Range: Last 24h</option>
                <option value="7d">Range: Last 7 days</option>
                <option value="30d">Range: Last 30 days</option>
              </select>
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>▼</div>
            </div>

            <div style={{ position: 'relative' }}>
              <select
                value={selectedResolution}
                onChange={e => setSelectedResolution(e.target.value)}
                style={{
                  appearance: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 2.5rem 0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <option value="Daily">Resolution: Daily</option>
                <option value="Entire window">Resolution: Entire window</option>
              </select>
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>▼</div>
            </div>
            {/* Breakdown Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedAggregation}
                onChange={e => setSelectedAggregation(e.target.value)}
                style={{
                  appearance: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 2.5rem 0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <option value="namespace">Breakdown: Namespace</option>
                <option value="pod">Breakdown: Pod</option>
                <option value="node">Breakdown: Node</option>
              </select>
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>▼</div>
            </div>
          </div>
        </div>

        {/* Chart Component */}
        <div style={{ marginBottom: '2rem' }}>
          <AllocationChart data={allocationData} height={300} />
        </div>

        {/* Detailed Table Component */}
        <AllocationTable data={allocationData} />
      </div>

      {/* Detail Modal */}
      {selectedRec && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
        }} onClick={() => setSelectedRec(null)}>
          <div
            className="glass-card"
            style={{ width: '400px', maxWidth: '90%' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1rem' }}>{selectedRec.type}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{selectedRec.description}</p>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Savings</div>
                <div style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', fontWeight: 600 }}>${selectedRec.potentialSavings}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Carbon Reduction</div>
                <div style={{ color: 'var(--accent-green)', fontSize: '1.2rem', fontWeight: 600 }}>{selectedRec.potentialCarbonReduction}g</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: 'none', background: 'var(--accent-blue)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { alert('Fix applied successfully!'); setSelectedRec(null); }}
              >
                Apply Fix
              </button>
              <button
                className="btn-outline"
                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => setSelectedRec(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App;
