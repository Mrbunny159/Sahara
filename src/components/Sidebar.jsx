import React from 'react';
import {
  Home, Smile, BookOpen, MessageCircle, Wind, Users2,
  User, ShieldCheck, ExternalLink, HeartHandshake, Sparkles
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab, onGoLanding }) {
  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="brand-wrap" onClick={() => setTab('home')}>
        <img
          src="/sahara-logo.jpg"
          alt="Sahara Logo"
          className="brand-logo-img"
        />
        <div>
          <b className="brand-title">SAHARA</b>
          <small className="brand-sub">Mental Wellness</small>
        </div>
      </div>

      <div style={{ padding: '0 10px', marginTop: '-10px' }}>
        <span style={{ fontFamily: 'var(--script)', fontSize: '15px', color: '#F4A261', fontWeight: 700 }}>
          जब कोई नहीं, तब सहारा.
        </span>
      </div>

      {/* Navigation Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="nav-label">Home</div>
        <button
          className={`nav-btn ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => setTab('home')}
        >
          <Home size={19} /> Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="nav-label">Feel</div>
        <button
          className={`nav-btn ${currentTab === 'mood' ? 'active' : ''}`}
          onClick={() => setTab('mood')}
        >
          <Smile size={19} /> Mood check-in
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="nav-label">Express</div>
        <button
          className={`nav-btn ${currentTab === 'journal' ? 'active' : ''}`}
          onClick={() => setTab('journal')}
        >
          <BookOpen size={19} /> Private Journal
        </button>
        <button
          className={`nav-btn ${currentTab === 'mitra' ? 'active' : ''}`}
          onClick={() => setTab('mitra')}
        >
          <MessageCircle size={19} /> Talk to Mitra
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="nav-label">Restore & Connect</div>
        <button
          className={`nav-btn ${currentTab === 'breathe' ? 'active' : ''}`}
          onClick={() => setTab('breathe')}
        >
          <Wind size={19} /> Guided Breathing
        </button>
        <button
          className={`nav-btn ${currentTab === 'counsellors' ? 'active' : ''}`}
          onClick={() => setTab('counsellors')}
        >
          <Users2 size={19} /> Counsellors
        </button>
        <button
          className={`nav-btn ${currentTab === 'community' ? 'active' : ''}`}
          onClick={() => setTab('community')}
        >
          <HeartHandshake size={19} /> Support Circles
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="nav-label">Account</div>
        <button
          className={`nav-btn ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => setTab('profile')}
        >
          <User size={19} /> Profile & privacy
        </button>
      </div>

      {/* Return to Landing */}
      <button
        onClick={onGoLanding}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          color: '#8A9BB8',
          fontSize: '12.5px',
          marginTop: '6px',
          borderRadius: '10px',
          transition: '0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#8A9BB8'; e.currentTarget.style.background = 'transparent'; }}
      >
        <ExternalLink size={14} /> Back to Landing Page
      </button>

      {/* Privacy Footnote */}
      <div className="side-foot">
        <b>🔒 Private by design</b>
        Your check-ins and journal stay safe and encrypted.
      </div>
    </aside>
  );
}

