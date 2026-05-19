import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Briefcase, LineChart, BrainCircuit, GraduationCap, Settings } from 'lucide-react';
import styles from './Layout.module.css';
import useSimulationStore from '../../store/useSimulationStore';
import SettingsModal from './SettingsModal';

export default function Layout() {
  const { isRunning, simulationSpeedMs, advanceTime } = useSimulationStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // The Core Time Engine Loop
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        advanceTime(1); // Advance by 1 day every tick
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

        <div className={styles.navRight}>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{
              background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
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
    </div>
  );
}
