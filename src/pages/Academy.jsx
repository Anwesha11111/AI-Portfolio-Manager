import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import { LESSONS } from '../data/lessons';

export default function Academy() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('completed_lessons')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;

        // Ensure we always set a flat array
        if (data && Array.isArray(data.completed_lessons)) {
          setCompletedLessons(data.completed_lessons);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [user, location.state]); // Re-run if we pass refresh state from LessonView

  const progressPercentage = Math.round((completedLessons.length / LESSONS.length) * 100) || 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingBottom: '64px' }}>
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
          
          // STRICT GAMIFICATION LOGIC: 
          // If loading, don't lock. Otherwise, check if previous lesson ID exists in the array.
          const previousLessonId = index > 0 ? LESSONS[index - 1].id : null;
          const isLocked = !loading && index > 0 && !completedLessons.includes(previousLessonId);

          return (
            <div 
              key={lesson.id}
              onClick={() => { if (!isLocked) navigate(`/academy/${lesson.id}`); }}
              className="glass-panel"
              style={{ 
                padding: '24px', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'var(--bg-card)',
                opacity: isLocked ? 0.5 : 1
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
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: isCompleted ? 'var(--text-main)' : (isLocked ? 'var(--text-muted)' : '#e2e8f0') }}>
                  {lesson.title}
                </h3>
                {lesson.oldTitle && (
                  <div style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400', opacity: 0.8 }}>
                    {lesson.oldTitle}
                  </div>
                )}
              </div>

              {isCompleted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
                  <CheckCircle2 size={20} />
                </div>
              ) : isLocked ? (
                <Lock size={20} color="var(--text-muted)" />
              ) : (
                <ChevronRight size={24} color="var(--accent-primary)" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
