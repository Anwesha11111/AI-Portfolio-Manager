import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    // Call onComplete after the fade out transition completes (0.5s later)
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0a0f', // Dark background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.5s ease-out, visibility 0.5s',
        opacity: isFadingOut ? 0 : 1,
        visibility: isFadingOut ? 'hidden' : 'visible',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Animated Stock Graph SVG */}
        <div style={{ width: '160px', height: '120px', marginBottom: '24px' }}>
          <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Lines */}
            <path d="M10 90 L130 90 M10 70 L130 70 M10 50 L130 50 M10 30 L130 30 M10 10 L130 10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path d="M10 90 L10 10 M40 90 L40 10 M70 90 L70 10 M100 90 L100 10 M130 90 L130 10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            
            {/* Area Fill */}
            <path
              d="M10 80 L16 77 L22 79 L28 72 L34 74 L40 68 L46 65 L52 67 L58 60 L64 58 L70 52 L76 54 L82 45 L88 42 L94 44 L100 35 L106 32 L112 34 L118 25 L124 20 L130 18 L130 90 L10 90 Z"
              fill="url(#splash-area-gradient)"
              className="splash-graph-area"
            />

            {/* Rising Line */}
            <path
              d="M10 80 L16 77 L22 79 L28 72 L34 74 L40 68 L46 65 L52 67 L58 60 L64 58 L70 52 L76 54 L82 45 L88 42 L94 44 L100 35 L106 32 L112 34 L118 25 L124 20 L130 18"
              stroke="url(#splash-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="splash-graph-line"
            />

            {/* Glowing dot at the end */}
            <circle cx="130" cy="18" r="4" fill="#a855f7" className="splash-graph-dot" />
            
            <defs>
              <linearGradient id="splash-gradient" x1="10" y1="80" x2="130" y2="15" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="splash-area-gradient" x1="10" y1="15" x2="10" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* App Name */}
        <h1
          style={{
            margin: 0,
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            animation: 'fadeInUp 1s ease-out',
          }}
        >
          TradeWise
        </h1>
      </div>

      <style>{`
        .splash-graph-area {
          opacity: 0;
          animation: fadeInArea 1s ease-out 0.5s forwards;
        }
        .splash-graph-line {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawLine 1.8s ease-out forwards;
        }
        .splash-graph-dot {
          opacity: 0;
          animation: fadeInDot 0.5s ease-out 1.5s forwards;
        }
        @keyframes fadeInArea {
          to {
            opacity: 1;
          }
        }
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeInDot {
          to {
            opacity: 1;
            box-shadow: 0 0 15px #a855f7;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
