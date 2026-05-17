import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { createChart } from 'lightweight-charts';
import useSimulationStore from '../store/useSimulationStore';

export default function AssetDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const currentSimulatedDate = useSimulationStore(state => state.currentSimulatedDate);
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data strictly up to the current simulated date
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/market/${symbol}?date=${currentSimulatedDate}`;
        const response = await fetch(url);
        const data = await response.json();
        setAssetData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch asset data:", err);
        setLoading(false);
      }
    };
    
    // We only fetch on mount or if they switch symbols.
    // In a production app, we would fetch the next candle on every tick,
    // but for the hackathon MVP, fetching the chunk once and rendering is fine, 
    // or refetching on a slower interval. For now, fetch whenever time jumps significantly.
    fetchData();
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

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Format data for lightweight-charts
    const chartData = assetData.history.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close
    }));

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
  }, [assetData]); // Re-render chart if assetData changes

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader size={48} className="spin" color="var(--accent-primary)" />
    </div>;
  }

  if (!assetData) return <div>Asset not found.</div>;

  const currentPrice = assetData.currentPrice;
  const changePct = assetData.twoMonthChangePct;
  const latestCandle = assetData.history[assetData.history.length - 1] || {};

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
            <span style={{ color: 'var(--text-muted)' }}>Historical Data up to {new Date(currentSimulatedDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>₹{currentPrice.toFixed(2)}</h2>
          <span style={{ color: changePct >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
            {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}% (2M Change)
          </span>
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
            <div style={{ display: 'flex', gap: '8px', padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
              {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
                <button key={tf} style={{
                  padding: '6px 12px', background: tf === '6M' ? 'var(--accent-primary)' : 'transparent',
                  color: tf === '6M' ? '#fff' : 'var(--text-muted)', border: 'none', borderRadius: '4px',
                  fontWeight: '600', cursor: 'pointer'
                }}>{tf}</button>
              ))}
            </div>
            
            <div ref={chartContainerRef} style={{ flex: 1, width: '100%' }}></div>
          </div>

          {/* Daily Stats */}
          <div style={{
             backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', 
             padding: '24px', display: 'flex', justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Simulated Day High</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{latestCandle.high?.toFixed(2) || '0.00'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Simulated Day Low</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{latestCandle.low?.toFixed(2) || '0.00'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>Volume</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{latestCandle.volume ? (latestCandle.volume / 1000000).toFixed(2) + 'M' : '0'}</span>
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
