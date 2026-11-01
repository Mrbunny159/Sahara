import React, { useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-container">
      {/* Radiant ambient glow */}
      <div className="splash-aura"></div>

      {/* Sahara Logo with smooth scale and soft shadow */}
      <div className="splash-logo-box">
        <img
          src="/sahara-logo.jpg"
          alt="Sahara Logo"
          className="splash-logo-img"
        />
      </div>

      <h1 className="splash-title">SAHARA</h1>
      <p className="splash-tagline">जब कोई नहीं, तब सहारा</p>
      <div className="splash-script">Mental Wellness Support Platform</div>

      <div className="splash-loader">
        <div style={{
          width: '18px',
          height: '18px',
          border: '2px solid rgba(244,162,97,0.3)',
          borderTopColor: '#F4A261',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <span>Opening your private sanctuary...</span>
      </div>

      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          bottom: '24px',
          color: '#8A9BB8',
          fontSize: '12.5px',
          textDecoration: 'underline',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        Skip intro
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

