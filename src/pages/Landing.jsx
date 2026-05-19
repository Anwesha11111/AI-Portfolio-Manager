import { useNavigate } from 'react-router-dom';
import { TrendingUp, BrainCircuit, LineChart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

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

      {/* Top Navigation */}
      <header className="glass-panel" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 40px', position: 'sticky', top: 0, zIndex: 50, borderTop: 'none', borderLeft: 'none', borderRight: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <TrendingUp size={20} color="white" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '-0.03em' }}>
            Portfolio<span className="text-gradient-accent">Sim</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => navigate('/auth')} style={{
            padding: '10px 20px', background: 'transparent', color: 'var(--text-muted)',
            border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s', fontSize: '0.95rem'
          }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
            Log In
          </button>
          
          <button onClick={() => navigate('/auth')} style={{
            padding: '10px 24px', background: 'rgba(255,255,255,0.1)', color: 'white',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', transition: 'all 0.2s', fontSize: '0.95rem'
          }} onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }} 
             onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 20px 80px', position: 'relative', zIndex: 10 }}>
        <div className="animate-fade-in-up" style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)', padding: '6px 16px', borderRadius: '100px',
          color: '#60a5fa', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px'
        }}>
          <ShieldCheck size={16} /> Market Simulation Engine v2.0
        </div>

        <h1 className="animate-fade-in-up delay-100 text-gradient" style={{ 
          fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '800', textAlign: 'center', 
          marginBottom: '24px', letterSpacing: '-0.04em', maxWidth: '1000px', lineHeight: '1.1' 
        }}>
          Master the Markets.<br/>
          <span className="text-gradient-accent">Without the Risk.</span>
        </h1>
        
        <p className="animate-fade-in-up delay-200" style={{ 
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--text-muted)', textAlign: 'center', 
          maxWidth: '750px', lineHeight: '1.6', marginBottom: '40px' 
        }}>
          PortfolioSim bridges the gap between raw financial data and actionable trading knowledge. Experience decades of real Indian stock market history in a high-fidelity time-machine environment.
        </p>

        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/auth')} style={{
            padding: '16px 32px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
            fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s, box-shadow 0.2s'
          }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.5)'; }}
             onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.4)'; }}>
            Start Trading Now <ArrowRight size={20} />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="animate-fade-in-up delay-300" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px', maxWidth: '1200px', width: '100%', marginTop: '100px' 
        }}>
          <FeatureCard 
            icon={<TrendingUp size={28} color="#60a5fa" />}
            title="Historical Time Travel"
            desc="Trade through decades of real stock market history. Experience massive bull runs and unexpected sector rotations day-by-day."
          />
          <FeatureCard 
            icon={<BrainCircuit size={28} color="#a78bfa" />}
            title="AI Predictive Advisor"
            desc="A built-in AI quant analyst that calculates complex technical indicators in real-time, matching trades to your personal risk profile."
          />
          <FeatureCard 
            icon={<LineChart size={28} color="#34d399" />}
            title="Behavioral Analysis"
            desc="The system silently tracks your trading psychology, flagging panic sells and FOMO buys to help you develop ironclad emotional discipline."
          />
        </div>
      </main>
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
      <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: '700' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>{desc}</p>
    </div>
  );
}
