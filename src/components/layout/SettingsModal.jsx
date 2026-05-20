import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Clock, Zap, Play, Pause, RotateCcw, Trash2, Compass, Palette } from 'lucide-react';
import useSimulationStore from '../../store/useSimulationStore';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import { supabase } from '../../lib/supabase';

export default function SettingsModal({ onClose, onStartTour }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
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
    if (val.length > inputValue.length) {
      const digitsOnly = val.replace(/[^\d]/g, '');
      if (digitsOnly.length >= 2 && val.length === 2) val += '/';
      if (digitsOnly.length >= 4 && val.length === 5 && (val.match(/\//g) || []).length === 1) val += '/';
    }
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
    setInputValue(displayDate);
  };

  const handleReset = async () => {
    const confirmed = window.confirm('⚠️ Are you sure you want to reset your account?\n\nThis will:\n• Reset your balance, salary, and expenses\n• Delete all your holdings and transactions\n• Reset your tutorial progress\n• Take you back to the onboarding screen\n\nThis action cannot be undone.');
    if (!confirmed) return;
    const doubleConfirm = window.confirm('This is your last chance. All your portfolio data will be permanently deleted. Continue?');
    if (!doubleConfirm) return;
    try {
      await supabase.from('holdings').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('users').update({
        virtual_balance: 1000000, monthly_income: 0, monthly_expenses: 0, total_savings: 0,
        current_simulated_date: 1104537600000, time_horizon: 'long', drawdown_tolerance: 'medium',
        primary_objective: 'growth', completed_lessons: '{}', last_ai_recommendation_date: 0
      }).eq('id', user.id);
      onClose();
      navigate('/onboarding');
    } catch (err) {
      console.error('Reset failed:', err);
      alert('Failed to reset account. Please try again.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('🚨 DANGER: Are you sure you want to permanently delete your account?\n\nThis will:\n• Delete your entire profile\n• Delete all holdings and transactions\n• Remove your account completely\n\nThis action is IRREVERSIBLE.');
    if (!confirmed) return;
    const doubleConfirm = window.confirm('Final confirmation: Are you absolutely sure you want to delete your account forever?');
    if (!doubleConfirm) return;
    try {
      await supabase.rpc('delete_user');
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete account. Please try again.');
    }
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
        position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        maxHeight: '90vh', overflowY: 'auto'
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
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--border-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={16} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '1.5rem', fontWeight: '800' }}>
          <Zap size={24} className="text-accent" /> Settings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
          Manage simulation, time travel, and account settings.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Current Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Current Date</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
              <Clock size={20} className="text-accent" />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{formattedDate}</span>
            </div>
          </div>
          
          {/* Jump + Engine */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Jump to Date</label>
              <input 
                type="text" 
                placeholder="DD/MM/YYYY"
                value={inputValue}
                onChange={handleDateChange}
                onBlur={(e) => { handleDateBlur(); e.target.style.borderColor = 'var(--border-color)'; }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleDateBlur(); }}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: '1px solid var(--border-color)', background: 'transparent',
                  color: 'var(--text-main)', outline: 'none', colorScheme: 'inherit',
                  fontFamily: 'inherit', fontSize: '0.9rem', transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
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
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = isRunning ? 'rgba(248, 113, 113, 0.25)' : 'rgba(52, 211, 153, 0.25)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = isRunning ? 'rgba(248, 113, 113, 0.15)' : 'rgba(52, 211, 153, 0.15)'; }}
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? 'Pause Engine' : 'Start Engine'}
              </button>
            </div>
          </div>
          
          {/* Speed */}
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
                    backgroundColor: simulationSpeedMs === opt.speed ? 'var(--border-hover)' : 'transparent', 
                    color: simulationSpeedMs === opt.speed ? 'var(--text-main)' : 'var(--text-muted)', 
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { if (simulationSpeedMs !== opt.speed) e.currentTarget.style.color = 'var(--text-main)'; }}
                  onMouseOut={(e) => { if (simulationSpeedMs !== opt.speed) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{opt.label}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
              App Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'midnight', label: 'Midnight Purple' },
                { id: 'wallstreet', label: 'Wall Street Classic' },
                { id: 'oled', label: 'OLED Pitch Black' },
                { id: 'cyberpunk', label: 'Neon Cyberpunk' },
                { id: 'arctic', label: 'Arctic / Nord' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    padding: '10px 12px', borderRadius: '8px', border: '1px solid',
                    borderColor: theme === t.id ? 'var(--accent-primary)' : 'var(--border-color)',
                    backgroundColor: theme === t.id ? 'var(--accent-glow)' : 'transparent',
                    color: theme === t.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                    cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', fontWeight: theme === t.id ? 'bold' : 'normal',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                  onMouseOver={(e) => { if (theme !== t.id) e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                  onMouseOut={(e) => { if (theme !== t.id) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <Palette size={14} style={{ color: theme === t.id ? 'var(--accent-primary)' : 'inherit' }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-color)' }} />

          {/* Tour */}
          <button 
            onClick={() => { onClose(); if (onStartTour) onStartTour(); }}
            style={{
              width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'; }}
          >
            <Compass size={18} />
            Take a Tour of TradeWise
          </button>

          {/* Danger Zone */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: '600' }}>Danger Zone</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleReset}
                style={{
                  flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.08)'; }}
              >
                <RotateCcw size={15} />
                Reset Account
              </button>
              <button 
                onClick={handleDelete}
                style={{
                  flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'; }}
              >
                <Trash2 size={15} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
