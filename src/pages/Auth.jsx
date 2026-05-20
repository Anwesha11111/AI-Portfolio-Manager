import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Auth() {
  const { state } = useLocation();
  const [isLogin, setIsLogin] = useState(state?.isLogin ?? true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { signIn, signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isLogin !== undefined) {
      setIsLogin(state.isLogin);
      setErrorMsg('');
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        await signUp(email, password, username);
        navigate('/onboarding');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '20px'
    }}>
      <div style={{
        background: 'rgba(10, 10, 22, 0.85)',
        backdropFilter: 'blur(24px)',
        padding: '48px 40px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.07)',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,142,247,0.05)',
        animation: 'fadeInScale 0.4s cubic-bezier(0.16,1,0.3,1) forwards'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', justifyContent: 'center' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #4f8ef7, #9d6ff5)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '0.85rem', color: 'white',
            boxShadow: '0 0 20px rgba(79,142,247,0.4)'
          }}>TW</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, letterSpacing: '-0.03em' }}>
            Trade<span style={{ color: '#4f8ef7' }}>Wise</span>
          </h2>
        </div>

        {/* Title + subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {isLogin ? 'Sign in to your portfolio' : 'Start your investing journey today'}
          </p>
        </div>

        {/* Mode toggle tabs */}
        <div style={{
          display: 'flex', marginBottom: '28px',
          background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          {['Sign In', 'Register'].map((label, i) => {
            const active = isLogin === (i === 0);
            return (
              <button key={label} type="button"
                onClick={() => { setIsLogin(i === 0); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  flex: 1, padding: '9px', border: 'none', borderRadius: '8px',
                  fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: active ? 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(157,111,245,0.15))' : 'transparent',
                  color: active ? '#7bb3fa' : 'var(--text-muted)',
                  boxShadow: active ? '0 0 0 1px rgba(79,142,247,0.2)' : 'none'
                }}
              >{label}</button>
            );
          })}
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(248,113,113,0.08)', color: '#f87171',
            padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
            fontSize: '0.875rem', textAlign: 'center',
            border: '1px solid rgba(248,113,113,0.2)'
          }}>
            {errorMsg}
          </div>
        )}



        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.02em' }}>USERNAME</label>
              <input
                type="text"
                placeholder="e.g. investor_pro"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.02em' }}>EMAIL</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.02em' }}>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            marginTop: '8px',
            padding: '13px',
            background: loading ? 'rgba(79,142,247,0.5)' : 'linear-gradient(135deg, #4f8ef7, #9d6ff5)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontWeight: '700', fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 0 20px rgba(79,142,247,0.3)',
            letterSpacing: '-0.01em'
          }}>
            {loading ? 'Processing...' : isLogin ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#e8eaf6',
  outline: 'none',
  fontSize: '0.95rem',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};
