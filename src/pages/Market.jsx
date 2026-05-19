import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSimulationStore from '../store/useSimulationStore';
import { Loader, TrendingUp, TrendingDown, Sparkles, X } from 'lucide-react';
import { getGradientForSymbol } from '../utils/assetMap';
import { supabase } from '../lib/supabase';

export default function Market() {
  const navigate = useNavigate();
  const { currentSimulatedDate } = useSimulationStore();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('gainers');
  const [timeframe, setTimeframe] = useState('6M');
  
  // AI Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAmount, setAiAmount] = useState(100000);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null); // Will be an array now

  useEffect(() => {
    const fetchBatchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/batch?date=${currentSimulatedDate}&timeframe=${timeframe}`);
        const data = await res.json();
        
        const formattedAssets = data.map(asset => ({
          ...asset,
          name: asset.symbol.replace(/_/g, ' '),
        }));

        setAssets(formattedAssets);
      } catch (err) {
        console.error("Failed to fetch market overview:", err);
      }
      setLoading(false);
    };

    fetchBatchData();
  }, [currentSimulatedDate, timeframe]);

  const fetchAiRecommendation = async () => {
    setAiLoading(true);
    setAiRecommendations(null);
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
          primaryObjective: profileParams.primary_objective,
          investmentAmount: aiAmount
        })
      });
      const data = await res.json();
      // the endpoint now returns an array
      setAiRecommendations(data);
    } catch (err) {
      console.error('Failed to get AI recommendation:', err);
    }
    setAiLoading(false);
  };

  let sortedAssets = [...assets];
  if (sortBy === 'gainers') sortedAssets.sort((a,b) => b.change - a.change);
  if (sortBy === 'losers') sortedAssets.sort((a,b) => a.change - b.change);
  if (sortBy === 'alpha-asc') sortedAssets.sort((a,b) => a.symbol.localeCompare(b.symbol));
  if (sortBy === 'alpha-desc') sortedAssets.sort((a,b) => b.symbol.localeCompare(a.symbol));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800' }}>Market Discovery</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Select a company to view detailed historical charts and execute trades.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="glass-panel"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: 'white', padding: '10px 20px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              fontWeight: 'bold', transition: 'all 0.3s', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.6)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)'}
          >
            <Sparkles size={18} color="#c084fc" />
            AI Portfolio Allocator
          </button>

          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="glass-panel"
            style={{
              padding: '10px 16px', borderRadius: '8px', color: 'white', border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.5)', outline: 'none', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            <option value="1W">Change: 1 Week</option>
            <option value="1M">Change: 1 Month</option>
            <option value="3M">Change: 3 Months</option>
            <option value="6M">Change: 6 Months</option>
            <option value="1Y">Change: 1 Year</option>
          </select>

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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px' }}>
          <Loader size={48} className="spin" color="var(--accent-primary)" />
        </div>
      ) : (
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
      )}

      {/* AI Modal */}
      {isAiModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', borderRadius: '16px', position: 'relative' }}>
            <button 
              onClick={() => setIsAiModalOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#c084fc' }}>
              <Sparkles size={24} /> AI Portfolio Allocator
            </h2>

            {!aiRecommendations && !aiLoading && (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Specify how much capital you want to deploy. Our Gemini AI will analyze the market using your financial constraints and build a diversified allocation plan for you.
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Investment Amount (₹)</label>
                  <input 
                    type="number" 
                    value={aiAmount}
                    onChange={(e) => setAiAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', fontSize: '1.2rem' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => setAiAmount(50000)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>₹50k</button>
                    <button onClick={() => setAiAmount(100000)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>₹1 Lakh</button>
                    <button onClick={() => setAiAmount(500000)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>₹5 Lakh</button>
                  </div>
                </div>
                
                <button 
                  onClick={fetchAiRecommendation}
                  style={{ width: '100%', padding: '16px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  Generate Portfolio
                </button>
              </>
            )}

            {aiLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0' }}>
                <Loader size={48} className="spin" color="#c084fc" style={{ marginBottom: '16px' }} />
                <h3 style={{ color: '#c084fc' }}>Analyzing Market Data...</h3>
              </div>
            )}

            {aiRecommendations && !aiLoading && (
              <div className="animate-fade-in-up">
                <h3 style={{ marginBottom: '16px' }}>Recommended Allocation (₹{aiAmount.toLocaleString()})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {aiRecommendations.map((rec, i) => (
                    <div key={i} style={{ padding: '16px', backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#c084fc' }}>{rec.symbol}</strong>
                        <strong style={{ fontSize: '1.1rem' }}>₹{rec.allocation.toLocaleString()}</strong>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setIsAiModalOpen(false)}
                  style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '24px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
