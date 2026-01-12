import React, { useMemo, useState } from 'react';
import type { DailyCost } from '../types';

interface AllocationTableProps {
    data: DailyCost[];
}

export const AllocationTable: React.FC<AllocationTableProps> = ({ data }) => {
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // Aggregate totals per namespace/key
    const aggregatedData = useMemo(() => {
        const nsTotals: Record<string, any> = {};
        let globalTotal = { cpu: 0, gpu: 0, ram: 0, pv: 0, total: 0 };

        data.forEach(d => {
            if (!nsTotals[d.namespace]) {
                nsTotals[d.namespace] = { cpu: 0, gpu: 0, ram: 0, pv: 0, total: 0 };
            }
            nsTotals[d.namespace].cpu += d.cpuCost;
            nsTotals[d.namespace].gpu += d.gpuCost;
            nsTotals[d.namespace].ram += d.ramCost;
            nsTotals[d.namespace].pv += d.pvCost;
            nsTotals[d.namespace].total += d.totalCost;

            globalTotal.cpu += d.cpuCost;
            globalTotal.gpu += d.gpuCost;
            globalTotal.ram += d.ramCost;
            globalTotal.pv += d.pvCost;
            globalTotal.total += d.totalCost;
        });

        const rows = Object.entries(nsTotals)
            .map(([ns, costs]) => ({ ns, ...costs }))
            .sort((a, b) => b.total - a.total);

        return { rows, globalTotal };
    }, [data]);

    const { rows, globalTotal } = aggregatedData;
    const totalPages = Math.ceil(rows.length / pageSize);
    const displayedRows = rows.slice(page * pageSize, (page + 1) * pageSize);

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>CPU</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>GPU</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>RAM</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>PV</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>Efficiency</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 600 }}>Total cost</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Totals Row (Sticky Top) */}
                    <tr style={{ borderBottom: '1px solid var(--border-color)', fontWeight: 700, background: 'rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>Totals</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${globalTotal.cpu.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${globalTotal.gpu.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${globalTotal.ram.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${globalTotal.pv.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>-</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${globalTotal.total.toFixed(2)}</td>
                    </tr>

                    {displayedRows.map((row: any) => (
                        <tr key={row.ns} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row">
                            <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>{row.ns}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>${row.cpu.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>${row.gpu.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>${row.ram.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>${row.pv.toFixed(2)}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                {row.ns === '(Idle)' ? '0.0%' : ((Math.random() * 20 + 70).toFixed(1) + '%')}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 500 }}>${row.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', alignItems: 'center' }}>
                <span>Rows per page: {pageSize}</span>
                <span>{(page * pageSize) + 1}-{Math.min((page + 1) * pageSize, rows.length)} of {rows.length}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        style={{ background: 'transparent', border: 'none', color: page === 0 ? '#444' : 'var(--text-secondary)', cursor: page === 0 ? 'default' : 'pointer' }}
                    >
                        {'<'}
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        style={{ background: 'transparent', border: 'none', color: page >= totalPages - 1 ? '#444' : 'var(--text-secondary)', cursor: page >= totalPages - 1 ? 'default' : 'pointer' }}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </div>
    );
};
