import { useState, useEffect } from 'react';
import { X, Clock, Zap, BrainCircuit, Play, Pause } from 'lucide-react';
import useSimulationStore from '../../store/useSimulationStore';

export default function SettingsModal({ onClose }) {
  const { 
    currentSimulatedDate, isRunning, simulationSpeedMs, 
    toggleSimulation, setSimulationSpeed, setSimulatedDate
  } = useSimulationStore();

  const formattedDate = new Date(currentSimulatedDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const dateObj = new Date(currentSimulatedDate);
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  const displayDate = `${dd}/${mm}/${yyyy}`;

  const [inputValue, setInputValue] = useState(displayDate);

  useEffect(() => {
    setInputValue(displayDate);
  }, [displayDate]);

  const handleDateChange = (e) => {
    let val = e.target.value;
    // Only auto-add slashes when input is growing (not on backspace)
    if (val.length > inputValue.length) {
      // Strip non-digit and non-slash chars
      const digitsOnly = val.replace(/[^\d]/g, '');
      if (digitsOnly.length >= 2 && val.length === 2) val += '/';
      if (digitsOnly.length >= 4 && val.length === 5 && (val.match(/\//g) || []).length === 1) val += '/';
    }
    // Max length DD/MM/YYYY = 10 chars
    if (val.length <= 10) {
      setInputValue(val);
    }
  };

  const handleDateBlur = () => {
    const parts = inputValue.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if (d > 0 && d <= 31 && m > 0 && m <= 12 && y >= 2005 && y <= 2023) {
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        setSimulatedDate(iso);
        return;
      }
    }
    // Revert if invalid
    setInputValue(displayDate);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in-scale" style={{
        width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '20px',
        position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)'
      }}>
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '24px', right: '24px', 
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', 
            borderRadius: '50%', width: '32px', height: '32px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <X size={16} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '1.5rem', fontWeight: '800' }}>
          <Zap size={24} className="text-accent" /> Control Center
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Manage your simulation engine and time travel settings.
        </p>

        {/* Time Machine Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Current Date</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
              <Clock size={20} className="text-accent" />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formattedDate}</span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Jump to Date</label>
              <input 
                type="text" 
                placeholder="DD/MM/YYYY"
                value={inputValue}
                onChange={handleDateChange}
                onBlur={handleDateBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDateBlur();
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'white',
                  outline: 'none',
                  colorScheme: 'dark',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'flex-end' }}>
              <button 
                onClick={toggleSimulation}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                  backgroundColor: isRunning ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                  color: isRunning ? 'var(--danger)' : 'var(--success)',
                  transition: 'all 0.2s',
                  border: `1px solid ${isRunning ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)'}`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isRunning ? 'rgba(248, 113, 113, 0.25)' : 'rgba(52, 211, 153, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isRunning ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)';
                }}
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? 'Pause Engine' : 'Start Engine'}
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
              Simulation Speed
            </label>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {[
                { speed: 60000, label: 'Slow', sub: '1d=60s' },
                { speed: 10000, label: 'Fast', sub: '1d=10s' },
                { speed: 1000, label: 'Hyper', sub: '1d=1s' }
              ].map((opt) => (
                <button 
                  key={opt.speed}
                  onClick={() => setSimulationSpeed(opt.speed)}
                  style={{ 
                    flex: 1, padding: '10px 4px', borderRadius: '8px', border: 'none', 
                    backgroundColor: simulationSpeedMs === opt.speed ? 'rgba(255,255,255,0.1)' : 'transparent', 
                    color: simulationSpeedMs === opt.speed ? 'white' : 'var(--text-muted)', 
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { if (simulationSpeedMs !== opt.speed) e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { if (simulationSpeedMs !== opt.speed) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{opt.label}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
