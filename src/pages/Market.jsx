import { useNavigate } from 'react-router-dom';

const MOCK_ASSETS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 1245.50, change: 5.2 },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3450.20, change: -1.4 },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1670.00, change: 2.8 },
  { symbol: 'INFY.NS', name: 'Infosys', price: 1540.80, change: 8.5 },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1045.25, change: -0.5 },
  { symbol: 'SBIN.NS', name: 'State Bank of India', price: 620.10, change: 12.3 },
];

export default function Market() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>Market Discovery</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Select a company to view detailed historical charts and execute trades.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {MOCK_ASSETS.map((asset) => (
          <div 
            key={asset.symbol}
            onClick={() => navigate(`/market/${asset.symbol}`)}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px', height: '40px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1rem', color: 'var(--accent-primary)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {asset.symbol[0]}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{asset.symbol}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{asset.name}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Simulated Price</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>₹{asset.price.toFixed(2)}</span>
              </div>
              <div style={{ 
                backgroundColor: asset.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: asset.change >= 0 ? 'var(--success)' : 'var(--danger)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}>
                {asset.change >= 0 ? '+' : ''}{asset.change}% (2M)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
