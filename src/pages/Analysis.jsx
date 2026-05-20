import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import useSimulationStore from '../store/useSimulationStore';
import { BrainCircuit, AlertTriangle, Loader, Layers, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getGradientForSymbol } from '../utils/assetMap';

export default function Analysis() {
  const { user } = useAuthStore();
  const { currentSimulatedDate } = useSimulationStore();
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  // Step 1: Load user data immediately
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      const { data: holdingsData } = await supabase.from('holdings').select('*').eq('user_id', user.id);
      
      setProfile(userData);
      setHoldings(holdingsData || []);
      setPageLoading(false);
    };
    fetchUserData();
  }, [user]);

  const generateAnalysis = async () => {
    if (!profile) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdings: holdings || [],
          balance: profile.virtual_balance,
          profile: {
            time_horizon: profile.time_horizon,
            drawdown_tolerance: profile.drawdown_tolerance,
            primary_objective: profile.primary_objective,
            monthly_income: profile.monthly_income,
            monthly_expenses: profile.monthly_expenses,
          }
        })
      });
      const result = await res.json();
      setAiData(result);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    }
    setAiLoading(false);
  };

  if (pageLoading) {
    return <div className="page-loader"><Loader size={48} className="spin" color="var(--accent-primary)" /></div>;
  }

  const score = aiData?.score || 0;
  const strengths = aiData?.strengths || [];
  const weaknesses = aiData?.weaknesses || [];
  const suggestion = aiData?.suggestion || '';

  const getScoreColor = (s) => {
    if (s >= 75) return 'var(--success)';
    if (s >= 50) return '#f59e0b';
    return 'var(--danger)';
  };
  const scoreColor = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const monthlySurplus = Math.max(0, (profile?.monthly_income || 0) - (profile?.monthly_expenses || 0));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div id="tour-analysis">
        <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrainCircuit size={32} color="var(--accent-primary)" /> AI Portfolio Analysis
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          AI-powered health check tailored to your financial profile and risk tolerance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Portfolio Score */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio Score</h3>
          
          {aiLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px 0' }}>
              <Loader size={48} className="spin" color="var(--accent-primary)" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Our AI is analyzing...</span>
            </div>
          ) : aiData ? (
            <>
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
                {score >= 75 ? 'Healthy' : score >= 50 ? 'Needs Attention' : score > 0 ? 'At Risk' : 'Not Scored'}
              </span>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <BrainCircuit size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
              <button 
                onClick={generateAnalysis}
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
              >
                Generate AI Analysis
              </button>
            </div>
          )}
        </div>

        {/* Your Profile */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>Financial Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ProfileRow label="Monthly Income" value={`₹${(profile?.monthly_income || 0).toLocaleString()}`} />
            <ProfileRow label="Monthly Expenses" value={`₹${(profile?.monthly_expenses || 0).toLocaleString()}`} />
            <ProfileRow label="Monthly Surplus" value={`₹${monthlySurplus.toLocaleString()}`} color={monthlySurplus > 0 ? 'var(--success)' : 'var(--danger)'} />
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }} />
            <ProfileRow label="Time Horizon" value={profile?.time_horizon || 'Long'} />
            <ProfileRow label="Risk Appetite" value={profile?.drawdown_tolerance || 'Medium'} />
            <ProfileRow label="Objective" value={profile?.primary_objective || 'Growth'} />
            <ProfileRow label="Virtual Balance" value={`₹${(profile?.virtual_balance || 0).toLocaleString()}`} bold />
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '16px' }}>AI Assessment</h3>
          
          {aiLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 0' }}>
              <Loader size={32} className="spin" color="var(--accent-secondary)" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Evaluating your portfolio...</span>
            </div>
          ) : aiData ? (
            <>
              {strengths.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: 'bold' }}>Strengths</span>
                  {strengths.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{s}</span>
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
                      <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {suggestion && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <Lightbulb size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{suggestion}</span>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <span>Click the <strong>Generate AI Analysis</strong> button above to let our AI diagnose your portfolio's health, diversification, and growth potential.</span>
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
              You hold only cash — safe from volatility but inflation will erode purchasing power over time. Begin buying diversified assets.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {holdings.map(h => (
                <div key={h.id} style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                  background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
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

function ProfileRow({ label, value, color, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: bold ? '800' : 'bold', textTransform: 'capitalize', color: color || 'var(--text-main)', fontSize: '0.9rem' }}>{value}</span>
    </div>
  );
}
