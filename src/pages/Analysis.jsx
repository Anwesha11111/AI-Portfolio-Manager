export default function Analysis() {
  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>AI Behavioral Analysis & Insights</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The Hybrid Brain LLM is analyzing your trading patterns based on the current simulation context.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '24px'
        }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Current Market Environment</h3>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
            [AI Insight] The market is currently experiencing high volatility. Based on your moderate risk profile, it is advisable to wait for a clearer trend reversal before deploying large amounts of capital into the IT sector.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '24px'
        }}>
          <h3 style={{ marginBottom: '16px' }}>Your Psychology</h3>
          <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--success)' }}>●</span> Steady Hand (No panic selling detected)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--danger)' }}>●</span> Warning: High concentration in single asset
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
