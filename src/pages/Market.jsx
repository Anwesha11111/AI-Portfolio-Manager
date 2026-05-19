import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSimulationStore from '../store/useSimulationStore';
import { Loader, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { getGradientForSymbol } from '../utils/assetMap';
import { supabase } from '../lib/supabase';

export default function Market() {
  const navigate = useNavigate();
  const { currentSimulatedDate, aiHelpEnabled } = useSimulationStore();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('gainers');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/batch?date=${currentSimulatedDate}`);
        const data = await res.json();
        
        const formattedAssets = data.map(asset => ({
          ...asset,
          name: asset.symbol.replace(/_/g, ' '),
        }));

        setAssets(formattedAssets);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch market overview:", err);
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [currentSimulatedDate]);

  const handleAiRecommend = async () => {
    setAiLoading(true);
    setAiRecommendation(null);
    try {
      let profileParams = { time_horizon: 'long', drawdown_tolerance: 'medium', primary_objective: 'growth' };
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('time_horizon, drawdown_tolerance, primary_objective').eq('id', user.id).single();
        if (data) {
          profileParams = data;
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: currentSimulatedDate,
          timeHorizon: profileParams.time_horizon,
          drawdownTolerance: profileParams.drawdown_tolerance,
          primaryObjective: profileParams.primary_objective
        })
      });
      const data = await res.json();
      setAiRecommendation(data);
    } catch (err) {
      console.error('Failed to get AI recommendation:', err);
    }
    setAiLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader size={48} className="spin" color="var(--accent-primary)" />
      </div>
    );
  }

  let sortedAssets = [...assets];
  if (sortBy === 'gainers') sortedAssets.sort((a,b) => b.change - a.change);
  if (sortBy === 'losers') sortedAssets.sort((a,b) => a.change - b.change);
  if (sortBy === 'alpha-asc') sortedAssets.sort((a,b) => a.symbol.localeCompare(b.symbol));
  if (sortBy === 'alpha-desc') sortedAssets.sort((a,b) => b.symbol.localeCompare(a.symbol));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800' }}>Market Discovery</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Select a company to view detailed historical charts and execute trades.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {aiHelpEnabled && (
            <button 
              onClick={handleAiRecommend}
              disabled={aiLoading}
              className="glass-panel"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: 'white', padding: '10px 20px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: aiLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold', transition: 'all 0.3s', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.6)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)'}
            >
              {aiLoading ? <Loader size={18} className="spin" /> : <Sparkles size={18} color="#c084fc" />}
              {aiLoading ? 'Analyzing Market...' : 'AI Recommend'}
            </button>
          )}

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-panel"
            style={{
              padding: '10px 16px', borderRadius: '8px', color: 'white', border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.5)', outline: 'none', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            <option value="gainers">Sort: Top Gainers</option>
            <option value="losers">Sort: Top Losers</option>
            <option value="alpha-asc">Sort: A-Z</option>
            <option value="alpha-desc">Sort: Z-A</option>
          </select>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <div className="glass-panel animate-fade-in-up" style={{
          marginBottom: '24px', padding: '24px', borderRadius: '12px',
          background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Sparkles size={24} color="#c084fc" />
            <h3 style={{ margin: 0, color: 'white' }}>AI Top Pick: <span style={{ color: '#c084fc' }}>{aiRecommendation.symbol}</span></h3>
          </div>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginBottom: 0 }}>
            {aiRecommendation.reasoning}
          </p>
        </div>
      )}

      {/* Asset List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedAssets.map((asset) => (
          <div 
            key={asset.symbol}
            onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
            className="glass-panel"
            style={{
              borderRadius: '12px', padding: '16px 24px', cursor: 'pointer', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'
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
                width: '42px', height: '42px',
                background: getGradientForSymbol(asset.symbol),
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.2rem', color: 'white',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)', flexShrink: 0
              }}>
                {asset.symbol[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{asset.symbol}</span>
              </div>
            </div>

            {/* Right: Price & Change */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'flex-end', flex: '1 1 200px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sim Price</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {asset.price > 0 ? `₹${asset.price.toFixed(2)}` : 'N/A'}
                </span>
              </div>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: asset.price === 0 ? 'rgba(255,255,255,0.05)' : (asset.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                color: asset.price === 0 ? 'var(--text-muted)' : (asset.change >= 0 ? 'var(--success)' : 'var(--danger)'),
                padding: '8px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem', minWidth: '100px', justifyContent: 'center'
              }}>
                {asset.price === 0 ? 'No Data' : (
                  <>
                    {asset.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
