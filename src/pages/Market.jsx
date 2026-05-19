import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSimulationStore from '../store/useSimulationStore';
import { Loader, TrendingUp, TrendingDown } from 'lucide-react';
import { getLogoUrl } from '../utils/assetMap';

export default function Market() {
  const navigate = useNavigate();
  const currentSimulatedDate = useSimulationStore(state => state.currentSimulatedDate);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/batch?date=${currentSimulatedDate}`);
        const data = await res.json();
        
        const formattedAssets = data.map(asset => ({
          ...asset,
          name: asset.symbol.replace(/_/g, ' '),
          logo: getLogoUrl(asset.symbol)
        })).sort((a, b) => b.change - a.change); // Sort by highest movers

        setAssets(formattedAssets);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch market overview:", err);
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [currentSimulatedDate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader size={48} className="spin" color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
        marginBottom: '32px', flexWrap: 'wrap', gap: '16px' 
      }}>
        <div>
          <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800' }}>Market Discovery</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Select a company to view detailed historical charts and execute trades.
          </p>
        </div>
        <div className="glass-panel" style={{ 
          padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Simulation Date:</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{new Date(currentSimulatedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {assets.map((asset) => (
          <div 
            key={asset.symbol}
            onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
            className="glass-panel"
            style={{
              borderRadius: '12px',
              padding: '20px 24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateX(5px)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            {/* Left: Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 250px' }}>
              <div style={{
                width: '48px', height: '48px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)',
                border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', flexShrink: 0
              }}>
                {asset.logo ? (
                  <img src={asset.logo} alt={asset.symbol} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'white', padding: '4px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                ) : null}
                <span style={{ display: asset.logo ? 'none' : 'block' }}>{asset.symbol[0]}</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{asset.symbol}</span>
              </div>
            </div>

            {/* Right: Price & Change */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'flex-end', flex: '1 1 200px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sim Price</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>₹{asset.price.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: asset.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: asset.change >= 0 ? 'var(--success)' : 'var(--danger)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                minWidth: '110px',
                justifyContent: 'center'
              }}>
                {asset.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
