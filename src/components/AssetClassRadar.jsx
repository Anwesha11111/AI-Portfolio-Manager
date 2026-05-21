import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Shield } from 'lucide-react';

const HIGH_VOL_WINDOWS = [
  { start: new Date('2008-01-01').getTime(), end: new Date('2009-12-31').getTime() },
  { start: new Date('2020-02-01').getTime(), end: new Date('2020-08-31').getTime() },
];

export default function AssetClassRadar({ holdings, marketData, userProfile, simulatedTimestamp }) {
  const riskScore = useMemo(() => {
    if (!userProfile) return 5;
    const dd = { low: 3, medium: 5, high: 7 }[userProfile.drawdown_tolerance] || 5;
    const obj = { preservation: 2, income: 4, growth: 7 }[userProfile.primary_objective] || 5;
    const th = { short: 3, medium: 5, long: 7 }[userProfile.time_horizon] || 5;
    return Math.round((dd + obj + th) / 3);
  }, [userProfile]);

  const isHighVol = HIGH_VOL_WINDOWS.some(w => simulatedTimestamp >= w.start && simulatedTimestamp <= w.end);

  const equityValue = holdings.reduce((s, h) => s + h.quantity * (marketData[h.symbol] || h.average_buy_price), 0);
  const cashValue = Number(userProfile?.virtual_balance || 0);
  const total = equityValue + cashValue;
  const eqPct = total > 0 ? Math.round((equityValue / total) * 100) : 0;
  const cashPct = 100 - eqPct;
  const isUndiversified = eqPct === 100 && holdings.length > 0;

  const pieData = [{ name: 'Equity', value: eqPct }, { name: 'Cash', value: cashPct }];
  const COLORS = ['#4f8ef7', '#34d399'];

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
      <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={18} color="var(--accent-secondary)" /> Asset Class Radar
      </h4>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ width: '140px', height: '140px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: '-4px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.75rem' }}>
              <span style={{ color: COLORS[0] }}>■ Equity {eqPct}%</span>
              <span style={{ color: COLORS[1] }}>■ Cash {cashPct}%</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          {isUndiversified && (
            <div style={{ padding: '10px 14px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '8px', marginBottom: '12px', fontSize: '0.85rem', color: '#fbbf24', fontWeight: '600' }}>
              ⚠️ Undiversified — 100% equity with no cash buffer
            </div>
          )}

          {riskScore <= 4 && (
            <div style={{ padding: '14px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '10px', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Given your conservative risk profile, consider that Government Securities (G-Secs) and AAA-rated bonds currently offer near risk-free returns. Historically during high-volatility periods, a 30–40% debt allocation reduces portfolio drawdown significantly.
            </div>
          )}

          {isHighVol && (
            <div style={{ padding: '14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--danger)', lineHeight: '1.6' }}>
              🔴 High market volatility detected in this period. Bond yields typically rise as equity markets fall — this is a historically observed flight-to-safety pattern.
            </div>
          )}

          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
            Your risk score: {riskScore}/10. This module is educational only — no actual bond trading in the simulator.
          </p>
        </div>
      </div>
    </div>
  );
}
