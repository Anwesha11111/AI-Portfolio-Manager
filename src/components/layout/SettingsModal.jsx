import { X, Clock, Zap, BrainCircuit, Play, Pause } from 'lucide-react';
import useSimulationStore from '../../store/useSimulationStore';

export default function SettingsModal({ onClose }) {
  const { 
    currentSimulatedDate, isRunning, simulationSpeedMs, 
    toggleSimulation, setSimulationSpeed 
  } = useSimulationStore();

  const formattedDate = new Date(currentSimulatedDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '16px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <Zap size={24} className="text-accent" /> Control Center
        </h2>

        {/* Time Machine Controls */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> Time Machine Engine
          </h3>
          
          <div style={{ padding: '16px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Simulated Date</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formattedDate}</span>
            </div>
            
            <button 
              onClick={toggleSimulation}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                backgroundColor: isRunning ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-primary)',
                color: isRunning ? 'var(--danger)' : 'white'
              }}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? 'PAUSE ENGINE' : 'START ENGINE'}
            </button>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '12px' }}>
              Simulation Speed
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setSimulationSpeed(60000)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: simulationSpeedMs === 60000 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >Slow (1d = 60s)</button>
              <button 
                onClick={() => setSimulationSpeed(10000)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: simulationSpeedMs === 10000 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >Fast (1d = 10s)</button>
              <button 
                onClick={() => setSimulationSpeed(1000)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: simulationSpeedMs === 1000 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >Hyper (1d = 1s)</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
