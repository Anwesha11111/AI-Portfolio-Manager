import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import useSimulationStore from '../store/useSimulationStore';
import { getGradientForSymbol } from '../utils/assetMap';
import { Loader, TrendingUp, TrendingDown, Wallet, PieChart, Activity } from 'lucide-react';

export default function Dashboard() {
  const { currentSimulatedDate } = useSimulationStore();
  const [loading, setLoading] = useState(true);
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [marketData, setMarketData] = useState({});

  const debounceRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = isFirstLoad.current ? 0 : 800;

    debounceRef.current = setTimeout(async () => {
      if (isFirstLoad.current) setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Balance
        const { data: userData } = await supabase.from('users').select('virtual_balance').eq('id', user.id).maybeSingle();
        setVirtualBalance(Number(userData?.virtual_balance || 0));

        // Fetch Holdings
        const { data: holdingsData } = await supabase.from('holdings').select('*').eq('user_id', user.id);
        setHoldings(holdingsData || []);

        // Fetch Market Prices to calculate P&L
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/batch?date=${currentSimulatedDate}&timeframe=1M`);
        const marketJson = await res.json();
        
        if (Array.isArray(marketJson)) {
          const mData = {};
          marketJson.forEach(a => mData[a.symbol] = a.price);
          setMarketData(mData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
      setLoading(false);
      isFirstLoad.current = false;
    }, delay);

    return () => clearTimeout(debounceRef.current);
  }, [currentSimulatedDate]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader size={48} className="spin" color="var(--accent-primary)" /></div>;
  }

  // Calculate Metrics
  const investedValue = holdings.reduce((sum, h) => sum + (h.quantity * h.average_buy_price), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.quantity * (marketData[h.symbol] || h.average_buy_price)), 0);
  const totalPandL = currentValue - investedValue;
  const totalPandLPct = investedValue > 0 ? (totalPandL / investedValue) * 100 : 0;
  const netWorth = virtualBalance + currentValue;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '2rem', fontWeight: '800' }}>My Portfolio</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Wallet size={18} /> <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Net Worth</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0 }}>₹{netWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Wallet size={18} /> <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Cash Balance</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0 }}>₹{virtualBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Available to invest</span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <PieChart size={18} /> <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Market Value</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0 }}>₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cost Basis: ₹{investedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Activity size={18} /> <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Total P&L</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0, color: totalPandL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {totalPandL >= 0 ? '+' : ''}₹{totalPandL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </h3>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: totalPandL >= 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {totalPandL >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {totalPandLPct.toFixed(2)}%
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <PieChart size={18} /> <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Holdings</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{holdings.length}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active positions</span>
        </div>
      </div>

      {/* Sector Allocation & Top Movers */}
      {holdings.length > 0 && (() => {
        const SECTOR_MAP = {
          'Banking': ['HDFC_BANK','ICICI_BANK','KOTAK_BANK','AXIS_BANK','SBI','BAJAJ_FINANCE','BAJAJ_FINSERV','HDFC_LIFE','SBI_LIFE','INDUS_INDUSTRIES'],
          'IT': ['INFOSYS','TCS','WIPRO','TECH_MAHINDRA','HCL_TECH','LTIMINDTREE'],
          'Auto': ['TATA_MOTORS','MARUTI','MAHINDRA','BAJAJ_AUTO','EICHER_MOTORS','HERO_MOTO'],
          'Pharma': ['CIPLA','DIVIS_LABS','DRREDDYS','APOLLO_HOSPITALS','SUN_PHARMA'],
          'Consumer': ['HINDUSTAN_UNILEVER','ITC','ASIAN_PAINTS','TITAN','NESTLE','BRITANNIA'],
          'Energy': ['RELIANCE','NTPC','POWERGRID','ONGC','ADANI_PORTS','ADANI_ENTERPRISES','COAL_INDIA','ULTRATECH','JSW_STEEL','TATA_STEEL','GRASIM','HINDALCO']
        };
        const SECTOR_COLORS = { Banking: '#3b82f6', IT: '#8b5cf6', Auto: '#f59e0b', Pharma: '#10b981', Consumer: '#ec4899', Energy: '#f97316' };

        const sectorAlloc = {};
        holdings.forEach(h => {
          const val = h.quantity * (marketData[h.symbol] || h.average_buy_price);
          let sector = 'Other';
          for (const [s, symbols] of Object.entries(SECTOR_MAP)) {
            if (symbols.includes(h.symbol)) { sector = s; break; }
          }
          sectorAlloc[sector] = (sectorAlloc[sector] || 0) + val;
        });
        const totalAlloc = Object.values(sectorAlloc).reduce((a,b) => a+b, 0);

        // Top gainers/losers
        const holdingsWithPnl = holdings.map(h => {
          const cp = marketData[h.symbol] || h.average_buy_price;
          const pnlPct = ((cp - h.average_buy_price) / h.average_buy_price) * 100;
          return { ...h, currentPrice: cp, pnlPct };
        });
        const sorted = [...holdingsWithPnl].sort((a,b) => b.pnlPct - a.pnlPct);
        const topGainers = sorted.filter(h => h.pnlPct > 0).slice(0, 3);
        const topLosers = sorted.filter(h => h.pnlPct < 0).reverse().slice(0, 3);

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {/* Sector Allocation */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Sector Allocation</h4>
              {/* Visual bar */}
              <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '12px', marginBottom: '16px' }}>
                {Object.entries(sectorAlloc).map(([sector, val]) => (
                  <div key={sector} style={{ width: `${(val/totalAlloc)*100}%`, background: SECTOR_COLORS[sector] || '#6b7280', transition: 'width 0.3s' }} title={`${sector}: ${((val/totalAlloc)*100).toFixed(1)}%`} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(sectorAlloc).sort((a,b) => b[1]-a[1]).map(([sector, val]) => (
                  <div key={sector} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: SECTOR_COLORS[sector] || '#6b7280' }} />
                      <span style={{ fontSize: '0.9rem' }}>{sector}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{((val/totalAlloc)*100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Movers */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Top Movers</h4>
              {topGainers.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Top Gainers</span>
                  {topGainers.map(h => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ fontWeight: '600' }}>{h.symbol}</span>
                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+{h.pnlPct.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              )}
              {topLosers.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Top Losers</span>
                  {topLosers.map(h => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ fontWeight: '600' }}>{h.symbol}</span>
                      <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{h.pnlPct.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              )}
              {topGainers.length === 0 && topLosers.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No significant movers yet.</p>
              )}
            </div>
          </div>
        );
      })()}

      <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Current Holdings</h3>
      
      {holdings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>Your portfolio is empty</h4>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Head over to the Market to discover assets and execute your first trade.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {holdings.map((asset) => {
            const currentPrice = marketData[asset.symbol] || asset.average_buy_price;
            const assetValue = currentPrice * asset.quantity;
            const pnl = assetValue - (asset.average_buy_price * asset.quantity);
            const pnlPct = ((currentPrice - asset.average_buy_price) / asset.average_buy_price) * 100;

            return (
              <div 
                key={asset.id}
                className="glass-panel"
                style={{
                  borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'
                }}
              >
                {/* Left: Logo & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 200px' }}>
                  <div style={{
                    width: '42px', height: '42px', background: getGradientForSymbol(asset.symbol), borderRadius: '8px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: 'white',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)', flexShrink: 0
                  }}>
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>{asset.symbol}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{asset.quantity} Shares</span>
                  </div>
                </div>

                {/* Middle: Prices */}
                <div style={{ display: 'flex', gap: '32px', flex: '1 1 200px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>Avg Cost</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{asset.average_buy_price.toFixed(2)}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>LTP</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{currentPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Right: P&L */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: '1 1 150px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Total Return</span>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: pnl >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: pnl >= 0 ? 'var(--success)' : 'var(--danger)',
                    padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem'
                  }}>
                    {pnl >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {pnl > 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({pnl > 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
