import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, GraduationCap, Settings, LogOut, ChevronRight, Menu, X, User, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import styles from './Layout.module.css';
import useSimulationStore from '../../store/useSimulationStore';
import { supabase } from '../../lib/supabase';
import SettingsModal from './SettingsModal';
import ProfileModal from './ProfileModal';
import TourOverlay from './TourOverlay';

export default function Layout() {
  const { isRunning, simulationSpeedMs, advanceTime, loadSavedDate, saveDate, currentSimulatedDate, initialized } = useSimulationStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const lastCreditedMonth = useRef(null);
  
  // Load saved simulation date on mount
  useEffect(() => {
    loadSavedDate();
  }, []);

  // Auto-save the simulation date every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveDate();
    }, 30000);
    return () => clearInterval(saveInterval);
  }, []);

  // Save on page unload too
  useEffect(() => {
    const handleUnload = () => saveDate();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Monthly Income Accrual — credit surplus when simulation crosses month boundaries
  useEffect(() => {
    // Don't run until the saved date has been loaded from Supabase
    // Otherwise we'd compare default START_DATE with the loaded date and credit phantom months
    if (!initialized) return;

    const simDate = new Date(currentSimulatedDate);
    const currentYear = simDate.getFullYear();
    const currentMonth = simDate.getMonth();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    if (lastCreditedMonth.current === null) {
      // First run after initialization, just set the ref without crediting
      lastCreditedMonth.current = monthKey;
      return;
    }

    if (monthKey !== lastCreditedMonth.current) {
      // Calculate how many months were skipped
      const [prevYear, prevMonth] = lastCreditedMonth.current.split('-').map(Number);
      const monthsSkipped = (currentYear - prevYear) * 12 + (currentMonth - prevMonth);
      
      lastCreditedMonth.current = monthKey;
      
      // Only credit if we moved forward (not backward)
      if (monthsSkipped > 0) {
        (async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: userData } = await supabase.from('users').select('virtual_balance, monthly_income, monthly_expenses').eq('id', user.id).maybeSingle();
            if (!userData) return;
            const surplus = Math.max(0, (userData.monthly_income || 0) - (userData.monthly_expenses || 0));
            if (surplus > 0) {
              const totalCredit = surplus * monthsSkipped;
              const newBalance = Number(userData.virtual_balance) + totalCredit;
              await supabase.from('users').update({ virtual_balance: newBalance }).eq('id', user.id);
            }
          } catch (err) {
            console.error('Monthly accrual failed:', err);
          }
        })();
      }
    }
  }, [currentSimulatedDate, initialized]);

  // Stop-Loss Automation Engine
  const lastStopLossCheck = useRef(0);
  const { fetchMarketData } = useSimulationStore(state => state);

  useEffect(() => {
    const checkStopLosses = async () => {
      // Throttle to max 1 check per 1500ms of real time to avoid API spam during fast simulation
      const now = Date.now();
      if (now - lastStopLossCheck.current < 1500) return;
      lastStopLossCheck.current = now;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get holdings with active stop losses
        const { data: holdings } = await supabase.from('holdings').select('*').eq('user_id', user.id).not('stop_loss_pct', 'is', null);
        if (!holdings || holdings.length === 0) return;

        // Fetch current market prices
        const marketData = await fetchMarketData('1M');
        if (!marketData || marketData.length === 0) return;

        const priceMap = {};
        marketData.forEach(item => { priceMap[item.symbol] = item.price; });

        // Get user balance for updates
        const { data: userData } = await supabase.from('users').select('virtual_balance').eq('id', user.id).single();
        let currentBalance = Number(userData?.virtual_balance || 0);
        let balanceUpdated = false;

        for (const holding of holdings) {
          const currentPrice = priceMap[holding.symbol];
          if (!currentPrice || currentPrice === 0) continue;

          const thresholdPrice = holding.average_buy_price * (1 - (holding.stop_loss_pct / 100));
          
          if (currentPrice <= thresholdPrice) {
            // Trigger Stop Loss Sell
            const saleProceeds = holding.quantity * currentPrice;
            currentBalance += saleProceeds;
            balanceUpdated = true;

            await supabase.from('holdings').delete().eq('id', holding.id);
            await supabase.from('transactions').insert({ 
              user_id: user.id, symbol: holding.symbol, type: 'SELL', 
              quantity: holding.quantity, price_per_unit: currentPrice, 
              simulated_date: currentSimulatedDate 
            });

            alert(`🛑 STOP LOSS EXECUTED: Sold ${holding.quantity} shares of ${holding.symbol} at ₹${currentPrice.toFixed(2)} (Dropped below ${holding.stop_loss_pct}% loss limit)`);
          }
        }

        if (balanceUpdated) {
          await supabase.from('users').update({ virtual_balance: currentBalance }).eq('id', user.id);
        }
      } catch (err) {
        console.error("Stop Loss check failed:", err);
      }
    };

    if (isRunning) {
      checkStopLosses();
    }
  }, [currentSimulatedDate, isRunning]);

  // The Core Time Engine Loop
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        advanceTime(1);
      }, simulationSpeedMs);
    }
    return () => clearInterval(interval);
  }, [isRunning, simulationSpeedMs, advanceTime]);

  const [niftyData, setNiftyData] = useState(null);

  // Fetch Global Ticker Data
  useEffect(() => {
    if (!currentSimulatedDate) return;
    const fetchNifty = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/benchmark?date=${currentSimulatedDate}`);
        const data = await res.json();
        setNiftyData(data);
      } catch (err) {
        console.error("Failed to fetch benchmark:", err);
      }
    };
    
    const timeoutId = setTimeout(fetchNifty, 300); // Debounce to prevent spamming
    return () => clearTimeout(timeoutId);
  }, [currentSimulatedDate]);

  return (
    <div className={styles.layout}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo} id="tour-logo">
          <div className={styles.logoIcon}>TW</div>
          <h2>Trade<span className={styles.accent}>Wise</span></h2>
        </div>
        
        <div className={styles.navLinks} id="tour-nav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            <Briefcase size={18} /> Portfolio
          </NavLink>
          <NavLink to="/market" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            <LineChart size={18} /> Market
          </NavLink>
          <NavLink to="/analysis" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            <BrainCircuit size={18} /> AI Analysis
          </NavLink>
          <NavLink to="/academy" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            <GraduationCap size={18} /> Academy
          </NavLink>
        </div>

        <div className={styles.navRight} style={{ display: 'flex', gap: '12px' }}>
          <button 
            id="tour-profile"
            onClick={() => setIsProfileOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            title="Profile & Settings"
          >
            <User size={20} />
          </button>

          <button 
            id="tour-settings"
            onClick={() => setIsSettingsOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            title="Simulation Speed & Time Controls"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.pageWrapper}>
          {/* GLOBAL MARKET TICKER */}
          {niftyData && niftyData.price > 0 && (
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.4)', 
              borderBottom: '1px solid var(--border-color)',
              padding: '10px 24px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
              fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)'
            }}>
              <span style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>{niftyData.symbol}</span>
              <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 'bold' }}>
                {niftyData.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px', 
                padding: '4px 10px', borderRadius: '6px',
                backgroundColor: niftyData.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: niftyData.change >= 0 ? 'var(--success)' : 'var(--danger)'
              }}>
                {niftyData.change >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                {niftyData.change >= 0 ? '+' : ''}{niftyData.change.toFixed(2)}% (1D)
              </span>
            </div>
          )}

          {/* This is the React Router Outlet where your pages load */}
          <Outlet />
        </div>
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} onStartTour={() => setIsTourActive(true)} />}
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
      {isTourActive && <TourOverlay onEnd={() => setIsTourActive(false)} />}
    </div>
  );
}
