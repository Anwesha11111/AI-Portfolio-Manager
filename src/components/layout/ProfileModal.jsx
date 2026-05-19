import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User as UserIcon, LogOut, Wallet, Target, Clock, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

export default function ProfileModal({ onClose }) {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '16px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
          }}>
            <UserIcon size={32} color="var(--accent-primary)" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{user?.email}</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Investor Profile</span>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <Wallet size={18} color="var(--success)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Virtual Balance</span>
                <span style={{ fontWeight: 'bold' }}>₹{profile?.virtual_balance?.toLocaleString() || '0'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <Clock size={18} color="var(--accent-primary)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time Horizon</span>
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{profile?.time_horizon || 'N/A'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <AlertTriangle size={18} color="var(--warning)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drawdown Tolerance</span>
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{profile?.drawdown_tolerance || 'N/A'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <Target size={18} color="#c084fc" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Objective</span>
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{profile?.primary_objective || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)' }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)' }}
        >
          <LogOut size={18} />
          Log Out
        </button>

      </div>
    </div>
  );
}
