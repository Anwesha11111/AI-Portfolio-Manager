import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import { LESSONS } from '../data/lessons';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updating, setUpdating] = useState(false);

  const lesson = LESSONS.find(l => l.id === id);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('completed_lessons')
        .eq('id', user.id)
        .single();
      
      if (data && data.completed_lessons) {
        setCompletedLessons(data.completed_lessons);
      }
    };
    fetchProgress();
  }, [user]);

  if (!lesson) {
    return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Lesson not found.</div>;
  }

  const isCompleted = completedLessons.includes(lesson.id);

  const handleMarkCompleted = async () => {
    if (!user || isCompleted) return;
    setUpdating(true);
    
    // Safety check: ensure it's a flat array and prevent duplicates
    const currentCompleted = Array.isArray(completedLessons) ? completedLessons : [];
    const newCompleted = [...new Set([...currentCompleted, lesson.id])]; 

    const { error } = await supabase
      .from('users')
      .update({ completed_lessons: newCompleted })
      .eq('id', user.id);
      
    if (!error) {
      setCompletedLessons(newCompleted);
      // Give Supabase an extra half-second to sync before navigating
      setTimeout(() => {
        navigate('/academy', { state: { refresh: true } }); 
      }, 1000);
    } else {
      console.error("Error marking lesson complete:", error);
    }
    setUpdating(false);
  };

  // Robust line-by-line Markdown Parser
  const renderContent = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    const elements = [];
    let currentList = [];

    // ... (Keep your existing parseBold and flushList helper functions) ...

    lines.forEach((line, idx) => {
      const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      
      if (line.startsWith('### ')) {
        // ... (Keep existing H3 logic)
      } else if (line.startsWith('- ')) {
        // ... (Keep existing List logic)
      } else if (imageMatch) {
        // ... (Keep existing Image logic)
      } else if (line.startsWith('> 💡 PRO-TIP:')) {
        flushList();
        elements.push(
          <div key={`tip-${idx}`} style={{ margin: '24px 0', padding: '16px 20px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success)', borderRadius: '0 8px 8px 0' }}>
            <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '8px' }}>💡 PRO-TIP</strong>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>{parseBold(line.replace('> 💡 PRO-TIP:', ''))}</p>
          </div>
        );
      } else if (line.startsWith('> ⚠️ WARNING:')) {
        flushList();
        elements.push(
          <div key={`warn-${idx}`} style={{ margin: '24px 0', padding: '16px 20px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '0 8px 8px 0' }}>
            <strong style={{ color: '#ef4444', display: 'block', marginBottom: '8px' }}>⚠️ WARNING</strong>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>{parseBold(line.replace('> ⚠️ WARNING:', ''))}</p>
          </div>
        );
      } else if (line === '[CHART:COMPOUNDING]') {
        flushList();
        // Sample data for the interactive chart
        const data = [
          { year: 'Year 1', value: 115000 }, { year: 'Year 5', value: 201135 },
          { year: 'Year 10', value: 404555 }, { year: 'Year 20', value: 1636653 },
          { year: 'Year 30', value: 6621177 }
        ];
        elements.push(
          <div key={`chart-${idx}`} style={{ height: '300px', width: '100%', margin: '40px 0', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(val) => \`₹\${val/100000}L\`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      } else {
        flushList();
        elements.push(
          <p key={`p-${idx}`} style={{ marginBottom: '28px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.85', fontSize: '1.1rem' }}>
            {parseBold(line)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };
  
  const Icon = lesson.icon;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
      <button 
        onClick={() => navigate('/academy')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '32px', padding: 0, fontSize: '1rem', fontWeight: '600' }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ChevronLeft size={20} /> Back to Academy
      </button>

      <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', borderTop: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
            <Icon size={32} color="var(--accent-primary)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Core Module</span>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                <Clock size={14} /> {lesson.readTime}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: '800', lineHeight: '1.2' }}>{lesson.title}</h1>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '32px 0' }} />

        <div style={{ padding: '0 8px' }}>
          {renderContent(lesson.content)}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '48px 0 32px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isCompleted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '16px 32px', borderRadius: '100px', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <CheckCircle2 size={24} /> Module Completed
            </div>
          ) : (
            <button 
              onClick={handleMarkCompleted}
              disabled={updating}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 40px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white', border: 'none', borderRadius: '100px', cursor: updating ? 'wait' : 'pointer',
                fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
                transition: 'transform 0.2s', opacity: updating ? 0.7 : 1
              }}
              onMouseOver={(e) => !updating && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !updating && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <CheckCircle2 size={24} /> 
              {updating ? 'Saving...' : 'Mark as Read & Return'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
