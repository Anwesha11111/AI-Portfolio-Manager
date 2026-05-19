import { useNavigate, Navigate } from 'react-router-dom';
import { TrendingUp, BrainCircuit, LineChart, ArrowRight, ShieldCheck, Sparkles, BarChart3, GraduationCap } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();

  // Redirect logged-in users straight to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, animation: 'pulseGlow 8s infinite'
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(80px)', zIndex: 0, animation: 'pulseGlow 12s infinite reverse'
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '20%', width: '30vw', height: '30vw',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, animation: 'pulseGlow 10s infinite 2s'
      }} />

      {/* Top Navigation */}
      <header className="glass-panel" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '8px',
        padding: '12px clamp(12px, 4vw, 40px)', position: 'sticky', top: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none', overflowX: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 1, minWidth: 0 }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)', flexShrink: 0
          }}>
            <TrendingUp size={18} color="white" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: '800', margin: 0, letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Portfolio<span className="text-gradient-accent">Sim</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 'clamp(4px, 2vw, 16px)', alignItems: 'center', flexShrink: 0 }}>
          <button onClick={() => navigate('/auth', { state: { isLogin: true } })} style={{
            padding: '8px clamp(6px, 2vw, 16px)', background: 'transparent', color: '#e2e8f0',
            border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', whiteSpace: 'nowrap'
          }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#e2e8f0'}>
            Log In
          </button>
          
          <button onClick={() => navigate('/auth', { state: { isLogin: false } })} style={{
            padding: '8px clamp(10px, 3vw, 24px)',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', transition: 'all 0.2s', fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)', whiteSpace: 'nowrap'
          }}>
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px 60px', position: 'relative', zIndex: 10 }}>
        <h1 className="animate-fade-in-up delay-100 text-gradient" style={{ 
          fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', fontWeight: '800', textAlign: 'center', 
          marginBottom: '24px', letterSpacing: '-0.04em', maxWidth: '900px', lineHeight: '1.2' 
        }}>
          Learn to Invest.<br/>
          <span className="text-gradient-accent">Without Risking a Rupee.</span>
        </h1>
        
        <p className="animate-fade-in-up delay-200" style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#e2e8f0', textAlign: 'center', 
          maxWidth: '700px', lineHeight: '1.7', marginBottom: '40px' 
        }}>
          Build your financial profile, receive AI-powered portfolio recommendations, 
          and practice trading through 18 years of real Indian stock market history — all in a risk-free simulation.
        </p>

        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/auth', { state: { isLogin: false } })} style={{
            padding: '16px 32px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
            fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.5)'; }}
             onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.4)'; }}>
            Start Your Journey <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/auth', { state: { isLogin: true } })} style={{
            padding: '16px 32px', background: 'rgba(255,255,255,0.05)',
            color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', cursor: 'pointer',
            fontWeight: '600', fontSize: '1rem', transition: 'all 0.2s'
          }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
             onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
            I have an account
          </button>
        </div>

        {/* How It Works */}
        <div style={{ maxWidth: '1200px', width: '100%', marginTop: '100px' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '48px' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <StepCard step="1" icon={<ShieldCheck size={24} color="#60a5fa" />} title="Build Your Profile" desc="Enter your income, expenses, savings, and risk appetite. We calculate your investable capital." />
            <StepCard step="2" icon={<BrainCircuit size={24} color="#a78bfa" />} title="Get AI Recommendations" desc="Our AI analyzes 47 stocks and builds a portfolio matched to your financial profile." />
            <StepCard step="3" icon={<LineChart size={24} color="#34d399" />} title="Trade Through History" desc="Execute trades in a time machine spanning 2005-2023 using real Nifty 50 prices." />
            <StepCard step="4" icon={<BarChart3 size={24} color="#f59e0b" />} title="Track & Learn" desc="Monitor your portfolio score, P&L, sector allocation, and learn from the Academy." />
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', maxWidth: '1200px', width: '100%', marginTop: '80px' 
        }}>
          <FeatureCard 
            icon={<TrendingUp size={28} color="#60a5fa" />}
            title="Historical Time Machine"
            desc="Travel through 18 years of real market data. Experience bull runs, crashes, recessions, and recovery — day by day."
          />
          <FeatureCard 
            icon={<Sparkles size={28} color="#a78bfa" />}
            title="AI Portfolio Architect"
            desc="Our AI acts as your personal financial advisor — analyzing volatility, returns, and sector diversification to build your ideal portfolio."
          />
          <FeatureCard 
            icon={<GraduationCap size={28} color="#34d399" />}
            title="Stock Market Academy"
            desc="Learn fundamentals like stocks, dividends, recessions, diversification, and the Nifty 50 with our built-in educational modules."
          />
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '80px', marginBottom: '40px', textAlign: 'center' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>
            Ready to build your first portfolio?
          </h2>

          <button onClick={() => navigate('/auth', { state: { isLogin: false } })} style={{
            padding: '16px 40px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
            fontWeight: '700', fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            Create Account <ArrowRight size={20} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem', position: 'relative', zIndex: 10, borderTop: '1px solid var(--border-color)' }}>
        Built for Fidelity Hackathon 2025
      </footer>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: '800' }} className="text-gradient-accent">{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</div>
    </div>
  );
}

function StepCard({ step, icon, title, desc }) {
  return (
    <div className="glass-panel" style={{ borderRadius: '14px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '3rem', fontWeight: '900', color: 'rgba(255,255,255,0.03)', lineHeight: 1 }}>{step}</div>
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px', width: 'fit-content' }}>
        {icon}
      </div>
      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: '700' }}>{title}</h4>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem', margin: 0 }}>{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel" style={{
      borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', transition: 'transform 0.3s, background 0.3s, border-color 0.3s',
      cursor: 'default'
    }} onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.background = 'rgba(25, 25, 25, 0.9)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }} onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = 'var(--bg-card)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '24px'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '700' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>{desc}</p>
    </div>
  );
}
