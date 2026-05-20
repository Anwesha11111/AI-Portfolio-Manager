import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

const TOUR_STEPS = [
  {
    route: '/dashboard',
    title: 'Welcome to TradeWise! 🎉',
    description: 'This is your Dashboard — the command center for your virtual portfolio. Here you can track your net worth, see your holdings, and monitor your profit & loss in real-time.',
    highlight: 'Your portfolio summary, sector allocation, and top movers are all visible at a glance.'
  },
  {
    route: '/dashboard',
    title: 'Your Virtual Capital 💰',
    description: 'You start with virtual capital based on what you set during onboarding. Every simulated month, your salary surplus is automatically credited to your available balance.',
    highlight: 'Use this capital wisely — buy stocks, set stop-losses, and grow your wealth over 18 years of real market history.'
  },
  {
    route: '/market',
    title: 'Market Discovery 📈',
    description: 'This is the Market page where you can browse all 47 Nifty 50 companies. Sort by top gainers, losers, or alphabetically. Choose different timeframes to see how stocks performed.',
    highlight: 'Click on any stock to see its detailed candlestick chart and execute buy/sell trades.'
  },
  {
    route: '/market',
    title: 'AI Portfolio Architect 🤖',
    description: 'Click the "AI Architect" button to get personalized monthly investment recommendations. The AI analyzes your risk profile, income, and current market conditions.',
    highlight: 'You can use this once per simulated month. You can accept individual recommendations or buy the entire suggested portfolio in one click.'
  },
  {
    route: '/analysis',
    title: 'AI Portfolio Analysis 🧠',
    description: 'Get an AI-powered health check of your portfolio. It scores your diversification, identifies strengths and weaknesses, and suggests improvements.',
    highlight: 'The analysis considers your risk tolerance, time horizon, and investment objective to give personalized advice.'
  },
  {
    route: '/academy',
    title: 'Stock Market Academy 🎓',
    description: 'Learn the fundamentals of investing through interactive lessons. Topics include what stocks are, how dividends work, understanding market crashes, and more.',
    highlight: 'Complete lessons to build your knowledge. Your progress is saved automatically.'
  },
  {
    route: '/dashboard',
    title: 'Time Machine & Settings ⚙️',
    description: 'Click the gear icon (⚙️) in the top-right corner to access the Settings panel. From there you can control the simulation speed, jump to specific dates, or start/pause the time engine.',
    highlight: 'The simulation runs from 2005 to 2023 — experience bull runs, the 2008 crash, COVID, and more. Use "Jump to Date" to time-travel instantly!'
  },
  {
    route: '/dashboard',
    title: "You're All Set! 🚀",
    description: "You now know everything you need to start your investing journey. Head to the Market, pick your first stock, and begin building your portfolio through history!",
    highlight: 'Pro tip: Start slow, diversify across sectors, and use stop-losses to protect your capital. Good luck!'
  }
];

export default function TourOverlay({ onEnd }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const current = TOUR_STEPS[step];

  // Navigate to the correct route when step changes
  useEffect(() => {
    if (current.route && location.pathname !== current.route) {
      navigate(current.route);
    }
  }, [step, current.route]);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onEnd();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '520px', borderRadius: '20px', overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(20,20,30,0.98), rgba(10,10,18,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(79,142,247,0.1)',
        animation: 'fadeInScale 0.3s ease forwards'
      }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '3px', padding: '16px 24px 0' }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i <= step ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '28px 28px 24px' }}>
          {/* Step counter + close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
            <button 
              onClick={onEnd}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%',
                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <X size={14} />
            </button>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            {current.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '16px' }}>
            {current.description}
          </p>
          
          {current.highlight && (
            <div style={{
              padding: '14px 16px', borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)',
              fontSize: '0.85rem', color: 'rgba(147, 197, 253, 0.9)', lineHeight: '1.5'
            }}>
              💡 {current.highlight}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 28px 24px', gap: '12px'
        }}>
          <button 
            onClick={handlePrev}
            disabled={step === 0}
            style={{
              padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: 'transparent', color: step === 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-main)',
              cursor: step === 0 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button 
            onClick={onEnd}
            style={{
              padding: '10px 16px', borderRadius: '10px', border: 'none',
              background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              fontWeight: '500', fontSize: '0.85rem', transition: 'color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'white'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Skip Tour
          </button>

          <button 
            onClick={handleNext}
            style={{
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              background: step === TOUR_STEPS.length - 1 
                ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' 
                : 'rgba(59, 130, 246, 0.15)',
              color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
              border: step === TOUR_STEPS.length - 1 ? 'none' : '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            {step === TOUR_STEPS.length - 1 ? "Let's Go!" : 'Next'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
