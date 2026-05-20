import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import { LESSONS } from '../data/lessons';

export default function Academy() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('users')
          .select('completed_lessons')
          .eq('id', user.id)
          .single();
        
        if (data && data.completed_lessons) {
          setCompletedLessons(data.completed_lessons);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  const progressPercentage = Math.round((completedLessons.length / LESSONS.length) * 100) || 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '64px' }}>
      <div style={{ marginBottom: '40px' }} id="tour-academy">
        <h2 style={{ marginBottom: '8px', fontSize: '2.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GraduationCap size={36} color="var(--accent-primary)" /> Academy
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Master the fundamentals of investing before executing your strategy.
        </p>

        {/* Progress Bar */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Course Progress</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{progressPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              width: `${progressPercentage}%`,
              transition: 'width 0.5s ease-out'
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {LESSONS.map((lesson, index) => {
          const Icon = lesson.icon;
          const isCompleted = completedLessons.includes(lesson.id);

          return (
            <div 
              key={lesson.id}
              onClick={() => navigate(`/academy/${lesson.id}`)}
              className="glass-panel"
              style={{ 
                padding: '24px', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'var(--bg-card)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = isCompleted ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)';
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={24} color={isCompleted ? "var(--success)" : "var(--text-muted)"} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    Module {index + 1}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' }}>
                    {lesson.readTime}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: isCompleted ? 'var(--text-main)' : '#e2e8f0' }}>
                  {lesson.title}
                </h3>
              </div>

              {isCompleted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
                  <CheckCircle2 size={20} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'none', '@media(minWidth: 600px)': { display: 'block' } }}>Done</span>
                </div>
              ) : (
                <ChevronRight size={24} color="var(--text-muted)" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
