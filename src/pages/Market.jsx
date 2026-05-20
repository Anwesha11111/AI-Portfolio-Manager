import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSimulationStore from '../store/useSimulationStore';
import { Loader, TrendingUp, TrendingDown, Sparkles, BrainCircuit } from 'lucide-react';
import { getGradientForSymbol, getLogoUrl } from '../utils/assetMap';
import { supabase } from '../lib/supabase';

export default function Market() {
  const navigate = useNavigate();
  const { currentSimulatedDate } = useSimulationStore();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('market_sortBy') || 'gainers');
  const [timeframe, setTimeframe] = useState(() => localStorage.getItem('market_timeframe') || '3M');
  
  // AI Panel States
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isTrading, setIsTrading] = useState(false);

  const debounceRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = isFirstLoad.current ? 0 : 800;

    debounceRef.current = setTimeout(async () => {
      if (isFirstLoad.current) setLoading(true);
      try {
        const data = await useSimulationStore.getState().fetchMarketData(timeframe);
        if (Array.isArray(data)) {
          const formattedAssets = data.map(asset => ({
            ...asset,
            name: asset.symbol.replace(/_/g, ' '),
          }));
          setAssets(formattedAssets);
        } else {
          console.error("Backend returned non-array data:", data);
          setAssets([]);
        }
      } catch (err) {
        console.error("Failed to fetch market overview:", err);
      }
      setLoading(false);
      isFirstLoad.current = false;
    }, delay);

    return () => clearTimeout(debounceRef.current);
  }, [currentSimulatedDate, timeframe]);


  const fetchAiRecommendation = async () => {
    setAiLoading(true);
    setAiRecommendations(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAiLoading(false); return; }

      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      if (!userData) { setAiLoading(false); return; }

      // Once-per-month check
      const lastRecommDate = userData.last_ai_recommendation_date || 0;
      const lastMonth = new Date(lastRecommDate).getMonth() + '-' + new Date(lastRecommDate).getFullYear();
      const currentMonth = new Date(currentSimulatedDate).getMonth() + '-' + new Date(currentSimulatedDate).getFullYear();
      if (lastRecommDate > 0 && lastMonth === currentMonth) {
        alert('You can only get AI recommendations once per simulated month. Wait for the next month.');
        setAiLoading(false);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: currentSimulatedDate,
          timeHorizon: userData.time_horizon,
          drawdownTolerance: userData.drawdown_tolerance,
          primaryObjective: userData.primary_objective,
          profile: {
            monthly_income: userData.monthly_income,
            monthly_expenses: userData.monthly_expenses,
            virtual_balance: userData.virtual_balance,
          }
        })
      });
      const data = await res.json();
      setAiRecommendations(data);

      // Mark this month as used
      await supabase.from('users').update({ last_ai_recommendation_date: currentSimulatedDate }).eq('id', user.id);
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

  const handleAiTrade = async (symbol, qty, price) => {
    if (!qty || qty <= 0) return;
    const cost = qty * price;

    setIsTrading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { alert("Must be logged in."); setIsTrading(false); return; }

      const { data: userData } = await supabase.from('users').select('virtual_balance').eq('id', user.id).single();
      let balance = Number(userData?.virtual_balance || 0);

      if (cost > balance) {
        alert(`Insufficient funds for ${symbol}. Need ₹${cost.toLocaleString()}, have ₹${balance.toLocaleString()}.`);
        setIsTrading(false);
        return false;
      }
      
      await supabase.from('users').update({ virtual_balance: balance - cost }).eq('id', user.id);
      await supabase.from('transactions').insert({ user_id: user.id, symbol, type: 'BUY', quantity: qty, price_per_unit: price, simulated_date: currentSimulatedDate });

      const { data: holding } = await supabase.from('holdings').select('*').eq('user_id', user.id).eq('symbol', symbol).maybeSingle();
      if (holding) {
        const newQty = holding.quantity + qty;
        const newAvg = ((holding.quantity * holding.average_buy_price) + cost) / newQty;
        await supabase.from('holdings').update({ quantity: newQty, average_buy_price: newAvg }).eq('id', holding.id);
      } else {
        await supabase.from('holdings').insert({ user_id: user.id, symbol, quantity: qty, average_buy_price: price });
      }

      alert(`Successfully bought ${qty} shares of ${symbol}`);
      setIsTrading(false);
      return true;
    } catch (err) {
      console.error("Trade failed:", err);
      alert("Trade failed due to an error.");
      setIsTrading(false);
      return false;
    }
  };

  const handleBuyAll = async () => {
    const recs = aiRecommendations?.recommendations;
    if (!Array.isArray(recs)) return;
    for (const rec of recs) {
      const asset = assets.find(a => a.symbol === rec.symbol);
      if (asset && asset.price > 0) {
        const qty = Math.floor((rec.allocation || 0) / asset.price);
        if (qty > 0) {
           await handleAiTrade(asset.symbol, qty, asset.price);
        }
      }
    }
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>Market Discovery</h2>
          <p>Select a company to view detailed charts and execute trades.</p>
        </div>
        
        <div className="controls-bar" id="tour-market-controls">
          <button 
            onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
            style={{
              background: isAiPanelOpen ? 'rgba(157,111,245,0.35)' : 'linear-gradient(135deg, rgba(157,111,245,0.2), rgba(79,142,247,0.2))',
              border: '1px solid rgba(157,111,245,0.4)',
              color: 'white', padding: '9px 16px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              fontWeight: '600', fontSize: '0.875rem', transition: 'all 0.3s',
              boxShadow: '0 0 12px rgba(157,111,245,0.2)', whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(157,111,245,0.5)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 12px rgba(157,111,245,0.2)'}
          >
            <Sparkles size={16} color={isAiPanelOpen ? '#fff' : '#c084fc'} />
            {isAiPanelOpen ? 'Close AI' : 'AI Architect'}
          </button>

          <select 
            value={timeframe} 
            onChange={(e) => { setTimeframe(e.target.value); localStorage.setItem('market_timeframe', e.target.value); }}
          >
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => { setSortBy(e.target.value); localStorage.setItem('market_sortBy', e.target.value); }}
          >
            <option value="gainers">Top Gainers</option>
            <option value="losers">Top Losers</option>
            <option value="alpha-asc">A → Z</option>
            <option value="alpha-desc">Z → A</option>
          </select>
        </div>
      </div>

      {/* Inline AI Panel */}
      {isAiPanelOpen && (
        <div className="glass-panel animate-fade-in-up" style={{ 
          marginBottom: '32px', padding: '32px', borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#c084fc' }}>
            <Sparkles size={24} /> AI Portfolio Architect
          </h2>

          {!aiRecommendations && !aiLoading && (
            <div style={{ maxWidth: '600px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
                Our AI will analyze the current market conditions against your financial profile and determine how much to invest this month and in which stocks.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.85rem', fontStyle: 'italic' }}>
                ⏳ You can use this once per simulated month. The AI considers your income, savings, risk appetite, and market conditions.
              </p>
              
              <button 
                onClick={fetchAiRecommendation}
                style={{ padding: '16px 32px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <BrainCircuit size={20} /> Get Monthly AI Plan
              </button>
            </div>
          )}

          {aiLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0' }}>
              <Loader size={48} className="spin" color="#c084fc" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#c084fc' }}>Architecting your portfolio...</h3>
            </div>
          )}

          {aiRecommendations && !aiLoading && (
            <div className="animate-fade-in-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>Monthly Investment Plan</h3>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    AI recommends investing ₹{(aiRecommendations?.investable_amount || 0).toLocaleString()}
                  </span>
                  {aiRecommendations?.reasoning_for_amount && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>{aiRecommendations.reasoning_for_amount}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {Array.isArray(aiRecommendations?.recommendations) && (
                    <button 
                      onClick={handleBuyAll}
                      disabled={isTrading}
                      style={{ padding: '12px 24px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isTrading ? 'not-allowed' : 'pointer', opacity: isTrading ? 0.5 : 1 }}
                    >
                      Buy Full Portfolio
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                {Array.isArray(aiRecommendations?.recommendations) ? aiRecommendations.recommendations.map((rec, i) => {
                  const asset = assets.find(a => a.symbol === rec.symbol);
                  const price = asset?.price || 0;
                  const alloc = rec.allocation || 0;
                  const qty = price > 0 ? Math.floor(alloc / price) : 0;

                  return (
                    <div key={i} style={{ padding: '16px', backgroundColor: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#c084fc' }}>{rec.symbol}</strong>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{qty} × ₹{price.toFixed(0)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Alloc: ₹{alloc.toLocaleString()}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5', flex: 1 }}>{rec.reasoning}</p>
                      
                      <button 
                        onClick={() => handleAiTrade(rec.symbol, qty, price)}
                        disabled={isTrading || qty === 0}
                        style={{ width: '100%', padding: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: (isTrading || qty === 0) ? 'not-allowed' : 'pointer', opacity: (isTrading || qty === 0) ? 0.5 : 1 }}
                      >
                        {qty > 0 ? `Buy ${qty} shares` : 'No price'}
                      </button>
                    </div>
                  );
                }) : (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '10px', gridColumn: '1 / -1' }}>
                    {aiRecommendations?.error || "Failed to generate valid recommendations."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="page-loader">
          <Loader size={48} className="spin" color="var(--accent-primary)" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedAssets.map((asset) => (
            <div 
              key={asset.symbol}
              onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
              className="glass-panel asset-row"
              style={{ justifyContent: 'space-between' }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(79,142,247,0.3)';
                e.currentTarget.style.background = 'var(--bg-card-hover)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--bg-card)';
              }}
            >
              {/* Left: Logo & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 200px', minWidth: 0 }}>
                <div className="asset-logo" style={{ background: getGradientForSymbol(asset.symbol) }}>
                  {getLogoUrl(asset.symbol) ? (
                      <img src={getLogoUrl(asset.symbol)} alt={asset.symbol} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                  ) : null}
                  <span style={{ display: getLogoUrl(asset.symbol) ? 'none' : 'block' }}>{asset.symbol[0]}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</h3>
                </div>
              </div>

              {/* Right: Price & Change */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end', flex: '0 0 auto' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</span>
                  <span style={{ fontSize: '1rem', fontWeight: '700' }}>
                    {asset.price > 0 ? `₹${asset.price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '5px',
                  backgroundColor: asset.price === 0 ? 'rgba(255,255,255,0.04)' : (asset.change >= 0 ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)'),
                  color: asset.price === 0 ? 'var(--text-muted)' : (asset.change >= 0 ? 'var(--success)' : 'var(--danger)'),
                  padding: '6px 10px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', minWidth: '88px', justifyContent: 'center'
                }}>
                  {asset.price === 0 ? 'No Data' : (
                    <>
                      {asset.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
