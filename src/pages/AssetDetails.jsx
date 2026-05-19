import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import useSimulationStore from '../store/useSimulationStore';
import { getLogoUrl } from '../utils/assetMap';
import { supabase } from '../lib/supabase';

export default function AssetDetails() {
  const rawSymbol = useParams().symbol;
  const symbol = decodeURIComponent(rawSymbol);
  const navigate = useNavigate();
  const currentSimulatedDate = useSimulationStore(state => state.currentSimulatedDate);
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('3M');
  
  // Trading States
  const [quantity, setQuantity] = useState('');
  const [isTrading, setIsTrading] = useState(false);
  const [virtualBalance, setVirtualBalance] = useState(1000000);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('virtual_balance').eq('id', user.id).single();
        if (data) setVirtualBalance(Number(data.virtual_balance));
      }
    };
    fetchBalance();
  }, []);

  // Fetch data strictly up to the current simulated date
  const dataDebounceRef = useRef(null);
  const isFirstDataLoad = useRef(true);

  useEffect(() => {
    if (dataDebounceRef.current) clearTimeout(dataDebounceRef.current);
    const delay = isFirstDataLoad.current ? 0 : 800;

    dataDebounceRef.current = setTimeout(async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/market/${symbol}?date=${currentSimulatedDate}`;
        const response = await fetch(url);
        const data = await response.json();
        setAssetData(data);
        setLoading(false);
        isFirstDataLoad.current = false;
      } catch (err) {
        console.error("Failed to fetch asset data:", err);
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(dataDebounceRef.current);
  }, [symbol, currentSimulatedDate]);

  // Initialize TradingView Chart
  useEffect(() => {
    if (!chartContainerRef.current || !assetData || !assetData.history) return;

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const tfMap = {
      '1W': MS_PER_DAY * 7,
      '1M': MS_PER_DAY * 30,
      '3M': MS_PER_DAY * 90,
      '6M': MS_PER_DAY * 180,
      '1Y': MS_PER_DAY * 365,
      'ALL': Infinity
    };

    const cutoffTimestamp = currentSimulatedDate - (tfMap[timeframe] || tfMap['6M']);

    // Format and filter data for lightweight-charts
    const seenTimes = new Set();
    const chartData = assetData.history
      .filter(d => d.rawTimestamp >= cutoffTimestamp)
      .map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
      }))
      .sort((a, b) => a.time - b.time)
      .filter(d => {
        if (seenTimes.has(d.time)) return false;
        seenTimes.add(d.time);
        return true;
      });

    candlestickSeries.setData(chartData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [assetData, timeframe, currentSimulatedDate]);

  const handleTrade = async (type) => {
    if (!quantity || quantity <= 0) return;
    const qty = parseInt(quantity);
    const cost = qty * (assetData?.currentPrice || 0);

    setIsTrading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Must be logged in to trade.");
        setIsTrading(false);
        return;
      }

      // Get latest balance
      const { data: userData } = await supabase.from('users').select('virtual_balance').eq('id', user.id).single();
      let balance = Number(userData?.virtual_balance || 0);

      if (type === 'BUY') {
        if (cost > balance) {
          alert(`Insufficient funds. You need ₹${cost.toLocaleString()} but only have ₹${balance.toLocaleString()}`);
          setIsTrading(false);
          return;
        }
        
        await supabase.from('users').update({ virtual_balance: balance - cost }).eq('id', user.id);
        await supabase.from('transactions').insert({ user_id: user.id, symbol, type: 'BUY', quantity: qty, price_per_unit: assetData.currentPrice, simulated_date: currentSimulatedDate });

        const { data: holding } = await supabase.from('holdings').select('*').eq('user_id', user.id).eq('symbol', symbol).single();
        if (holding) {
          const newQty = holding.quantity + qty;
          const newAvg = ((holding.quantity * holding.average_buy_price) + cost) / newQty;
          await supabase.from('holdings').update({ quantity: newQty, average_buy_price: newAvg }).eq('id', holding.id);
        } else {
          await supabase.from('holdings').insert({ user_id: user.id, symbol, quantity: qty, average_buy_price: assetData.currentPrice });
        }

        setVirtualBalance(balance - cost);
        alert(`Successfully bought ${qty} shares of ${symbol}`);
        setQuantity('');
      } else if (type === 'SELL') {
        const { data: holding } = await supabase.from('holdings').select('*').eq('user_id', user.id).eq('symbol', symbol).single();
        if (!holding || holding.quantity < qty) {
          alert(`Insufficient shares. You only own ${holding?.quantity || 0} shares of ${symbol}.`);
          setIsTrading(false);
          return;
        }

        await supabase.from('users').update({ virtual_balance: balance + cost }).eq('id', user.id);
        await supabase.from('transactions').insert({ user_id: user.id, symbol, type: 'SELL', quantity: qty, price_per_unit: assetData.currentPrice, simulated_date: currentSimulatedDate });

        const newQty = holding.quantity - qty;
        if (newQty === 0) {
          await supabase.from('holdings').delete().eq('id', holding.id);
        } else {
          await supabase.from('holdings').update({ quantity: newQty }).eq('id', holding.id);
        }

        setVirtualBalance(balance + cost);
        alert(`Successfully sold ${qty} shares of ${symbol}`);
        setQuantity('');
      }
    } catch (err) {
      console.error("Trade failed:", err);
      alert("Trade failed due to an error.");
    }
    setIsTrading(false);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader size={48} className="spin" color="var(--accent-primary)" />
    </div>;
  }

  if (!assetData) return <div>Asset not found.</div>;
  if (assetData.error) return <div style={{ color: 'var(--danger)', padding: '24px' }}>Error: {assetData.error}</div>;
  if (!assetData.history || assetData.history.length === 0) return <div style={{ padding: '24px' }}>No historical data available for this date.</div>;

  const currentPrice = assetData.currentPrice || 0;
  const changePct = assetData.twoMonthChangePct || 0;
  const latestCandle = assetData.history[assetData.history.length - 1] || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
      {/* Header Back Button & Asset Info */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px' }}>
        <button 
          onClick={() => navigate('/market')}
          style={{ 
            background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '12px', 
            padding: '12px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <ArrowLeft size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <div style={{
            width: '56px', height: '56px',
            backgroundColor: 'white',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '1.5rem', color: '#000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden', padding: '4px'
          }}>
            {getLogoUrl(symbol) ? (
                <img src={getLogoUrl(symbol)} alt={symbol} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
            ) : null}
            <span style={{ display: getLogoUrl(symbol) ? 'none' : 'block' }}>{symbol[0]}</span>
          </div>
          <div>
            <h2 className="text-gradient" style={{ margin: 0, fontSize: '2rem', letterSpacing: '-0.02em' }}>{symbol.replace(/_/g, ' ')}</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Historical Data up to {new Date(currentSimulatedDate).toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', tabularNums: 'tabular-nums' }}>₹{currentPrice.toFixed(2)}</h2>
          <span style={{ 
            color: changePct >= 0 ? 'var(--success)' : 'var(--danger)', 
            fontWeight: '600', fontSize: '1.1rem',
            display: 'inline-block', marginTop: '4px',
            padding: '4px 12px', borderRadius: '20px',
            backgroundColor: changePct >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}>
            {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}% (2M Change)
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
        {/* Left: Chart & Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '400px' }}>
          {/* Chart Container */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '8px', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
              {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map(tf => (
                <button 
                  key={tf} 
                  onClick={() => setTimeframe(tf)}
                  style={{
                    padding: '6px 16px', background: tf === timeframe ? 'var(--accent-primary)' : 'transparent',
                    color: tf === timeframe ? '#fff' : 'var(--text-muted)', border: 'none', borderRadius: '6px',
                    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.9rem'
                  }}
                  onMouseOver={(e) => { if(tf !== timeframe) e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { if(tf !== timeframe) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >{tf}</button>
              ))}
            </div>
            
            <div style={{ position: 'relative', flex: 1, width: '100%', minHeight: '400px' }}>
              <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}></div>
              {(() => {
                const MS_PER_DAY = 24 * 60 * 60 * 1000;
                const tfMap = { '1W': MS_PER_DAY * 7, '1M': MS_PER_DAY * 30, '3M': MS_PER_DAY * 90, '6M': MS_PER_DAY * 180, '1Y': MS_PER_DAY * 365, 'ALL': Infinity };
                const cutoff = currentSimulatedDate - (tfMap[timeframe] || tfMap['3M']);
                const count = assetData.history.filter(d => d.rawTimestamp >= cutoff).length;
                if (count < 2) {
                  return (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: 'var(--text-muted)', fontSize: '1.1rem', zIndex: 10 }}>
                      Not enough historical data available for this timeframe.
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Daily Stats */}
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '24px' }}>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulated Day High</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>₹{latestCandle.high?.toFixed(2) || '0.00'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulated Day Low</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>₹{latestCandle.low?.toFixed(2) || '0.00'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volume</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>{latestCandle.volume ? (latestCandle.volume / 1000000).toFixed(2) + 'M' : '0'}</span>
            </div>
          </div>
        </div>

        {/* Right: Order Ticket */}
        <div className="glass-panel" style={{ flex: '1 1 320px', maxWidth: '400px', minWidth: '300px', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', marginTop: 0 }}>Execute Order</h3>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 32px 0' }}>
            Available Capital: <strong style={{ color: 'var(--text-main)' }}>₹{virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
           </p>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '600' }}>QUANTITY</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0" 
                min="1"
                className="focus-ring"
                style={{ 
                  width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.3)', 
                  color: 'white', border: '1px solid var(--border-color)', fontSize: '1.5rem', fontWeight: 'bold',
                  textAlign: 'center', transition: 'all 0.2s'
                }} 
              />
            </div>
            
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Estimated Cost</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>₹{((parseInt(quantity) || 0) * currentPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginTop: 'auto', paddingTop: '24px' }}>
              <button 
                onClick={() => handleTrade('BUY')}
                disabled={isTrading || currentPrice === 0 || !quantity || quantity <= 0}
                style={{ 
                  flex: 1, padding: '16px', backgroundColor: 'var(--success)', color: '#000', border: 'none', 
                  borderRadius: '12px', fontWeight: '800', cursor: isTrading ? 'not-allowed' : 'pointer', 
                  fontSize: '1.1rem', letterSpacing: '0.05em', opacity: isTrading || currentPrice === 0 || !quantity || quantity <= 0 ? 0.3 : 1,
                  transition: 'opacity 0.2s, transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >BUY</button>
              <button 
                onClick={() => handleTrade('SELL')}
                disabled={isTrading || currentPrice === 0 || !quantity || quantity <= 0}
                style={{ 
                  flex: 1, padding: '16px', backgroundColor: 'var(--danger)', color: '#fff', border: 'none', 
                  borderRadius: '12px', fontWeight: '800', cursor: isTrading ? 'not-allowed' : 'pointer', 
                  fontSize: '1.1rem', letterSpacing: '0.05em', opacity: isTrading || currentPrice === 0 || !quantity || quantity <= 0 ? 0.3 : 1,
                  transition: 'opacity 0.2s, transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >SELL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
