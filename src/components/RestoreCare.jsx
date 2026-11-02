import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  PhoneCall, ShieldCheck, Wind, Users2, Calendar, Clock,
  Video, MessageSquare, Check, X, Star, Sparkles
} from 'lucide-react';
import { SyncService } from '../lib/syncService';
import { useAuth } from '../context/AuthContext';

// 4 Distinct Colors specifically transitioning for each phase of the breath:
// 1. Breathe In -> Fresh Revitalizing Teal
// 2. Hold       -> Radiant Golden Amber
// 3. Breathe Out -> Warm Sunset Coral
// 4. Rest       -> Serene Twilight Violet
const BREATH_PHASES = [
  {
    key: 'in',
    title: 'Breathe In',
    sub: 'Inhale slowly and fill your lungs · 4s',
    scale: 1,
    accent: '#0D9488',
    bgBadge: '#CCFBF1',
    ring: 'radial-gradient(circle at 35% 30%, #5EEAD4, #14B8A6 60%, #0F766E 100%)',
    halo: 'radial-gradient(circle, rgba(20, 184, 166, 0.5), transparent 70%)',
    shadow: '0 20px 60px -10px rgba(20, 184, 166, 0.75)'
  },
  {
    key: 'hold',
    title: 'Hold',
    sub: 'Hold your breath gently and softly · 4s',
    scale: 1,
    accent: '#D97706',
    bgBadge: '#FEF3C7',
    ring: 'radial-gradient(circle at 35% 30%, #FDE047, #F59E0B 60%, #B45309 100%)',
    halo: 'radial-gradient(circle, rgba(245, 158, 11, 0.5), transparent 70%)',
    shadow: '0 20px 60px -10px rgba(245, 158, 11, 0.75)'
  },
  {
    key: 'out',
    title: 'Breathe Out',
    sub: 'Exhale completely, releasing all tension · 4s',
    scale: 0.62,
    accent: '#E76F51',
    bgBadge: '#FFE4E6',
    ring: 'radial-gradient(circle at 35% 30%, #FF8A65, #E76F51 60%, #C0392B 100%)',
    halo: 'radial-gradient(circle, rgba(231, 111, 81, 0.5), transparent 70%)',
    shadow: '0 20px 60px -10px rgba(231, 111, 81, 0.75)'
  },
  {
    key: 'rest',
    title: 'Rest',
    sub: 'Rest softly and let your nervous system reset · 4s',
    scale: 0.62,
    accent: '#7C3AED',
    bgBadge: '#EDE9FE',
    ring: 'radial-gradient(circle at 35% 30%, #C4B5FD, #8B5CF6 60%, #5B21B6 100%)',
    halo: 'radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent 70%)',
    shadow: '0 20px 60px -10px rgba(139, 92, 246, 0.75)'
  }
];

const COUNSELLORS = [
  {
    id: 'c1',
    name: 'Dr. Ananya Mukherjee',
    title: 'Senior Clinical Psychologist, M.Phil',
    exp: '9+ years exp',
    specialty: 'Student & Academic Stress, Anxiety, Self-esteem',
    languages: 'English, Hindi, Bengali',
    rating: 4.9,
    sessions: 420,
    avatar: '👩‍⚕️'
  },
  {
    id: 'c2',
    name: 'Vikramaditya Sharma',
    title: 'Licensed Family & Couples Therapist',
    exp: '11+ years exp',
    specialty: 'Family Dynamics, Marriage, Caregiver Fatigue',
    languages: 'Hindi, English, Punjabi',
    rating: 4.95,
    sessions: 610,
    avatar: '👨‍⚕️'
  },
  {
    id: 'c3',
    name: 'Pooja Venkatesh',
    title: 'Mindfulness & Trauma Specialist',
    exp: '7+ years exp',
    specialty: 'Workplace Burnout, Sleep Disorders, Senior Care',
    languages: 'English, Tamil, Hindi, Kannada',
    rating: 4.88,
    sessions: 340,
    avatar: '👩‍⚕️'
  }
];

