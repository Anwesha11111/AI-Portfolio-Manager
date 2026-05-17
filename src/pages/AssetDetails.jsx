import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AssetDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Back Button & Asset Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/market')}
          style={{ 
            background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', 
            padding: '8px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex'
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
           <div style={{
              width: '48px', height: '48px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {symbol[0]}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{symbol}</h2>
            <span style={{ color: 'var(--text-muted)' }}>Company Name Placeholder</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>₹1,245.50</h2>
          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+5.2% (2M Change)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
        {/* Left: Chart & Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Chart Container */}
          <div style={{
            flex: 1, backgroundColor: 'var(--bg-card)', borderRadius: '12px', 
            border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column'
          }}>
            {/* Timeframe Selectors */}
            <div style={{ display: 'flex', gap: '8px', padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
              {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
                <button key={tf} style={{
                  padding: '6px 12px', background: tf === '6M' ? 'var(--accent-primary)' : 'transparent',
                  color: tf === '6M' ? '#fff' : 'var(--text-muted)', border: 'none', borderRadius: '4px',
                  fontWeight: '600', cursor: 'pointer'
                }}>{tf}</button>
              ))}
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              [TradingView Candlestick Renders Here]
            </div>
          </div>

          {/* Daily Stats */}
          <div style={{
             backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', 
             padding: '24px', display: 'flex', justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Day High</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹1,250.00</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Day Low</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹1,230.10</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Volume</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>2.4M</span>
            </div>
          </div>
        </div>

        {/* Right: Order Form */}
        <div style={{ width: '320px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
           <h3>Execute Order</h3>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', marginBottom: '24px' }}>
            Available Capital: ₹10,00,000
           </p>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Quantity</label>
              <input type="number" placeholder="0" style={{ width: '100%', padding: '12px', borderRadius: '6px', backgroundColor: '#000', color: 'white', border: '1px solid var(--border-color)', fontSize: '1.1rem' }} />
            </div>
            
            <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Cost</span>
                <span style={{ fontWeight: 'bold' }}>₹0.00</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button style={{ flex: 1, padding: '14px', backgroundColor: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>BUY</button>
              <button style={{ flex: 1, padding: '14px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>SELL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
