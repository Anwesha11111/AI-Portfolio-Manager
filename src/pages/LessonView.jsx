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
    
    const newCompleted = [...completedLessons, lesson.id];
    const { error } = await supabase
      .from('users')
      .update({ completed_lessons: newCompleted })
      .eq('id', user.id);
      
    if (!error) {
      setCompletedLessons(newCompleted);
      setTimeout(() => {
        navigate('/academy');
      }, 800);
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

    const parseBold = (str) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, j) => 
        part.startsWith('**') && part.endsWith('**') 
          ? <strong key={j} style={{ color: 'white', fontWeight: '700' }}>{part.slice(2, -2)}</strong>
          : part
      );
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} style={{ paddingLeft: '24px', marginBottom: '28px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.85', fontSize: '1.1rem' }}>
            {currentList.map((item, i) => (
              <li key={i} style={{ marginBottom: '12px' }}>{parseBold(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${idx}`} style={{ marginTop: '40px', marginBottom: '20px', color: 'white', fontSize: '1.5rem', fontWeight: '700', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        currentList.push(line.replace(/^- /, ''));
      } else {
        flushList();
        elements.push(
          <p key={`p-${idx}`} style={{ marginBottom: '28px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.85', fontSize: '1.1rem', letterSpacing: '0.01em' }}>
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
        onMouseOver={(e) => e.currentTarget.style.color = 'white'}
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
