import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORT THE LOCK ICON
import { GraduationCap, ChevronRight, CheckCircle2, Lock } from 'lucide-react'; 
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import { LESSONS } from '../data/lessons';

export default function Academy() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (keep your existing useEffect fetch progress logic) ...

  const progressPercentage = Math.round((completedLessons.length / LESSONS.length) * 100) || 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '64px' }}>
      {/* ... (keep your existing header and progress bar) ... */}

      <div style={{ display: 'grid', gap: '16px' }}>
        {LESSONS.map((lesson, index) => {
          const Icon = lesson.icon;
          const isCompleted = completedLessons.includes(lesson.id);
          
          // GAMIFICATION LOGIC: Unlocked if it's the first lesson, OR the previous lesson is completed
          const isLocked = index > 0 && !completedLessons.includes(LESSONS[index - 1].id);

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
                opacity: isLocked ? 0.5 : 1 // Dim locked modules
              }}
              onMouseOver={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isCompleted ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)';
                }
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
              </div>

              {/* DYNAMIC ICON RENDER */}
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
