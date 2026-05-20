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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchProfile = async () => {
    setLoading(true);
    if (user) {
      const { data } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
      setProfile(data);
      setFormData(data || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };


  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('users').update({
        username: formData.username,
        virtual_balance: Number(formData.virtual_balance),
        monthly_income: Number(formData.monthly_income),
        monthly_expenses: Number(formData.monthly_expenses),
        time_horizon: formData.time_horizon,
        drawdown_tolerance: formData.drawdown_tolerance,
        primary_objective: formData.primary_objective
      }).eq('id', user.id);
      
      if (error) throw error;
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save changes.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px', overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '16px',
        position: 'relative', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
          }}>
            <UserIcon size={32} color="var(--accent-primary)" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{profile?.username || user?.email}</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile?.username ? user?.email : 'Investor Profile'}</span>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
        ) : isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Username</label>
              <input type="text" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Virtual Balance (Available Capital)</label>
              <input type="number" value={formData.virtual_balance || ''} onChange={e => setFormData({...formData, virtual_balance: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Monthly Income</label>
                <input type="number" value={formData.monthly_income || ''} onChange={e => setFormData({...formData, monthly_income: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Monthly Expenses</label>
                <input type="number" value={formData.monthly_expenses || ''} onChange={e => setFormData({...formData, monthly_expenses: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Time Horizon</label>
              <select value={formData.time_horizon || 'long'} onChange={e => setFormData({...formData, time_horizon: e.target.value})} style={inputStyle}>
                <option value="short">Short Term (&lt; 1yr)</option>
                <option value="medium">Medium Term (1-5yrs)</option>
                <option value="long">Long Term (5+ yrs)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Drawdown Tolerance</label>
              <select value={formData.drawdown_tolerance || 'medium'} onChange={e => setFormData({...formData, drawdown_tolerance: e.target.value})} style={inputStyle}>
                <option value="low">Low (Conservative)</option>
                <option value="medium">Medium (Moderate)</option>
                <option value="high">High (Aggressive)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Primary Objective</label>
              <select value={formData.primary_objective || 'growth'} onChange={e => setFormData({...formData, primary_objective: e.target.value})} style={inputStyle}>
                <option value="growth">Capital Growth</option>
                <option value="income">Dividend Income</option>
                <option value="preservation">Capital Preservation</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: 'var(--accent-primary)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <Wallet size={18} color="var(--success)" />
              <div style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Virtual Balance (Available Capital)</span>
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
            
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              Edit Profile Settings
            </button>
          </div>
        )}

        {!isEditing && (
          <button 
            onClick={handleLogout}
            style={{
              width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)' }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)' }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: 'white',
  outline: 'none',
  boxSizing: 'border-box'
};
