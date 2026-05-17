import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#000000',
      color: 'var(--text-main)'
    }}>
      {/* Top Navigation */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent-primary), #60a5fa)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '0.9rem', color: 'white',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
          }}>AI</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>
            Portfolio<span style={{ color: 'var(--accent-primary)' }}>Sim</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: 'var(--text-main)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600'
          }}>Login</button>
          
          <button style={{
            padding: '10px 24px',
            backgroundColor: 'var(--text-main)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'not-allowed',
            fontWeight: '600',
            opacity: 0.5
          }} disabled>Register</button>

          <button style={{
            padding: '10px 24px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
          }} onClick={() => navigate('/dashboard')}>
            [DEV] Bypass
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '24px', letterSpacing: '-0.03em', maxWidth: '900px' }}>
          Master the Markets. <br/>
          <span style={{ color: 'var(--text-muted)' }}>Without the Risk.</span>
        </h1>
        
        <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '700px', lineHeight: '1.6', marginBottom: '60px' }}>
          PortfolioSim bridges the gap between raw financial data and actionable trading knowledge. Instead of learning through expensive mistakes with real money, you are placed in a realistic time-machine environment starting from the year 2001. Armed with virtual capital, you will experience decades of real market volatility, sector rotations, and bull runs.
        </p>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1100px', width: '100%' }}>
          <div style={featureCardStyle}>
            <div style={iconStyle}>⏳</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Historical Time Travel</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Trade through decades of real Indian stock market history. Experience massive bull runs and unexpected sector rotations day-by-day.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={iconStyle}>🧠</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>AI Predictive Advisor</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>A built-in AI quant analyst that calculates complex technical indicators in real-time, matching trades to your personal risk profile.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={iconStyle}>📊</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Behavioral Analysis</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>The system silently tracks your trading psychology, flagging panic sells and FOMO buys to help you develop ironclad emotional discipline.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const featureCardStyle = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const iconStyle = {
  fontSize: '2rem',
  marginBottom: '20px',
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)'
};
