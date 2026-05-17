import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem' }}>
      <h1>Welcome to PortfolioSim</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Configure your financial profile to begin the 2005 simulation.</p>
      
      <button 
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--accent-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onClick={() => navigate('/dashboard')}
      >
        Start Simulation (₹10,00,000)
      </button>
    </div>
  );
}
