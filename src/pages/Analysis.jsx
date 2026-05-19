import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useSimulationStore from '../store/useSimulationStore';
import { BrainCircuit, ShieldCheck, TrendingUp, AlertTriangle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Analysis() {
  const { user } = useAuthStore();
  const { currentSimulatedDate } = useSimulationStore();
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndAnalysis = async () => {
      if (!user) return;
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      const { data: holdingsData } = await supabase.from('holdings').select('*').eq('user_id', user.id);
      
      setProfile(userData);
      setHoldings(holdingsData || []);

      if (userData) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              holdings: holdingsData || [],
              balance: userData.virtual_balance,
              profile: userData
            })
          });
          const aiData = await res.json();
          setAiInsight(aiData.analysis);
        } catch (err) {
          console.error("AI Analysis failed:", err);
        }
      }
      
      setLoading(false);
    };
    fetchProfileAndAnalysis();
  }, [user]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader size={48} className="spin" color="var(--accent-primary)" /></div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BrainCircuit size={32} color="var(--accent-primary)" /> AI Portfolio Analysis
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Deep-dive analytics tailored to your financial goals and risk tolerance.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Profile Summary Card */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>Your AI Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Time Horizon</span>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{profile?.time_horizon || 'Long'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Drawdown Tolerance</span>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{profile?.drawdown_tolerance || 'Medium'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Primary Objective</span>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{profile?.primary_objective || 'Growth'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Virtual Balance</span>
              <span style={{ fontWeight: 'bold' }}>₹{profile?.virtual_balance?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* AI Health Check */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--success)' }}>
            <ShieldCheck size={20} /> AI Portfolio Health
          </h3>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>
            {aiInsight || "Analyzing portfolio..."}
          </p>
        </div>
      </div>

      {/* Diversification Matrix */}
      <h3 style={{ marginBottom: '16px' }}>Current Market Exposure</h3>
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <AlertTriangle size={32} color="var(--warning)" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Active Holdings ({holdings.length})</h4>
          {holdings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Because you hold only cash, your portfolio is safe from immediate market volatility. However, inflation in the simulation (running from {new Date(currentSimulatedDate).getFullYear()}) will erode your purchasing power. Begin buying diversified assets to construct a risk-adjusted portfolio.
            </p>
          ) : (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {holdings.map(h => (
                <span key={h.id} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>{h.symbol}: {h.quantity}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