export default function RestoreCare({
  breaths,
  bookings = [],
  onIncrementBreath,
  onAddBooking,
  onCancelBooking,
  onShowToast
}) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('breathe'); // 'breathe' | 'counsellors'

  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Booking state
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingType, setBookingType] = useState('Video');

  useEffect(() => {
    let timer = null;
    if (isBreathing) {
      timer = setInterval(() => {
        setPhaseIndex(prev => {
          const next = (prev + 1) % 4;
          if (next === 0) {
            setCyclesCompleted(c => {
              const newC = c + 1;
              if (newC >= 3) {
                // Done 3 box cycles!
                stopSession(true);
              }
              return newC;
            });
          }
          return next;
        });
      }, 4000);
    } else {
      setPhaseIndex(0);
    }
    return () => clearInterval(timer);
  }, [isBreathing]);

  const toggleBreathing = () => {
    if (isBreathing) {
      stopSession(false);
    } else {
      setIsBreathing(true);
      setCyclesCompleted(0);
      setPhaseIndex(0);
    }
  };

  const stopSession = (completed) => {
    setIsBreathing(false);
    if (completed) {
      onIncrementBreath();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#14B8A6', '#F59E0B', '#E76F51', '#8B5CF6']
        });
      } catch (e) {}
      onShowToast('Session complete! Great work centering your mind 🌿');
    }
  };

  const handleBook = (counsellor) => {
    setSelectedCounsellor(counsellor);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().slice(0, 10));
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate) return;
    const newBooking = {
      id: 'b_' + Date.now(),
      counsellor: selectedCounsellor.name,
      specialty: selectedCounsellor.specialty,
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
      createdAt: Date.now()
    };

    onAddBooking(newBooking);
    setSelectedCounsellor(null);
    onShowToast(`Consultation booked with ${selectedCounsellor.name} 🌿`);
  };

  // Current active phase data (auto-transitioning every 4s)
  const currentPhase = BREATH_PHASES[phaseIndex];
  const activeScale = isBreathing ? currentPhase.scale : 1;

  return (
    <div>
      {/* SOS Banner */}
      <div className="sos-banner">
        <div className="row">
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#F8D7D2', color: 'var(--coral)', display: 'grid', placeItems: 'center' }}>
            <PhoneCall size={20} />
          </div>
          <div>
            <b>Need immediate support right now?</b>
            <div style={{ marginTop: '2px' }}>
              <span>Tele-MANAS toll-free 24/7 hotline: <strong>14416</strong> · Emergency: <strong>112</strong></span>
            </div>
          </div>
        </div>
        <a
          href="tel:14416"
          className="btn btn-danger btn-sm"
          style={{ textDecoration: 'none', borderRadius: '999px', padding: '10px 20px' }}
        >
          Call 14416
        </a>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)' }}>Restore & Connect</h1>
        <div className="muted" style={{ fontSize: 'clamp(13.5px, 2vw, 15px)', marginTop: '4px' }}>
          Calming guided box breathing with phase color transitions, or confidential time with verified counsellors.
        </div>
      </div>

      {/* Segmented Control */}
      <div className="seg-nav">
        <button
          className={activeTab === 'breathe' ? 'active' : ''}
          onClick={() => setActiveTab('breathe')}
        >
          <Wind size={16} style={{ display: 'inline', marginRight: '6px' }} /> Guided Breathing
        </button>
        <button
          className={activeTab === 'counsellors' ? 'active' : ''}
          onClick={() => setActiveTab('counsellors')}
        >
          <Users2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> Verified Counsellors
        </button>
      </div>

      {/* BREATHE PANEL */}
      {activeTab === 'breathe' && (
        <div className="grid g-main">
          {/* Animated Circle Visualizer */}
          <div className="card" style={{ padding: '38px 28px', textAlign: 'center' }}>

            {/* Visualizer Area */}
            <div className="breath-wrap">
              {/* Outer Glowing Halo - Transitions color and scale per phase */}
              <div
                className="halo-circle"
                style={{
                  transform: `scale(${activeScale * 1.15})`,
                  background: isBreathing ? currentPhase.halo : BREATH_PHASES[0].halo
                }}
              />

              {/* Inner Solid Ring - Transitions color, shadow, and scale per phase */}
              <div
                className="ring-circle"
                style={{
                  transform: `scale(${activeScale})`,
                  background: isBreathing ? currentPhase.ring : BREATH_PHASES[0].ring,
                  boxShadow: isBreathing ? currentPhase.shadow : BREATH_PHASES[0].shadow
                }}
              >
                {isBreathing ? currentPhase.title : 'Ready'}
              </div>
            </div>

            {/* 4-PHASE COLOR TRANSITION STEP INDICATORS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '22px', flexWrap: 'wrap' }}>
              {BREATH_PHASES.map((p, idx) => {
                const isActive = isBreathing && phaseIndex === idx;
                return (
                  <div
                    key={p.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: isActive ? p.bgBadge : 'rgba(0,0,0,0.03)',
                      color: isActive ? p.accent : 'var(--muted)',
                      border: isActive ? `2px solid ${p.accent}` : '1px solid transparent',
                      boxShadow: isActive ? `0 4px 14px ${p.accent}40` : 'none',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.5s ease'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: p.accent,
                        boxShadow: isActive ? `0 0 8px ${p.accent}` : 'none',
                        transition: 'box-shadow 0.5s ease'
                      }}
                    />
                    <span>{p.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Phase Guidance Text */}
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '24px',
                marginTop: '18px',
                color: isBreathing ? currentPhase.accent : 'var(--navy)',
                transition: 'color 1s ease'
              }}
            >
              {isBreathing ? currentPhase.title : 'Breathe in as the circle expands'}
            </div>

            <div
              className="muted"
              style={{
                fontSize: '14px',
                margin: '6px 0 24px',
                minHeight: '22px'
              }}
            >
              {isBreathing ? currentPhase.sub : 'Box breathing · 4s in (Teal), hold (Gold), out (Coral), rest (Violet)'}
            </div>

            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <button
                type="button"
                className={`btn btn-block ${isBreathing ? 'btn-ghost' : 'btn-primary'}`}
                style={!isBreathing ? {
                  background: 'linear-gradient(135deg, #14B8A6, #E76F51)',
                  boxShadow: '0 10px 22px -10px #14B8A6'
                } : {}}
                onClick={toggleBreathing}
              >
                {isBreathing ? 'Stop session' : 'Begin Guided Session'}
              </button>
            </div>
          </div>

          {/* Details & Counter */}
          <div className="stack">
            <div className="card">
              <h3>The 4-Color Rhythm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#14B8A6', flexShrink: 0 }} />
                  <div><strong>1. Breathe In (Teal):</strong> Smoothly expands as oxygen enters the lungs.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                  <div><strong>2. Hold (Gold):</strong> Glows in calm stillness, retaining inner energy.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E76F51', flexShrink: 0 }} />
                  <div><strong>3. Breathe Out (Coral):</strong> Softly contracts, releasing physical tension.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#8B5CF6', flexShrink: 0 }} />
                  <div><strong>4. Rest (Violet):</strong> Resets the nervous system in peaceful recovery.</div>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                background: isBreathing ? `${currentPhase.bgBadge}80` : 'rgba(255,255,255,0.7)',
                border: isBreathing ? `1.5px solid ${currentPhase.accent}50` : '1px solid var(--line)',
                transition: 'all 1.5s ease'
              }}
            >
              <div className="eyebrow" style={{ color: isBreathing ? currentPhase.accent : 'var(--teal)', transition: 'color 1s ease' }}>
                Your Calming Practice
              </div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: isBreathing ? currentPhase.accent : 'var(--teal)',
                  marginTop: '4px',
                  transition: 'color 1s ease'
                }}
              >
                {breaths}
              </div>
              <div className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                Completed breathing sessions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COUNSELLORS PANEL */}
      {activeTab === 'counsellors' && (
        <div>
          {/* Privacy Note */}
          <div className="card" style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#F0FDF4', border: '1.5px solid #BBF7D0', marginBottom: '24px' }}>
            <ShieldCheck size={28} color="#15803D" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 1.55 }}>
              <strong>100% Confidential.</strong> Your Sahara personal notes and mood history are never accessible to therapists unless you explicitly discuss them during your live consultation.
            </p>
          </div>

          <div className="grid g-3" style={{ marginBottom: '36px' }}>
            {COUNSELLORS.map(c => (
              <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2A9D8F, #6FA8DC)', display: 'grid', placeItems: 'center', fontSize: '24px' }}>
                      {c.avatar}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '17px', marginBottom: '2px' }}>{c.name}</h3>
                      <div className="muted" style={{ fontSize: '12px' }}>{c.title}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E76F51', fontWeight: 600 }}>
                      <Star size={14} fill="#E76F51" /> {c.rating}
                    </span>
                    <span className="muted">• {c.exp}</span>
                    <span className="muted">• {c.sessions}+ sessions</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#4B5565', marginBottom: '12px' }}>
                    <strong>Focus:</strong> {c.specialty}
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>
                    <strong>Languages:</strong> {c.languages}
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => handleBook(c)}
                  >
                    <Calendar size={15} /> Book 1-on-1 Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          <div className="card">
            <h3>Your Scheduled Consultations</h3>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '14px' }}>
                No consultations booked yet. Select a certified professional above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.map(b => (
                  <div key={b.id} className="spread" style={{ padding: '14px 18px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--line)' }}>
                    <div>
                      <b style={{ fontSize: '15px', color: 'var(--navy)' }}>{b.counsellor}</b>
                      <div className="muted" style={{ fontSize: '12.5px', marginTop: '2px' }}>{b.specialty || b.spec}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12.5px', color: 'var(--teal)', fontWeight: 500 }}>
                        <span>📅 {b.date}</span>
                        <span>⏰ {b.time}</span>
                        <span>📹 {b.type} Session</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onCancelBooking(b.id)}
                      style={{ color: 'var(--danger)', fontSize: '12.5px' }}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedCounsellor && (
        <div className="modal-backdrop" onClick={() => setSelectedCounsellor(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--navy)' }}>Schedule Consultation</h3>
              <button onClick={() => setSelectedCounsellor(null)} style={{ color: 'var(--muted)' }}><X size={20} /></button>
            </div>

            <div style={{ background: '#F4F7FB', padding: '12px 16px', borderRadius: '14px', marginBottom: '20px' }}>
              <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{selectedCounsellor.name}</b>
              <div className="muted" style={{ fontSize: '12.5px' }}>{selectedCounsellor.title}</div>
            </div>

            <form onSubmit={confirmBooking}>
              <div className="field">
                <label className="label">Preferred Date</label>
                <input
                  type="date"
                  className="input"
                  value={bookingDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Preferred Time Slot</label>
                <select
                  className="select"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                >
                  <option value="10:00 AM">10:00 AM - 10:45 AM</option>
                  <option value="11:30 AM">11:30 AM - 12:15 PM</option>
                  <option value="03:00 PM">03:00 PM - 03:45 PM</option>
                  <option value="05:30 PM">05:30 PM - 06:15 PM</option>
                  <option value="08:00 PM">08:00 PM - 08:45 PM (Evening)</option>
                </select>
              </div>

              <div className="field">
                <label className="label">Consultation Format</label>
                <select
                  className="select"
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                >
                  <option value="Video">Confidential Video Call</option>
                  <option value="Audio">Voice Call</option>
                  <option value="Chat">Live Secure Chat</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '8px' }}>
                <Check size={18} /> Confirm Confidential Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
