import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

const TOUR_STEPS = [
  {
    route: '/dashboard',
    target: '#tour-logo',
    title: 'Welcome to TradeWise! 🎉',
    description: 'This is TradeWise — your risk-free stock market simulator. Practice investing through 18 years of real Indian market history.',
    position: 'bottom'
  },
  {
    route: '/dashboard',
    target: '#tour-nav',
    title: 'Navigation 🧭',
    description: 'Use these tabs to switch between your Portfolio dashboard, the Market to browse stocks, AI Analysis for portfolio health checks, and the Academy to learn investing.',
    position: 'bottom'
  },
  {
    route: '/dashboard',
    target: '#tour-metrics',
    title: 'Portfolio Metrics 💰',
    description: 'Your key financial stats at a glance — Net Worth, Market Value of holdings, Available Cash, and total Profit & Loss. These update in real-time as the simulation runs.',
    position: 'bottom'
  },
  {
    route: '/dashboard',
    target: '#tour-settings',
    title: 'Settings & Time Machine ⚙️',
    description: 'Open Settings to control the simulation engine. Start/pause time, change speed, jump to any date between 2005-2023, or reset your account. You can also start this tour from here!',
    position: 'bottom-end'
  },
  {
    route: '/dashboard',
    target: '#tour-profile',
    title: 'Your Profile 👤',
    description: 'View and edit your profile — update your username, income, expenses, and risk preferences. You can also log out from here.',
    position: 'bottom-end'
  },
  {
    route: '/market',
    target: '#tour-market-controls',
    title: 'Market Controls 📊',
    description: 'Sort stocks by top gainers, losers, or alphabetically. Choose timeframes from 1 week to 1 year. Use the AI Architect button to get monthly AI-powered investment recommendations.',
    position: 'bottom'
  },
  {
    route: '/market',
    target: '.asset-row',
    title: 'Stock Cards 📈',
    description: 'Each card shows a company\'s current price and performance. Click any stock to see its candlestick chart, execute buy/sell trades, and set stop-loss orders.',
    position: 'top'
  },
  {
    route: '/analysis',
    target: '.page-container',
    title: 'AI Portfolio Analysis 🧠',
    description: 'Get an AI health check of your portfolio. It scores your diversification, identifies strengths and weaknesses, and gives personalized improvement suggestions based on your risk profile.',
    position: 'top'
  },
  {
    route: '/academy',
    target: '.page-container',
    title: 'Stock Market Academy 🎓',
    description: 'Learn investing fundamentals through interactive lessons — stocks, dividends, market crashes, diversification, and more. Your progress is saved automatically.',
    position: 'top'
  },
  {
    route: '/dashboard',
    target: '#tour-logo',
    title: "You're Ready! 🚀",
    description: "Head to the Market, pick your first stock, and start building your portfolio! Pro tip: diversify across sectors and use stop-losses to protect your capital. Good luck!",
    position: 'bottom'
  }
];

export default function TourOverlay({ onEnd }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const current = TOUR_STEPS[step];
  const tooltipRef = useRef(null);

  const findAndHighlight = useCallback(() => {
    // Small delay for DOM to settle after navigation
    const timer = setTimeout(() => {
      const el = document.querySelector(current.target);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        // Scroll element into view if needed
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // Fallback: center of screen
        setRect({ top: window.innerHeight / 2 - 50, left: window.innerWidth / 2 - 150, width: 300, height: 100 });
      }
      setTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [current.target]);

  // Navigate and find target
  useEffect(() => {
    if (current.route && location.pathname !== current.route) {
      setTransitioning(true);
      navigate(current.route);
    }
    // Use a slight delay for navigation to complete
    const cleanup = findAndHighlight();
    return cleanup;
  }, [step]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => findAndHighlight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [findAndHighlight]);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setTransitioning(true);
      setStep(step + 1);
    } else {
      onEnd();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setTransitioning(true);
      setStep(step - 1);
    }
  };

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!rect) return { opacity: 0 };
    
    const tooltipWidth = 380;
    const tooltipPad = 16;
    const pos = current.position || 'bottom';
    let top, left;

    if (pos === 'bottom' || pos === 'bottom-end') {
      top = rect.top + rect.height + tooltipPad;
      left = pos === 'bottom-end' 
        ? Math.min(rect.left + rect.width - tooltipWidth, window.innerWidth - tooltipWidth - 20)
        : rect.left;
    } else {
      // top
      top = rect.top - tooltipPad - 250; // approximate tooltip height
      left = rect.left;
    }

    // Clamp to viewport
    left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));
    top = Math.max(20, Math.min(top, window.innerHeight - 300));

    return {
      position: 'fixed', top: `${top}px`, left: `${left}px`,
      width: `${tooltipWidth}px`, opacity: transitioning ? 0 : 1,
      transition: 'opacity 0.3s ease'
    };
  };

  const padding = 8;

  return (
    <>
      {/* Dark overlay with spotlight cutout using clip-path */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 2000, pointerEvents: 'none'
      }}>
        {/* Overlay */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {rect && (
                <rect 
                  x={rect.left - padding} y={rect.top - padding} 
                  width={rect.width + padding * 2} height={rect.height + padding * 2} 
                  rx="12" fill="black"
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.78)" mask="url(#tour-mask)" />
        </svg>

        {/* Spotlight border glow */}
        {rect && (
          <div style={{
            position: 'fixed',
            top: `${rect.top - padding}px`, left: `${rect.left - padding}px`,
            width: `${rect.width + padding * 2}px`, height: `${rect.height + padding * 2}px`,
            border: '2px solid rgba(79, 142, 247, 0.5)',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(79, 142, 247, 0.25), inset 0 0 20px rgba(79, 142, 247, 0.08)',
            transition: 'all 0.4s ease',
            pointerEvents: 'none'
          }} />
        )}
      </div>

      {/* Clickable overlay to prevent interaction with background */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2001 }} 
        onClick={(e) => e.stopPropagation()}
      />

      {/* Tooltip card */}
      <div ref={tooltipRef} style={{ ...getTooltipStyle(), zIndex: 2002, pointerEvents: 'auto' }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(18,18,28,0.98), rgba(10,10,18,0.98))',
          border: '1px solid rgba(79, 142, 247, 0.2)',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(79, 142, 247, 0.08)'
        }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '3px', padding: '14px 20px 0' }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: '3px', borderRadius: '2px',
                background: i <= step ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
                {step + 1} / {TOUR_STEPS.length}
              </span>
              <button 
                onClick={onEnd}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%',
                  width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={12} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>
              {current.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              {current.description}
            </p>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.04)'
          }}>
            <button 
              onClick={handlePrev}
              disabled={step === 0}
              style={{
                padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'transparent', color: step === 0 ? 'rgba(255,255,255,0.15)' : 'var(--text-main)',
                cursor: step === 0 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '0.82rem',
                display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
              }}
            >
              <ChevronLeft size={14} /> Back
            </button>

            <button 
              onClick={onEnd}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: 'none',
                background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
                fontWeight: '500', fontSize: '0.78rem'
              }}
            >
              Skip
            </button>

            <button 
              onClick={handleNext}
              style={{
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: step === TOUR_STEPS.length - 1 
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' 
                  : 'rgba(59, 130, 246, 0.15)',
                color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem',
                display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s',
                border: step === TOUR_STEPS.length - 1 ? 'none' : '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              {step === TOUR_STEPS.length - 1 ? "Let's Go!" : 'Next'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
