import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getYearlyFinancials, getQuarterlyFinancials } from '../data/stockFundamentals';

export default function FinancialsTab({ symbol, simulatedTimestamp }) {
  const [view, setView] = useState('quarterly');
  const yearly = useMemo(() => getYearlyFinancials(symbol, simulatedTimestamp), [symbol, simulatedTimestamp]);
  const quarterly = useMemo(() => getQuarterlyFinancials(symbol, simulatedTimestamp), [symbol, simulatedTimestamp]);
  const records = view === 'yearly' ? yearly.slice(-10) : quarterly.slice(-12);

  const chartData = records.map(r => ({
    name: view === 'yearly' ? `FY${r.fiscal_year}` : `FY${r.fiscal_year} Q${r.fiscal_quarter}`,
    Revenue: r.revenue_cr, 'Op Profit': r.operating_profit_cr, 'Net Profit': r.net_profit_cr,
  }));

  const withChanges = records.map((r, i) => {
    const prev = i > 0 ? records[i - 1] : null;
    const yoy = prev ? ((r.revenue_cr - prev.revenue_cr) / prev.revenue_cr * 100).toFixed(1) : '—';
    return { ...r, yoy };
  });

  const fmt = v => '₹' + Number(v).toLocaleString('en-IN');
  const chgStyle = v => ({ color: v === '—' ? 'var(--text-muted)' : parseFloat(v) >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '600' });
  const cellS = { padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' };
  const headS = { ...cellS, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', fontWeight: '700' };

  if (records.length === 0) return <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', color: 'var(--text-muted)' }}>No financial data available for this period.</div>;

  return (
    <div className="glass-panel animate-fade-in-up" style={{ padding: '24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📊 Financial Performance</h3>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '3px' }}>
          {['quarterly', 'yearly'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
              background: view === v ? 'var(--accent-primary)' : 'transparent', color: view === v ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s',
            }}>{v === 'quarterly' ? 'Quarterly' : 'Yearly'}</button>
          ))}
        </div>
      </div>

      <div style={{ height: '280px', marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fill: '#8892aa', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8892aa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e8eaf6' }} formatter={v => [`₹${Number(v).toLocaleString('en-IN')} Cr`, undefined]} />
            <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
            <Bar dataKey="Revenue" fill="#4f8ef7" radius={[4,4,0,0]} />
            <Bar dataKey="Op Profit" fill="#9d6ff5" radius={[4,4,0,0]} />
            <Bar dataKey="Net Profit" fill="#34d399" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
          <thead><tr style={{ background: 'rgba(0,0,0,0.2)' }}>
            <th style={headS}>Period</th><th style={headS}>Sales (₹Cr)</th><th style={headS}>Op Profit</th><th style={headS}>Net Profit</th><th style={headS}>{view === 'yearly' ? 'YoY %' : 'QoQ %'}</th>
          </tr></thead>
          <tbody>{withChanges.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              <td style={cellS}>{view === 'yearly' ? `FY${r.fiscal_year}` : `FY${r.fiscal_year} Q${r.fiscal_quarter}`}</td>
              <td style={cellS}>{fmt(r.revenue_cr)}</td>
              <td style={cellS}>{fmt(r.operating_profit_cr)}</td>
              <td style={cellS}>{fmt(r.net_profit_cr)}</td>
              <td style={{ ...cellS, ...chgStyle(r.yoy) }}>{r.yoy === '—' ? '—' : `${parseFloat(r.yoy) > 0 ? '+' : ''}${r.yoy}%`}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '16px', lineHeight: '1.5' }}>
        Yearly financials are updated as of March (fiscal year end for Indian companies). Quarterly results are released within 45 days of quarter end.
      </p>
    </div>
  );
}
