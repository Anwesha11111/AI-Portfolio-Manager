import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSimulationStore from '../store/useSimulationStore';
import { Loader } from 'lucide-react';
import { getLogoUrl } from '../utils/assetMap';

export default function Market() {
  const navigate = useNavigate();
  const currentSimulatedDate = useSimulationStore(state => state.currentSimulatedDate);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        // 1. Fetch the full list of available assets
        const listRes = await fetch(`${import.meta.env.VITE_API_URL}/api/market`);
        const listData = await listRes.json();
        
        // Filter out the NIFTY_50_STOCKS index file from the trading grid
        const validSymbols = listData.assets.filter(s => s !== 'NIFTY_50_STOCKS');

        // 2. Fetch the current simulated price for every asset
        const promises = validSymbols.map(async (symbol) => {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/${symbol}?date=${currentSimulatedDate}`);
          const data = await res.json();
          return {
            symbol: symbol,
            name: symbol.replace(/_/g, ' '), // Basic fallback name
            price: data.currentPrice || 0,
            change: data.twoMonthChangePct || 0,
            logo: getLogoUrl(symbol)
          };
        });

        const resolvedAssets = await Promise.all(promises);
        setAssets(resolvedAssets);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch market overview:", err);
        setLoading(false);
      }
    };

    fetchAssetData();
  }, [currentSimulatedDate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader size={48} className="spin" color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>Market Discovery</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Select a company to view detailed historical charts and execute trades.
          </p>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Date: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{new Date(currentSimulatedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {assets.map((asset) => (
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
                border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden'
              }}>
                {asset.logo ? (
                  <img src={asset.logo} alt={asset.symbol} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'white', padding: '4px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                ) : null}
                <span style={{ display: asset.logo ? 'none' : 'block' }}>{asset.symbol[0]}</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.symbol}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{asset.name}</span>
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
                {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}% (2M)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
