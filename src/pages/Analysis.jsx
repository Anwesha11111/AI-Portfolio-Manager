import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useSimulationStore from '../store/useSimulationStore';
import { BrainCircuit, ShieldCheck, AlertTriangle, Loader, Layers, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getGradientForSymbol } from '../utils/assetMap';

export default function Analysis() {
  const { user } = useAuthStore();
  const { currentSimulatedDate } = useSimulationStore();
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [aiData, setAiData] = useState(null);
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
          const result = await res.json();
          setAiData(result);
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

  const score = aiData?.score || 0;
  const strengths = aiData?.strengths || [];
  const weaknesses = aiData?.weaknesses || [];
  const suggestion = aiData?.suggestion || '';

  // Score color
  const getScoreColor = (s) => {
    if (s >= 75) return 'var(--success)';
    if (s >= 50) return '#f59e0b';
    return 'var(--danger)';
  };
  const scoreColor = getScoreColor(score);

  // Score ring
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BrainCircuit size={32} color="var(--accent-primary)" /> AI Portfolio Analysis
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        AI-powered health check tailored to your financial goals and risk tolerance.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Portfolio Score */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio Score</h3>
          <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '16px' }}>
            <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={scoreColor} strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: scoreColor }}>{score}</span>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
          <span style={{ fontSize: '0.95rem', color: scoreColor, fontWeight: 'bold' }}>
            {score >= 75 ? 'Healthy' : score >= 50 ? 'Needs Attention' : 'At Risk'}
          </span>
        </div>

        {/* Your Profile */}
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

        {/* Strengths & Weaknesses */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '16px' }}>AI Assessment</h3>
          
          {strengths.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 'bold' }}>Strengths</span>
              {strengths.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {weaknesses.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 'bold' }}>Weaknesses</span>
              {weaknesses.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <XCircle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{w}</span>
                </div>
              ))}
            </div>
          )}

          {suggestion && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Lightbulb size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{suggestion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Diversification Matrix */}
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={20} color="var(--accent-primary)" /> Current Market Exposure
      </h3>
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <AlertTriangle size={36} color="#f59e0b" style={{ flexShrink: 0, marginTop: '4px' }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1.2rem' }}>Active Holdings ({holdings.length})</h4>
          {holdings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>
              Because you hold only cash, your portfolio is safe from immediate market volatility. However, inflation in the simulation (running from {new Date(currentSimulatedDate).getFullYear()}) will erode your purchasing power. Begin buying diversified assets to construct a risk-adjusted portfolio.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {holdings.map(h => (
                <div key={h.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                  background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <div style={{
                    width: '32px', height: '32px', background: getGradientForSymbol(h.symbol), borderRadius: '6px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: 'white',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)', flexShrink: 0
                  }}>
                    {h.symbol[0]}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{h.symbol}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.quantity} Shares</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
