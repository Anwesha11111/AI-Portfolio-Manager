import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Briefcase, LineChart, BrainCircuit, GraduationCap, Settings, User } from 'lucide-react';
import styles from './Layout.module.css';
import useSimulationStore from '../../store/useSimulationStore';
import { supabase } from '../../lib/supabase';
import SettingsModal from './SettingsModal';
import ProfileModal from './ProfileModal';

export default function Layout() {
  const { isRunning, simulationSpeedMs, advanceTime, loadSavedDate, saveDate, currentSimulatedDate } = useSimulationStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  // Monthly Income Accrual — credit surplus when simulation crosses a month boundary
  useEffect(() => {
    const simDate = new Date(currentSimulatedDate);
    const monthKey = `${simDate.getFullYear()}-${simDate.getMonth()}`;
    
    if (lastCreditedMonth.current === null) {
      // First render, just set the ref without crediting
      lastCreditedMonth.current = monthKey;
      return;
    }

    if (monthKey !== lastCreditedMonth.current) {
      lastCreditedMonth.current = monthKey;
      // Credit monthly surplus
      (async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { data: userData } = await supabase.from('users').select('virtual_balance, monthly_income, monthly_expenses').eq('id', user.id).maybeSingle();
          if (!userData) return;
          const surplus = Math.max(0, (userData.monthly_income || 0) - (userData.monthly_expenses || 0));
          if (surplus > 0) {
            const newBalance = Number(userData.virtual_balance) + surplus;
            await supabase.from('users').update({ virtual_balance: newBalance }).eq('id', user.id);
          }
        } catch (err) {
          console.error('Monthly accrual failed:', err);
        }
      })();
    }
  }, [currentSimulatedDate]);

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

  return (
    <div className={styles.layout}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>AI</div>
          <h2>Portfolio<span className={styles.accent}>Sim</span></h2>
        </div>
        
        <div className={styles.navLinks}>
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
            onClick={() => setIsProfileOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            title="Profile & Settings"
          >
            <User size={20} />
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            title="Simulation Controls"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.pageWrapper}>
          <Outlet />
        </div>
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
}
