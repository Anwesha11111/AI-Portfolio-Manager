import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import useSimulationStore from '../store/useSimulationStore';
import { getGradientForSymbol, getLogoUrl } from '../utils/assetMap';
import { Loader, TrendingUp, TrendingDown, Wallet, PieChart, Activity, Coins, X, Info, ShieldAlert, BarChart2, Sparkles, BookOpen } from 'lucide-react';
import { generateTradeInsights } from '../utils/insightGenerator';
import { GlobalNewsFeed } from '../components/NewsFeed';
import AssetClassRadar from '../components/AssetClassRadar';

export default function Dashboard() {
  const { currentSimulatedDate } = useSimulationStore();
  const [loading, setLoading] = useState(true);
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [infoModalMetric, setInfoModalMetric] = useState(null);

  const debounceRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = isFirstLoad.current ? 0 : 800;

    debounceRef.current = setTimeout(async () => {
      if (isFirstLoad.current) setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch User Balance and Profile
        const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
        
        if (userError) {
          console.error("Error fetching user data:", userError);
          // Use default values if fetch fails
          setVirtualBalance(1000000);
          setUserProfile({
            monthly_income: 0,
            monthly_expenses: 0,
            virtual_balance: 1000000,
            time_horizon: 'long',
            drawdown_tolerance: 'medium',
            primary_objective: 'growth'
          });
        } else if (userData) {
          setVirtualBalance(Number(userData.virtual_balance || 0));
          setUserProfile(userData);
        }

        // Fetch Holdings
        const { data: holdingsData, error: holdingsError } = await supabase.from('holdings').select('*').eq('user_id', user.id);
        if (holdingsError) {
          console.error("Error fetching holdings:", holdingsError);
          setHoldings([]);
        } else {
          setHoldings(holdingsData || []);
        }

        // Fetch Transactions
        const { data: txData, error: txError } = await supabase.from('transactions').select('*').eq('user_id', user.id);
        if (txError) {
          console.error("Error fetching transactions:", txError);
          setTransactions([]);
        } else {
          setTransactions(txData || []);
        }

        // Fetch Market Prices to calculate P&L
        const marketJson = await useSimulationStore.getState().fetchMarketData('1M');
        
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
    return (
      <div className="page-loader">
        <Loader size={48} className="spin" color="var(--accent-primary)" />
      </div>
    );
  }

  // Calculate Metrics
  const investedValue = holdings.reduce((sum, h) => sum + (h.quantity * h.average_buy_price), 0);
  const currentValue = holdings.reduce((sum, h) => sum + (h.quantity * (marketData[h.symbol] || h.average_buy_price)), 0);
  const totalPandL = currentValue - investedValue;
  const totalPandLPct = investedValue > 0 ? (totalPandL / investedValue) * 100 : 0;
  const netWorth = virtualBalance + currentValue;
  
  // Debug: Log values to verify data is being fetched
  console.log('Dashboard Data:', { virtualBalance, holdingsCount: holdings.length, currentValue, investedValue, netWorth });

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="text-gradient">My Portfolio</h2>
        <p>Track your simulated investments and capital</p>
      </div>
      
      <div className="metric-grid" id="tour-metrics">
        {/* Net Worth */}
        <div className="glass-panel stat-card stat-card-blue">
          <div className="stat-card-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><Wallet size={14} color="var(--accent-primary)" style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Net Worth</span>
            <Info size={14} color="var(--text-muted)" title="Total value of your portfolio plus your available cash balance." onClick={() => setInfoModalMetric({ title: 'Net Worth', desc: 'Total value of your portfolio plus your available cash balance.' })} style={{ cursor: 'pointer' }} />
          </div>
          <p className="stat-card-value">₹{netWorth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <span className="stat-card-sub">Portfolio + Cash</span>
        </div>

        {/* Market Value */}
        <div className="glass-panel stat-card stat-card-purple">
          <div className="stat-card-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><PieChart size={14} color="var(--accent-secondary)" style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Market Value</span>
            <Info size={14} color="var(--text-muted)" title="The current total worth of all your active stock holdings." onClick={() => setInfoModalMetric({ title: 'Market Value', desc: 'The current total worth of all your active stock holdings.' })} style={{ cursor: 'pointer' }} />
          </div>
          <p className="stat-card-value">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <span className="stat-card-sub">Cost: ₹{investedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>

        {/* Total P&L */}
        <div className={`glass-panel stat-card ${totalPandL >= 0 ? 'stat-card-green' : 'stat-card-red'}`}>
          <div className="stat-card-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><Activity size={14} color={totalPandL >= 0 ? 'var(--success)' : 'var(--danger)'} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Total P&L</span>
            <Info size={14} color="var(--text-muted)" title="Total Profit or Loss calculated as (Current Market Value - Total Invested Amount)." onClick={() => setInfoModalMetric({ title: 'Total P&L', desc: 'Total Profit or Loss calculated as (Current Market Value - Total Invested Amount).' })} style={{ cursor: 'pointer' }} />
          </div>
          <p className="stat-card-value" style={{ color: totalPandL >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {totalPandL >= 0 ? '+' : ''}₹{totalPandL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: totalPandL >= 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {totalPandL >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {totalPandLPct.toFixed(2)}%
          </span>
        </div>

        {/* Available Capital */}
        <div className="glass-panel stat-card stat-card-green">
          <div className="stat-card-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><Coins size={14} color="var(--success)" style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Available Capital</span>
            <Info size={14} color="var(--text-muted)" title="Your uninvested cash that is available to buy more stocks." onClick={() => setInfoModalMetric({ title: 'Available Capital', desc: 'Your uninvested cash that is available to buy more stocks.' })} style={{ cursor: 'pointer' }} />
          </div>
          <p className="stat-card-value">₹{virtualBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <span className="stat-card-sub">Cash to invest</span>
        </div>

        {/* Holdings count */}
        <div className="glass-panel stat-card">
          <div className="stat-card-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><PieChart size={14} color="var(--text-muted)" style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Holdings</span>
            <Info size={14} color="var(--text-muted)" title="The total number of distinct companies you currently own shares in." onClick={() => setInfoModalMetric({ title: 'Holdings', desc: 'The total number of distinct companies you currently own shares in.' })} style={{ cursor: 'pointer' }} />
          </div>
          <p className="stat-card-value">{holdings.length}</p>
          <span className="stat-card-sub">Active positions</span>
        </div>
      </div>

      {/* Sector Allocation & Top Movers */}
      {holdings.length > 0 && (() => {
        const SECTOR_MAP = {
          'Banking': ['HDFC_BANK', 'ICICI_BANK', 'KOTAK_MAHINDRA', 'AXIS_BANK', 'SBI_BANK', 'BAJAJ_FINANCE', 'BAJAJ_FINSERV', 'HDFC_LIFE', 'SBI_LIFE', 'INDUS INDUSTRIES'],
          'IT': ['INFOSYS', 'TATA CONSULTANCY SERVICES', 'WIPRO', 'TECH_MAHINDRA', 'HCL_TECHNOLOIES'],
          'Auto': ['TATA MOTORS', 'MARUTI SUZUKI', 'BAJAJ AUTO', 'EICHER MOTOTRS', 'HERO MOTOCORP'],
          'Pharma': ['CIPLA', 'DIVIS LAB', 'APOLLO HOSPITALS', 'SUN_PHARMA'],
          'Consumer': ['HINDUSTAN UNILEVER', 'ITC', 'ASIAN PAINTS', 'TITAN', 'NESTLE', 'BRITANNIA', 'TATA CONSUMER PRODUCTS'],
          'Energy': ['RELIANCE', 'NTPC', 'POWERGRID', 'ONGC', 'ADANI_PORTS', 'ADANI_ENTERPRISES', 'COAL INDIA', 'ULTRATECH CEMENT', 'JSW STEEL', 'TATA STEEL', 'GRASIM', 'HINDALCO']
        };
        const SECTOR_COLORS = { Banking: '#3b82f6', IT: '#8b5cf6', Auto: '#f59e0b', Pharma: '#10b981', Consumer: '#ec4899', Energy: '#f97316', Other: '#6b7280' };

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

      <GlobalNewsFeed simulatedTimestamp={currentSimulatedDate} />
      <AssetClassRadar holdings={holdings} marketData={marketData} userProfile={userProfile} simulatedTimestamp={currentSimulatedDate} />

      <h3 className="section-heading">Current Holdings</h3>
      
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
                className="glass-panel asset-row"
                style={{ justifyContent: 'space-between', flexWrap: 'wrap', cursor: 'pointer' }}
                onClick={() => setSelectedHolding(asset)}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(79,142,247,0.25)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                {/* Left: Logo & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 180px', minWidth: 0 }}>
                  <div className="asset-logo" style={{ background: getGradientForSymbol(asset.symbol) }}>
                    {getLogoUrl(asset.symbol) ? (
                      <img src={getLogoUrl(asset.symbol)} alt={asset.symbol} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                    ) : null}
                    <span style={{ display: getLogoUrl(asset.symbol) ? 'none' : 'block' }}>{asset.symbol[0]}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.symbol}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{asset.quantity} shares</span>
                  </div>
                </div>

                {/* Middle: Prices */}
                <div style={{ display: 'flex', gap: '20px', flex: '1 1 160px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Avg Cost</span>
                    <span style={{ fontSize: '1rem', fontWeight: '700' }}>₹{asset.average_buy_price.toFixed(2)}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>LTP</span>
                    <span style={{ fontSize: '1rem', fontWeight: '700' }}>₹{currentPrice.toFixed(2)}</span>
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

      {selectedHolding && (
        <InsightModal 
          holding={selectedHolding}
          marketPrice={marketData[selectedHolding.symbol] || selectedHolding.average_buy_price}
          transactions={transactions}
          userProfile={userProfile}
          currentSimulatedDate={currentSimulatedDate}
          onClose={() => setSelectedHolding(null)}
        />
      )}

      {infoModalMetric && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel animate-fade-in-up" style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '24px', position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setInfoModalMetric(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={20} color="var(--accent-primary)" />
              {infoModalMetric.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
              {infoModalMetric.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightModal({ holding, marketPrice, transactions, userProfile, currentSimulatedDate, onClose }) {
  const symbolTxs = transactions.filter(t => t.symbol === holding.symbol).sort((a,b) => a.simulated_date - b.simulated_date);
  const firstTxDate = symbolTxs.length > 0 ? symbolTxs[0].simulated_date : currentSimulatedDate;
  
  const insights = generateTradeInsights(holding, marketPrice, currentSimulatedDate, firstTxDate, userProfile);
  
  const assetValue = marketPrice * holding.quantity;
  const invested = holding.average_buy_price * holding.quantity;
  const pnl = assetValue - invested;
  const pnlPct = ((marketPrice - holding.average_buy_price) / holding.average_buy_price) * 100;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel animate-fade-in-up" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', padding: '32px', position: 'relative', background: 'var(--bg-card)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24}/></button>
        
        <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles color="var(--accent-primary)" /> 
          Trade Post-Mortem: {holding.symbol}
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 24px 0' }}>AI-driven analysis and insights for your position.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><Info size={16}/> Core Details</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Ticker</span> <strong>{holding.symbol}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>First Purchase</span> <strong>{new Date(firstTxDate).toLocaleDateString()}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Quantity</span> <strong>{holding.quantity} shares</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Avg Price</span> <strong>₹{holding.average_buy_price.toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Total Invested</span> <strong>₹{invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><BarChart2 size={16}/> Performance Metrics</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Current Value</span> <strong>₹{assetValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Profit/Loss</span> <strong style={{ color: pnl >= 0 ? 'var(--success)' : 'var(--danger)' }}>{pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({pnlPct.toFixed(2)}%)</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Holding Period</span> <strong>{insights.holdingDays} days</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Est. Benchmark</span> <strong style={{ color: insights.outperforming ? 'var(--success)' : 'var(--danger)' }}>{insights.outperforming ? 'Outperforming' : 'Underperforming'} ({insights.benchmarkPct.toFixed(2)}%)</strong></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>Stock Risk Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: insights.assetRisk > 70 ? 'var(--danger)' : (insights.assetRisk < 40 ? 'var(--success)' : 'var(--accent-secondary)') }}>{insights.assetRisk}/100</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold' }}>Profile Suitability</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: insights.suitability > 70 ? 'var(--success)' : (insights.suitability < 40 ? 'var(--danger)' : 'var(--accent-primary)') }}>{insights.suitability}% Match</div>
          </div>
        </div>

        <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={20} color="var(--accent-secondary)" /> Learning Insights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outcome Reason</strong>
            <span>{insights.reason}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pattern Recognition</strong>
            <span>{insights.pattern}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Lesson</strong>
              <span>{insights.riskLesson}</span>
            </div>
            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Timing Lesson</strong>
              <span>{insights.timingLesson}</span>
            </div>
          </div>
        </div>

        <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={20} color="var(--accent-primary)" /> Educational Takeaways</h3>
        <div style={{ background: 'rgba(79, 142, 247, 0.05)', border: '1px solid rgba(79, 142, 247, 0.2)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Key Takeaway:</span> {insights.takeaway}
          </div>
          <div>
            <span style={{ fontWeight: 'bold', color: '#c084fc' }}>Strategy Tweak:</span> {insights.tweak}
          </div>
        </div>
      </div>
    </div>
  );
}
