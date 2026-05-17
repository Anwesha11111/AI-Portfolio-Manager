export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>My Portfolio</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={cardStyle}>
          <span style={labelStyle}>Total Virtual Capital</span>
          <h3 style={valueStyle}>₹10,00,000</h3>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Invested Value</span>
          <h3 style={valueStyle}>₹0</h3>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Total P&L</span>
          <h3 style={{...valueStyle, color: 'var(--text-main)'}}>₹0 (0.00%)</h3>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Current Holdings</h3>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        padding: '24px',
        color: 'var(--text-muted)'
      }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ paddingBottom: '12px' }}>Asset</th>
              <th style={{ paddingBottom: '12px' }}>Quantity</th>
              <th style={{ paddingBottom: '12px' }}>Avg. Buy Price</th>
              <th style={{ paddingBottom: '12px' }}>Current Price</th>
              <th style={{ paddingBottom: '12px' }}>P&L</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={{ paddingTop: '24px', textAlign: 'center' }}>No holdings yet. Go to the Market to place your first trade!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px'
};

const valueStyle = {
  fontSize: '1.8rem',
  fontWeight: '700',
  margin: 0
};
