import { X, Clock, Zap, BrainCircuit, Play, Pause } from 'lucide-react';
import useSimulationStore from '../../store/useSimulationStore';

export default function SettingsModal({ onClose }) {
  const { 
    currentSimulatedDate, isRunning, simulationSpeedMs, 
    toggleSimulation, setSimulationSpeed, 
    aiHelpEnabled, toggleAiHelp 
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
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
              <span>Simulation Speed</span>
              <span>{simulationSpeedMs === 60000 ? '1 Day = 60s' : simulationSpeedMs === 10000 ? '1 Day = 10s' : '1 Day = 1s'}</span>
            </label>
            <input 
              type="range" min="1000" max="60000" step="1000"
              value={simulationSpeedMs}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

        {/* AI Features */}
        <div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={16} /> AI Integrations
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>AI Investment Assistant</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Displays best stock predictions on the market.</span>
            </div>
            
            {/* Toggle Switch */}
            <div 
              onClick={toggleAiHelp}
              style={{
                width: '50px', height: '26px', backgroundColor: aiHelpEnabled ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%',
                position: 'absolute', top: '2px', left: aiHelpEnabled ? '26px' : '2px', transition: 'all 0.3s'
              }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
