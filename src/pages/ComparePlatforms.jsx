export default function ComparePlatforms() {
  const cols = ['Feature', 'Direct Stocks (NSE/BSE)', 'Mutual Funds', 'Index Funds (ETFs)', 'Fidelity', 'Our Simulator'];
  const rows = [
    ['Minimum Investment', '₹1 (1 share)', '₹500 SIP', '₹500 SIP', '₹1,000+', '₹0 (Virtual)'],

    ['Risk Level', 'High', 'Medium', 'Low-Medium', 'Varies', 'Zero (Simulated)'],
    ['Who Manages It', 'Self', 'Fund Manager', 'Index-tracked', 'AI-assisted + Self', 'AI-assisted + Self'],
    ['Liquidity', 'T+1 settlement', '1-3 days redemption', 'T+1 on exchange', 'Varies by product', 'Instant'],
    ['Tax Treatment (India)', 'STCG 20% / LTCG 12.5%', 'STCG 20% / LTCG 12.5%', 'Same as equity MF', 'Depends on instrument', 'N/A (Simulated)'],
    ['Expense Ratio / Brokerage', '₹20/trade flat', '0.5%-2.5% p.a.', '0.05%-0.3% p.a.', '0.3%-1% p.a.', 'Free'],
    ['Best For', 'Intermediate-Expert', 'Beginner-Intermediate', 'Beginner-Expert', 'All levels', 'Learning & Practice'],
    ['Diversification', 'Low (manual)', 'High (built-in)', 'High (index)', 'Medium-High', 'Depends on user'],
    ['Requires Market Knowledge', 'Yes', 'No', 'Partial', 'Partial', 'Learning tool'],
    ['Simulated in This Platform', 'Yes ✅', 'No', 'No', 'No', 'Yes ✅'],
  ];
  const cs = { padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', whiteSpace: 'nowrap' };
  const hs = { ...cs, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 2 };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: '800', margin: '0 0 4px' }}>Compare Investment Platforms</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Understand how different investment options compare before putting real money to work.</p>
      </div>

      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead><tr>{cols.map((c, i) => (
              <th key={i} style={{ ...hs, ...(i === 0 ? { position: 'sticky', left: 0, zIndex: 3, background: 'rgba(10,10,20,0.95)', minWidth: '160px' } : {}), ...(i === 5 ? { background: 'rgba(79,142,247,0.12)', color: 'var(--accent-primary)' } : {}) }}>{c}</th>
            ))}</tr></thead>
            <tbody>{rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ ...cs, ...(ci === 0 ? { fontWeight: '600', position: 'sticky', left: 0, background: ri % 2 === 0 ? 'rgba(10,10,20,0.95)' : 'rgba(18,18,35,0.95)', zIndex: 1 } : {}), ...(ci === 5 ? { background: 'rgba(79,142,247,0.05)', color: 'var(--accent-primary)', fontWeight: '600' } : {}) }}>{cell}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '32px' }}>
        This comparison is for educational purposes. Tax treatment is based on Indian tax laws as of FY2025-26 and may change.
      </p>

      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem' }}>Why This Matters</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-main)', margin: '0 0 8px 0' }}>1. Choosing the Wrong Instrument</h4>
            <p style={{ margin: 0 }}>Most retail investors in India jump directly into stock picking without understanding that 85% of actively managed funds underperform their benchmark index over 10 years. Beginners often chase "hot tips" and end up buying high-volatility stocks when a simple Nifty 50 index fund would have given better risk-adjusted returns. Understanding which instrument suits your goals, timeline, and risk appetite is the single most important financial decision you'll make.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-main)', margin: '0 0 8px 0' }}>2. The Hidden Cost of Expense Ratios</h4>
            <p style={{ margin: 0 }}>A seemingly small difference in expense ratio compounds dramatically. Consider: ₹10,00,000 invested for 20 years at 12% annual returns. With a 0.1% expense ratio (index fund), you'd have ₹92.7 lakhs. With a 2% expense ratio (active fund), you'd have only ₹67.3 lakhs. That's <strong style={{color:'var(--danger)'}}>₹25.4 lakhs lost</strong> to fees — over 25% of your potential wealth, gone. Always check the expense ratio before investing.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-main)', margin: '0 0 8px 0' }}>3. When Stock Picking Makes Sense</h4>
            <p style={{ margin: 0 }}>Direct stock investing makes sense when you have the time to research companies, read quarterly results, and monitor your portfolio regularly. For most people with full-time jobs, a core portfolio of 70-80% in index funds with 20-30% in carefully selected individual stocks offers the best of both worlds. Our simulator helps you practice the stock-picking part without risking real money, so you can build conviction before deploying capital.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
