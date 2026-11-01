import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Smile, BookOpen, MessageCircle, Wind, Users2, Sparkles, PhoneCall } from 'lucide-react';

const MOODS = [
  { e: '😔', l: 'Low', v: 1 },
  { e: '😕', l: 'Uneasy', v: 2 },
  { e: '😐', l: 'Okay', v: 3 },
  { e: '🙂', l: 'Good', v: 4 },
  { e: '😊', l: 'Great', v: 5 }
];

const TIPS = [
  'Take three slow, conscious breaths before you respond to something difficult.',
  'Naming a heavy feeling out loud often helps it lose its grip on you.',
  'Step outside for two minutes. Natural daylight resets the mind quickly.',
  'Rest is an essential part of wellness, not something you have to earn.',
  'Finishing one tiny task today is a genuine victory. Celebrate it.',
  'Speak to yourself today with the same compassion you show a close friend.'
];

export default function Dashboard({
  setTab,
  moods,
  entries,
  onSaveQuickMood
}) {
  const { user } = useAuth();

  // Greetings logic
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.displayName || 'Friend';

  const todayIso = new Date().toISOString().slice(0, 10);
  const checkedToday = moods.some(m => m.date === todayIso);

  // Streak calculation
  const streak = () => {
    const daySet = new Set(moods.map(m => m.date));
    let n = 0;
    const d = new Date();
    while (daySet.has(d.toISOString().slice(0, 10))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  };

  // Today's Tip
  const tip = TIPS[new Date().getDate() % TIPS.length];

  // SVG Chart points calculation
  const W = 600, H = 190, P = 20;
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const pts = days.map((dayStr, i) => {
    const m = moods.filter(x => x.date === dayStr).pop();
    return {
      x: P + i * ((W - 2 * P) / 13),
      y: m ? H - P - ((m.v - 1) / 4) * (H - 2 * P) : null,
      val: m ? m.v : null
    };
  });
  const realPts = pts.filter(p => p.y !== null);

  return (
    <div>
      {/* Mobile Brand Top */}
      <div style={{ display: 'none', alignItems: 'center', gap: '10px', marginBottom: '18px' }} className="mobile-brand">
        <img
          src="/sahara-logo.jpg"
          alt="Sahara"
          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <b style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--navy)' }}>SAHARA</b>
          <small style={{ display: 'block', fontSize: '11px', color: 'var(--coral)', fontFamily: 'var(--script)', marginTop: '-2px' }}>
            जब कोई नहीं, तब सहारा
          </small>
        </div>
      </div>

      {/* Hero Card */}
      <div className="hero-banner">
        <div className="eyebrow">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1>
          {part}, <span className="hi">{displayName}</span>
        </h1>
        <p>
          {checkedToday
            ? 'You have checked in with yourself today. That attention to your mind matters.'
            : 'How are you feeling right now? Choose what resonates best.'}
        </p>

        <div className="hero-moods">
          {MOODS.map((m, idx) => (
            <button
              key={idx}
              className="mpill"
              onClick={() => onSaveQuickMood(m)}
            >
              <span className="e">{m.e}</span>
              <span>{m.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Explore by Category */}
      <div className="section-head">
        <h2>Explore by category</h2>
        <p>Pick what you need right now</p>
      </div>

      <div className="grid g-4" style={{ marginBottom: '32px' }}>
        {/* Feel */}
        <div className="cat-card c-feel">
          <div className="cat-ico"><Smile size={24} /></div>
          <span className="tag-badge">For clarity</span>
          <h2>Feel</h2>
          <p>Notice how you are doing, day by day.</p>
          <ul>
            <li>
              <button onClick={() => setTab('mood')}>
                Mood check-in <ArrowRight size={16} />
              </button>
            </li>
          </ul>
        </div>

        {/* Express */}
        <div className="cat-card c-express">
          <div className="cat-ico"><BookOpen size={24} /></div>
          <span className="tag-badge">For expression</span>
          <h2>Express</h2>
          <p>Put thoughts into words, and talk them through.</p>
          <ul>
            <li>
              <button onClick={() => setTab('journal')}>
                Private journal <ArrowRight size={16} />
              </button>
            </li>
            <li>
              <button onClick={() => setTab('mitra')}>
                Talk to Mitra <ArrowRight size={16} />
              </button>
            </li>
          </ul>
        </div>

        {/* Restore */}
        <div className="cat-card c-restore">
          <div className="cat-ico"><Wind size={24} /></div>
          <span className="tag-badge">For calm</span>
          <h2>Restore</h2>
          <p>Slow down the body, and reset the mind.</p>
          <ul>
            <li>
              <button onClick={() => setTab('breathe')}>
                Guided breathing <ArrowRight size={16} />
              </button>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div className="cat-card c-connect">
          <div className="cat-ico"><Users2 size={24} /></div>
          <span className="tag-badge">For support</span>
          <h2>Connect</h2>
          <p>Book time with a verified counsellor.</p>
          <ul>
            <li>
              <button onClick={() => setTab('counsellors')}>
                Find a counsellor <ArrowRight size={16} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Generations */}
      <div className="section-head">
        <h2>Built for every generation</h2>
        <p>One space, for everyone in the family</p>
      </div>
      <div className="gen-row" style={{ marginBottom: '32px' }}>
        <span className="gen-pill">🎓 Students (13–19)</span>
        <span className="gen-pill">💼 Working adults (20–55)</span>
        <span className="gen-pill">🏡 Caregivers</span>
        <span className="gen-pill">🌿 Parents</span>
        <span className="gen-pill">🧓 Elders (55–70+)</span>
      </div>

      {/* 14-day Trend & Stats */}
      <div className="grid g-main">
        {/* Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3>Your last 14 days</h3>
            <span className="muted" style={{ fontSize: '12px' }}>Mood spectrum (Low → Great)</span>
          </div>

          <svg viewBox="0 0 600 190" style={{ width: '100%', height: '190px' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E76F51" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8E7CC3" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F4A261" />
                <stop offset="100%" stopColor="#8E7CC3" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[1, 3, 5].map(v => {
              const y = H - P - ((v - 1) / 4) * (H - 2 * P);
              return (
                <line
                  key={v}
                  x1={P}
                  x2={W - P}
                  y1={y}
                  y2={y}
                  stroke="#E8E2EE"
                  strokeDasharray="4 6"
                />
              );
            })}

            {realPts.length < 2 ? (
              <text
                x={W / 2}
                y={H / 2}
                textAnchor="middle"
                fill="#667085"
                fontSize="14"
                fontFamily="Inter, sans-serif"
              >
                Check in on a few days to see your trend curve 🌿
              </text>
            ) : (
              <>
                {/* Area under curve */}
                <path
                  d={`${realPts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')} L${realPts[realPts.length - 1].x},${H - P} L${realPts[0].x},${H - P} Z`}
                  fill="url(#chartGrad)"
                />
                {/* Curve line */}
                <path
                  d={realPts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Dots */}
            {realPts.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r="5.5"
                fill="#fff"
                stroke="#E76F51"
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </div>

        {/* Stats & Daily Reminder */}
        <div className="stack">
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', gap: '8px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--navy)' }}>
                {moods.length}
              </div>
              <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Check-ins</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--navy)' }}>
                {entries.length}
              </div>
              <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Entries</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 600, color: 'var(--coral)' }}>
                {streak()}
              </div>
              <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Day Streak</div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(216, 139, 176, 0.22), rgba(111, 168, 220, 0.22))' }}>
            <div className="eyebrow" style={{ color: '#5B4A8B' }}>Today's Gentle Reminder</div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', lineHeight: 1.45, color: 'var(--navy)' }}>
              "{tip}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

