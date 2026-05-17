import { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Briefcase, LineChart, BrainCircuit, GraduationCap, Clock } from 'lucide-react';
import styles from './Layout.module.css';
import useSimulationStore from '../../store/useSimulationStore';

export default function Layout() {
  const { currentSimulatedDate, isRunning, simulationSpeedMs, advanceTime, toggleSimulation } = useSimulationStore();
  
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
  
  // Format the simulation date beautifully
  const formattedDate = new Date(currentSimulatedDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className={styles.layout}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>AI</div>
          <h2>Portfoio<span className={styles.accent}>Sim</span></h2>
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
          <div className={styles.timeMachineStatus}>
            <Clock size={16} className={styles.clockIcon} />
            <span className={styles.currentDate}>{formattedDate}</span>
          </div>
          <button 
            className={`${styles.simToggleBtn} ${isRunning ? styles.btnStop : styles.btnPlay}`}
            onClick={toggleSimulation}
          >
            {isRunning ? 'PAUSE' : 'START SIM'}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.pageWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
