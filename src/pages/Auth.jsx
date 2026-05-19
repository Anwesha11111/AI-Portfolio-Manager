import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Auth() {
  const { state } = useLocation();
  const [isLogin, setIsLogin] = useState(state?.isLogin ?? true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { signIn, signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isLogin !== undefined) {
      setIsLogin(state.isLogin);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        const data = await signUp(email, password);
        // If email confirmation is enabled, Supabase returns data.user but data.session is null.
        if (data?.user && !data.session) {
          setSuccessMsg('Registration successful! Please check your email inbox to verify your account before logging in.');
          setIsLogin(true); // Switch to login view for when they come back
        } else {
          // If no email confirmation is required, they are automatically logged in
          navigate('/onboarding');
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#000000', color: 'var(--text-main)', padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)', padding: '40px', borderRadius: '12px',
        border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent-primary), #60a5fa)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '0.9rem', color: 'white'
          }}>AI</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0 }}>PortfolioSim</h2>
        </div>

        <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.2rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h3>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.95rem', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={{
            padding: '12px', background: 'var(--accent-primary)', color: 'white',
            border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: '10px'
          }}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
              setSuccessMsg('');
            }} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Register' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  color: 'white',
  outline: 'none'
};
