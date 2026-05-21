import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { Wallet, TrendingUp } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1: Financial Profile
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [initialCapital, setInitialCapital] = useState('');

  // Step 2: Risk Profile
  const [horizon, setHorizon] = useState('long');
  const [tolerance, setTolerance] = useState('medium');
  const [objective, setObjective] = useState('growth');

  // Initial capital chosen by user. Monthly surplus will be credited each sim month.
  const income = Number(monthlyIncome) || 0;
  const expenses = Number(monthlyExpenses) || 0;
  const initialCap = Number(initialCapital) || 0;
  const monthlySurplus = Math.max(0, income - expenses);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            monthly_income: income,
            monthly_expenses: expenses,
            virtual_balance: initialCap,
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



  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '40px', borderRadius: '16px' }}>
        
        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--accent-primary)' }} />
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }} />
        </div>

        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 style={{ marginBottom: '8px', textAlign: 'center' }}>Your Financial Profile</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center' }}>
              We'll use this to calculate your investable capital and tailor AI recommendations to your actual financial situation.
            </p>

            <InputField 
              label="Monthly Income (post-tax)" 
              value={monthlyIncome} 
              onChange={setMonthlyIncome} 
              placeholder="e.g. 80000"
              icon={Wallet}
            />
            <InputField 
              label="Monthly Expenses (rent, bills, EMIs)" 
              value={monthlyExpenses} 
              onChange={setMonthlyExpenses} 
              placeholder="e.g. 45000"
              icon={Wallet}
            />
            <InputField 
              label="Initial Capital" 
              value={initialCapital} 
              onChange={setInitialCapital} 
              placeholder="e.g. 50000"
              icon={TrendingUp}
            />

            {/* Live Calculation */}
            <div style={{ 
              padding: '24px', borderRadius: '12px', marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Surplus</span>
                <span style={{ fontWeight: 'bold', color: monthlySurplus > 0 ? 'var(--success)' : 'var(--danger)' }}>
                  ₹{monthlySurplus.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                This surplus will be automatically credited to your account every simulated month.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Starting Capital</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--success)' }}>
                  ₹{initialCap.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={income <= 0}
              style={{
                width: '100%', padding: '16px',
                background: income > 0 ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.1)',
                color: 'white', border: 'none', borderRadius: '8px', cursor: income > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold', fontSize: '1.1rem', opacity: income > 0 ? 1 : 0.5
              }}
            >
              Continue to Risk Profile →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ marginBottom: '8px' }}>Configure Your Risk Profile</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Your virtual capital: <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>₹{initialCap.toLocaleString('en-IN')}</strong>
              </p>
            </div>

            {/* Time Horizon */}
            <div>
              <h3 style={{ marginBottom: '16px' }}>1. Investment Time Horizon</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>How long do you plan to hold your investments?</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <OptionCard selected={horizon === 'short'} onClick={() => setHorizon('short')} title="Short-Term (< 1 Year)" desc="Quick trades, high liquidity focus." />
                <OptionCard selected={horizon === 'medium'} onClick={() => setHorizon('medium')} title="Medium-Term (1-5 Years)" desc="Balance of liquidity and growth." />
                <OptionCard selected={horizon === 'long'} onClick={() => setHorizon('long')} title="Long-Term (5+ Years)" desc="Compounding returns over decades." />
              </div>
            </div>

            {/* Drawdown Tolerance */}
            <div>
              <h3 style={{ marginBottom: '16px' }}>2. Risk Appetite</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>How much temporary loss can you tolerate?</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <OptionCard selected={tolerance === 'low'} onClick={() => setTolerance('low')} title="Conservative (< 10%)" desc="Safety-first, minimal volatility." />
                <OptionCard selected={tolerance === 'medium'} onClick={() => setTolerance('medium')} title="Moderate (~20%)" desc="Can handle normal corrections." />
                <OptionCard selected={tolerance === 'high'} onClick={() => setTolerance('high')} title="Aggressive (40%+)" desc="High risk, high reward focus." />
              </div>
            </div>

            {/* Primary Objective */}
            <div>
              <h3 style={{ marginBottom: '16px' }}>3. Primary Objective</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>What is your main investment goal?</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <OptionCard selected={objective === 'preservation'} onClick={() => setObjective('preservation')} title="Capital Preservation" desc="Protect against inflation." />
                <OptionCard selected={objective === 'income'} onClick={() => setObjective('income')} title="Income Generation" desc="Steady dividend income." />
                <OptionCard selected={objective === 'growth'} onClick={() => setObjective('growth')} title="Aggressive Growth" desc="Maximize capital appreciation." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button"
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
              >
                ← Back
              </button>
              <button 
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: '16px',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold', fontSize: '1.1rem', opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Saving Profile...' : 'Start Time Machine 🚀'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

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
      minWidth: '200px',
      transition: 'all 0.2s',
    }}
  >
    <h4 style={{ margin: '0 0 8px 0', color: selected ? 'white' : 'var(--text-muted)' }}>{title}</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{desc}</p>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, icon: Icon }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95rem' }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '0 16px' }}>
      {Icon && <Icon size={18} color="var(--text-muted)" />}
      <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>₹</span>
      <input 
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, padding: '14px 0', background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', outline: 'none' }}
      />
    </div>
  </div>
);
