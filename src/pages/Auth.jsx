import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function Auth() {
  const { state } = useLocation();
  const [isLogin, setIsLogin] = useState(state?.isLogin ?? true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState('IN');
  const [documentNumber, setDocumentNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { signIn, signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isLogin !== undefined) {
      setIsLogin(state.isLogin);
      setErrorMsg('');
    }
  }, [state]);

  const isPasswordValid = (pw) => {
    const minLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    return minLength && hasUpper && hasLower && hasSpecial;
  };

  const isDocumentValid = () => {
    if (isLogin) return true;
    if (country === 'IN') return /^\d{12}$/.test(documentNumber);
    if (country === 'US') return /^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/.test(documentNumber);
    if (country === 'UK') return /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D\s]$/i.test(documentNumber);
    return documentNumber.length >= 4;
  };

  const getDocPlaceholder = () => {
    if (country === 'IN') return '12-digit Aadhaar Number';
    if (country === 'US') return 'XXX-XX-XXXX (SSN)';
    if (country === 'UK') return 'National Insurance Number';
    return 'Document ID';
  };

  const getDocLabel = () => {
    if (country === 'IN') return 'AADHAAR NUMBER';
    if (country === 'US') return 'SOCIAL SECURITY NUMBER';
    if (country === 'UK') return 'NATIONAL INSURANCE NUMBER';
    return 'DOCUMENT NUMBER';
  };

  const getDocRequirement = () => {
    if (country === 'IN') return 'Must be exactly 12 digits';
    if (country === 'US') return 'Format: XXX-XX-XXXX';
    if (country === 'UK') return 'Format: AB123456C';
    return 'Must be at least 4 characters';
  };

  const labelStyle = { display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.02em', textTransform: 'uppercase' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match");
          return;
        }
        if (!isPasswordValid(password)) {
          setErrorMsg("Password does not meet the security requirements.");
          return;
        }
        if (!isDocumentValid()) {
          setErrorMsg(`Invalid document format for ${country}. Please check and try again.`);
          return;
        }
        await signUp(email, password, username, country, documentNumber);
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
            <>
              <div>
                <label style={labelStyle}>USERNAME</label>
                <input
                  type="text"
                  placeholder="e.g. investor_pro"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: '1' }}>
                  <label style={labelStyle}>COUNTRY</label>
                  <select 
                    value={country} 
                    onChange={(e) => { setCountry(e.target.value); setDocumentNumber(''); }}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                  >
                    <option value="IN" style={{ background: '#1a1a2e', color: '#fff' }}>🇮🇳 India</option>
                    <option value="US" style={{ background: '#1a1a2e', color: '#fff' }}>🇺🇸 USA</option>
                    <option value="UK" style={{ background: '#1a1a2e', color: '#fff' }}>🇬🇧 UK</option>
                    <option value="CA" style={{ background: '#1a1a2e', color: '#fff' }}>🇨🇦 Canada</option>
                    <option value="AU" style={{ background: '#1a1a2e', color: '#fff' }}>🇦🇺 Australia</option>
                  </select>
                </div>
                <div style={{ flex: '2' }}>
                  <label style={labelStyle}>{getDocLabel()}</label>
                  <input
                    type="text"
                    placeholder={getDocPlaceholder()}
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    required
                    style={inputStyle}
                  />
                  {!isLogin && documentNumber && (
                    <div style={{ marginTop: '6px', fontSize: '0.75rem' }}>
                      {isDocumentValid() ? (
                        <span style={{ color: 'var(--success)' }}>✓ Valid format</span>
                      ) : (
                        <span style={{ color: 'var(--danger)' }}>✗ {getDocRequirement()}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          <div>
            <label style={labelStyle}>EMAIL</label>
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
            <label style={labelStyle}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {!isLogin && password && (
              <div style={{ marginTop: '8px', fontSize: '0.75rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: password.length >= 8 ? 'var(--success)' : 'var(--text-muted)' }}>✓ 8+ chars</span>
                <span style={{ color: /[A-Z]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Uppercase</span>
                <span style={{ color: /[a-z]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Lowercase</span>
                <span style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>✓ Special</span>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: '40px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
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
