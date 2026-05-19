import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const [horizon, setHorizon] = useState('long');
  const [tolerance, setTolerance] = useState('medium');
  const [objective, setObjective] = useState('growth');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            time_horizon: horizon,
            drawdown_tolerance: tolerance,
            primary_objective: objective
          })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (err) {
        console.error("Failed to update profile:", err);
      }
    }
    
    setLoading(false);
    navigate('/dashboard');
  };

  const OptionCard = ({ selected, onClick, title, desc }) => (
    <div 
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: `2px solid ${selected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
        backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        flex: 1,
        transition: 'all 0.2s',
      }}
    >
      <h4 style={{ margin: '0 0 8px 0', color: selected ? 'white' : 'var(--text-muted)' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '40px', borderRadius: '16px' }}>
        <h1 style={{ marginBottom: '8px', textAlign: 'center' }}>Configure Your AI Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center' }}>
          To provide highly accurate predictions, our AI needs to understand your exact financial constraints. Your starting portfolio is fixed at ₹10,00,000.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Time Horizon */}
          <div>
            <h3 style={{ marginBottom: '16px' }}>1. Time Horizon</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>How long do you plan to hold your investments before withdrawing?</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <OptionCard selected={horizon === 'short'} onClick={() => setHorizon('short')} title="Short-Term (< 1 Year)" desc="Highly liquid, short duration trades." />
              <OptionCard selected={horizon === 'medium'} onClick={() => setHorizon('medium')} title="Medium-Term (1-5 Years)" desc="Looking for a balance of liquidity and growth." />
              <OptionCard selected={horizon === 'long'} onClick={() => setHorizon('long')} title="Long-Term (5+ Years)" desc="Focus on compounding returns over decades." />
            </div>
          </div>

          {/* Drawdown Tolerance */}
          <div>
            <h3 style={{ marginBottom: '16px' }}>2. Drawdown Tolerance</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>If the market crashes, how much of a temporary drop in portfolio value can you stomach before panicking?</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <OptionCard selected={tolerance === 'low'} onClick={() => setTolerance('low')} title="Low (< 10% Drop)" desc="I need my money safe from large volatile swings." />
              <OptionCard selected={tolerance === 'medium'} onClick={() => setTolerance('medium')} title="Medium (~20% Drop)" desc="I can handle normal market corrections." />
              <OptionCard selected={tolerance === 'high'} onClick={() => setTolerance('high')} title="High (40%+ Drop)" desc="I ignore the noise and focus on the destination." />
            </div>
          </div>

          {/* Primary Objective */}
          <div>
            <h3 style={{ marginBottom: '16px' }}>3. Primary Objective</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>What is the main driver behind your investment strategy?</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <OptionCard selected={objective === 'preservation'} onClick={() => setObjective('preservation')} title="Capital Preservation" desc="Protect my purchasing power against inflation." />
              <OptionCard selected={objective === 'income'} onClick={() => setObjective('income')} title="Income Generation" desc="Focus on reliable dividend-paying mature companies." />
              <OptionCard selected={objective === 'growth'} onClick={() => setObjective('growth')} title="Aggressive Growth" desc="Maximize total capital appreciation." />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '16px 24px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginTop: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving Profile...' : 'Start Time Machine'}
          </button>
        </form>
      </div>
    </div>
  );
}
