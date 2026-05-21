import { useState } from 'react';
import { Info, TrendingUp, Percent, CircleDollarSign } from 'lucide-react';
import { getFundamentalsForDate, getValuationBadge, getROEBadge, getDividendBadge } from '../data/stockFundamentals';

export default function FundamentalsPanel({ symbol, simulatedTimestamp }) {
  const [showPeTooltip, setShowPeTooltip] = useState(false);
  const [showRoeTooltip, setShowRoeTooltip] = useState(false);

  const data = getFundamentalsForDate(symbol, simulatedTimestamp);

  if (!data) {
    return (
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ height: '60px', borderRadius: '12px' }} />)}
        </div>
      </div>
    );
  }

  const valBadge = getValuationBadge(data.pe_ratio, data.sector_pe_avg);
  const roeBadge = getROEBadge(data.roe_percent);
  const divBadge = getDividendBadge(data.dividend_yield_percent);

  const MetricCard = ({ icon, label, value, suffix, badge, badgeColor, badgeBg, children }) => (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
          {icon} {label}
        </span>
        {badge && (
          <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', color: badgeColor, background: badgeBg || 'rgba(255,255,255,0.05)', border: `1px solid ${badgeColor}22` }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: badgeColor || 'var(--text-main)', letterSpacing: '-0.02em' }}>
        {value}{suffix && <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '4px' }}>{suffix}</span>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="glass-panel animate-fade-in-up" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={20} color="var(--accent-primary)" /> Stock Fundamentals
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 20px 0' }}>
        As of FY{data.fiscal_year} • Sector: {data.sector}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Dividend Yield */}
        <MetricCard
          icon={<CircleDollarSign size={14} />}
          label="Dividend Yield"
          value={data.dividend_yield_percent === 0 ? '—' : data.dividend_yield_percent.toFixed(2)}
          suffix={data.dividend_yield_percent > 0 ? '%' : ''}
          badge={divBadge.text}
          badgeColor={divBadge.color}
          badgeBg={divBadge.bg}
        />

        {/* P/E Ratio */}
        <MetricCard
          icon={<Percent size={14} />}
          label="P/E Ratio"
          value={data.pe_ratio.toFixed(1)}
          suffix="x"
          badge={valBadge.text}
          badgeColor={valBadge.color}
        >
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sector Avg: {data.sector_pe_avg}x</span>
            <button onClick={() => setShowPeTooltip(!showPeTooltip)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '4px' }}>
              <Info size={14} />
            </button>
          </div>
          {showPeTooltip && (
            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(79,142,247,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', border: '1px solid rgba(79,142,247,0.15)' }}>
              P/E ratio represents how many times the market is willing to pay for every ₹1 of this company's earnings. A higher P/E means the market expects strong future growth.
            </div>
          )}
        </MetricCard>

        {/* ROE */}
        <MetricCard
          icon={<TrendingUp size={14} />}
          label="Return on Equity"
          value={data.roe_percent.toFixed(1)}
          suffix="%"
          badge={roeBadge.text}
          badgeColor={roeBadge.color}
          badgeBg={roeBadge.bg}
        >
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowRoeTooltip(!showRoeTooltip)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '4px' }}>
              <Info size={14} />
            </button>
          </div>
          {showRoeTooltip && (
            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(79,142,247,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', border: '1px solid rgba(79,142,247,0.15)' }}>
              ROE measures how efficiently a company uses shareholder money to generate profit.
            </div>
          )}
        </MetricCard>

        {/* EPS */}
        <MetricCard
          icon={<CircleDollarSign size={14} />}
          label="Earnings Per Share"
          value={`₹${data.eps.toFixed(2)}`}
          badge={`TTM: ₹${data.eps_ttm.toFixed(2)}`}
          badgeColor="var(--accent-primary)"
        >
          <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Yearly: ₹{data.eps.toFixed(2)} • TTM: ₹{data.eps_ttm.toFixed(2)}
          </div>
        </MetricCard>
      </div>
    </div>
  );
}
