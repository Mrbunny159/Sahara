import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  PhoneCall, ShieldCheck, Wind, Users2, Calendar, Clock,
  Video, MessageSquare, Check, X, Star, Palette, Sparkles
} from 'lucide-react';
import { SyncService } from '../lib/syncService';
import { useAuth } from '../context/AuthContext';

// Color themes for guided breathing sessions
export const BREATHING_THEMES = [
  {
    id: 'dynamic',
    name: 'Dynamic Flow',
    description: 'Shifts color on each phase of the breath',
    dot: 'linear-gradient(135deg, #2A9D8F 0%, #F4A261 40%, #E76F51 70%, #8E7CC3 100%)',
    confettiColors: ['#2A9D8F', '#F4A261', '#E76F51', '#8E7CC3'],
    phases: {
      in: {
        ring: 'radial-gradient(circle at 35% 30%, #E0F7F6, #2A9D8F 70%, #16655D)',
        halo: 'radial-gradient(circle, rgba(42, 157, 143, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(42, 157, 143, 0.65)',
        accent: '#2A9D8F',
        sub: 'Inhale slowly and fill your lungs with fresh air · 4s'
      },
      hold: {
        ring: 'radial-gradient(circle at 35% 30%, #FEF3C7, #F4A261 70%, #D97706)',
        halo: 'radial-gradient(circle, rgba(244, 162, 97, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(244, 162, 97, 0.65)',
        accent: '#F4A261',
        sub: 'Hold gently and savor the stillness · 4s'
      },
      out: {
        ring: 'radial-gradient(circle at 35% 30%, #FFE4E6, #E76F51 70%, #BE123C)',
        halo: 'radial-gradient(circle, rgba(231, 111, 81, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(231, 111, 81, 0.65)',
        accent: '#E76F51',
        sub: 'Exhale completely, releasing all tension · 4s'
      },
      rest: {
        ring: 'radial-gradient(circle at 35% 30%, #EDE9FE, #8E7CC3 70%, #6D28D9)',
        halo: 'radial-gradient(circle, rgba(142, 124, 195, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(142, 124, 195, 0.65)',
        accent: '#8E7CC3',
        sub: 'Rest softly and let your nervous system reset · 4s'
      }
    }
  },
  {
    id: 'oasis',
    name: 'Oasis Teal',
    description: 'Calm, centering & clarity',
    dot: '#2A9D8F',
    confettiColors: ['#2A9D8F', '#56C2B4', '#1E7A70', '#8FB9A8'],
    phases: {
      in: {
        ring: 'radial-gradient(circle at 35% 30%, #D1FAE5, #2A9D8F 70%, #065F46)',
        halo: 'radial-gradient(circle, rgba(42, 157, 143, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(42, 157, 143, 0.65)',
        accent: '#2A9D8F',
        sub: 'Inhale healing oxygen and clarity · 4s'
      },
      hold: {
        ring: 'radial-gradient(circle at 35% 30%, #A7F3D0, #10B981 70%, #047857)',
        halo: 'radial-gradient(circle, rgba(16, 185, 129, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(16, 185, 129, 0.6)',
        accent: '#10B981',
        sub: 'Hold gently in tranquil presence · 4s'
      },
      out: {
        ring: 'radial-gradient(circle at 35% 30%, #E6FFFA, #14B8A6 70%, #0F766E)',
        halo: 'radial-gradient(circle, rgba(20, 184, 166, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(20, 184, 166, 0.6)',
        accent: '#14B8A6',
        sub: 'Exhale tension into calm water · 4s'
      },
      rest: {
        ring: 'radial-gradient(circle at 35% 30%, #CCFBF1, #0D9488 70%, #115E59)',
        halo: 'radial-gradient(circle, rgba(13, 148, 136, 0.4), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(13, 148, 136, 0.6)',
        accent: '#0D9488',
        sub: 'Rest in quiet, centered balance · 4s'
      }
    }
  },
  {
    id: 'sunset',
    name: 'Desert Sunset',
    description: 'Warmth, courage & comfort',
    dot: '#E76F51',
    confettiColors: ['#E76F51', '#F4A261', '#FB923C', '#C2410C'],
    phases: {
      in: {
        ring: 'radial-gradient(circle at 35% 30%, #FFEDD5, #FB923C 70%, #C2410C)',
        halo: 'radial-gradient(circle, rgba(251, 146, 60, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(251, 146, 60, 0.65)',
        accent: '#FB923C',
        sub: 'Breathe in gentle sunset warmth · 4s'
      },
      hold: {
        ring: 'radial-gradient(circle at 35% 30%, #FEE2E2, #F87171 70%, #B91C1C)',
        halo: 'radial-gradient(circle, rgba(248, 113, 113, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(248, 113, 113, 0.65)',
        accent: '#F87171',
        sub: 'Hold warmth deep in your chest · 4s'
      },
      out: {
        ring: 'radial-gradient(circle at 35% 30%, #FFE4E6, #E76F51 70%, #991B1B)',
        halo: 'radial-gradient(circle, rgba(231, 111, 81, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(231, 111, 81, 0.65)',
        accent: '#E76F51',
        sub: 'Exhale worries like warm sand · 4s'
      },
      rest: {
        ring: 'radial-gradient(circle at 35% 30%, #FFF7ED, #EA580C 70%, #7C2D12)',
        halo: 'radial-gradient(circle, rgba(234, 88, 12, 0.4), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(234, 88, 12, 0.6)',
        accent: '#EA580C',
        sub: 'Rest safely under the desert twilight · 4s'
      }
    }
  },
  {
    id: 'lavender',
    name: 'Twilight Lavender',
    description: 'Anxiety relief & deep sleep',
    dot: '#8E7CC3',
    confettiColors: ['#8E7CC3', '#A78BFA', '#D88BB0', '#7C3AED'],
    phases: {
      in: {
        ring: 'radial-gradient(circle at 35% 30%, #F5F3FF, #A78BFA 70%, #5B21B6)',
        halo: 'radial-gradient(circle, rgba(167, 139, 250, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(167, 139, 250, 0.65)',
        accent: '#A78BFA',
        sub: 'Inhale soft evening quiet · 4s'
      },
      hold: {
        ring: 'radial-gradient(circle at 35% 30%, #EDE9FE, #8E7CC3 70%, #4C1D95)',
        halo: 'radial-gradient(circle, rgba(142, 124, 195, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(142, 124, 195, 0.65)',
        accent: '#8E7CC3',
        sub: 'Hold and let thoughts soften · 4s'
      },
      out: {
        ring: 'radial-gradient(circle at 35% 30%, #FCE7F3, #F472B6 70%, #9D174D)',
        halo: 'radial-gradient(circle, rgba(244, 114, 182, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(244, 114, 182, 0.65)',
        accent: '#F472B6',
        sub: 'Exhale and release the heavy day · 4s'
      },
      rest: {
        ring: 'radial-gradient(circle at 35% 30%, #F3E8FF, #7C3AED 70%, #3B0764)',
        halo: 'radial-gradient(circle, rgba(124, 58, 237, 0.4), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(124, 58, 237, 0.6)',
        accent: '#7C3AED',
        sub: 'Drift peacefully into restful calm · 4s'
      }
    }
  },
  {
    id: 'golden',
    name: 'Golden Dawn',
    description: 'Vitality, optimism & morning start',
    dot: '#F59E0B',
    confettiColors: ['#F59E0B', '#FBBF24', '#F4A261', '#D97706'],
    phases: {
      in: {
        ring: 'radial-gradient(circle at 35% 30%, #FEF9C3, #FBBF24 70%, #B45309)',
        halo: 'radial-gradient(circle, rgba(251, 191, 36, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(251, 191, 36, 0.65)',
        accent: '#FBBF24',
        sub: 'Inhale morning vitality and hope · 4s'
      },
      hold: {
        ring: 'radial-gradient(circle at 35% 30%, #FEF3C7, #F59E0B 70%, #92400E)',
        halo: 'radial-gradient(circle, rgba(245, 158, 11, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(245, 158, 11, 0.65)',
        accent: '#F59E0B',
        sub: 'Hold clarity and inner optimism · 4s'
      },
      out: {
        ring: 'radial-gradient(circle at 35% 30%, #FFEDD5, #FB923C 70%, #9A3412)',
        halo: 'radial-gradient(circle, rgba(251, 146, 60, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(251, 146, 60, 0.65)',
        accent: '#FB923C',
        sub: 'Exhale doubt and lethargy · 4s'
      },
      rest: {
        ring: 'radial-gradient(circle at 35% 30%, #FFFBEB, #D97706 70%, #78350F)',
        halo: 'radial-gradient(circle, rgba(217, 119, 6, 0.4), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(217, 119, 6, 0.6)',
        accent: '#D97706',
        sub: 'Ready for a bright, purposeful day · 4s'
      }
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Immense stillness & quiet mind',
    dot: '#3B82F6',
    confettiColors: ['#3B82F6', '#60A5FA', '#1D4ED8', '#6EE7B7'],
    phases: {
      in: {
        ring: 'radial-gradient(circle at 35% 30%, #EFF6FF, #60A5FA 70%, #1E40AF)',
        halo: 'radial-gradient(circle, rgba(96, 165, 250, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(96, 165, 250, 0.65)',
        accent: '#3B82F6',
        sub: 'Inhale deep ocean stillness · 4s'
      },
      hold: {
        ring: 'radial-gradient(circle at 35% 30%, #DBEAFE, #3B82F6 70%, #1D4ED8)',
        halo: 'radial-gradient(circle, rgba(59, 130, 246, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(59, 130, 246, 0.65)',
        accent: '#1D4ED8',
        sub: 'Hold and feel weightless · 4s'
      },
      out: {
        ring: 'radial-gradient(circle at 35% 30%, #E0F2FE, #0284C7 70%, #0369A1)',
        halo: 'radial-gradient(circle, rgba(2, 132, 199, 0.45), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(2, 132, 199, 0.65)',
        accent: '#0284C7',
        sub: 'Exhale like waves washing onto the shore · 4s'
      },
      rest: {
        ring: 'radial-gradient(circle at 35% 30%, #F0F9FF, #0369A1 70%, #0C4A6E)',
        halo: 'radial-gradient(circle, rgba(3, 105, 161, 0.4), transparent 70%)',
        shadow: '0 20px 50px -10px rgba(3, 105, 161, 0.6)',
        accent: '#0369A1',
        sub: 'Rest in boundless peaceful waters · 4s'
      }
    }
  }
];

const PHASE_KEYS = ['in', 'hold', 'out', 'rest'];
const PHASE_TITLES = ['Breathe In', 'Hold', 'Breathe Out', 'Rest'];
const PHASE_SCALES = [1, 1, 0.62, 0.62];

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

  // Selected Color Theme (defaults to dynamic flow)
  const [selectedThemeId, setSelectedThemeId] = useState(() => {
    try {
      return localStorage.getItem('sahara_breathing_theme') || 'dynamic';
    } catch {
      return 'dynamic';
    }
  });

  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Booking state
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingType, setBookingType] = useState('Video');

  const currentTheme = BREATHING_THEMES.find(t => t.id === selectedThemeId) || BREATHING_THEMES[0];

  const handleSelectTheme = (themeId) => {
    setSelectedThemeId(themeId);
    try {
      localStorage.setItem('sahara_breathing_theme', themeId);
    } catch (e) {}
  };

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
          colors: currentTheme.confettiColors
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

  // Determine current active phase visuals
  const activePhaseKey = PHASE_KEYS[phaseIndex];
  const activePhaseData = currentTheme.phases[activePhaseKey];
  const activeTitle = PHASE_TITLES[phaseIndex];
  const activeScale = isBreathing ? PHASE_SCALES[phaseIndex] : 1;

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

      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ fontSize: '32px', color: 'var(--navy)' }}>Restore & Connect</h1>
        <div className="muted" style={{ fontSize: '15px', marginTop: '4px' }}>
          Calming guided box breathing, or confidential time with verified counsellors.
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
          <div className="card" style={{ padding: '34px 28px', textAlign: 'center' }}>

            {/* COLOR THEME SELECTOR */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '10px' }}>
                <Palette size={15} style={{ color: activePhaseData.accent }} />
                <span>Choose Session Color Theme</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {BREATHING_THEMES.map((theme) => {
                  const isSelected = theme.id === selectedThemeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: isSelected ? `2px solid ${theme.phases.in.accent}` : '1px solid var(--line)',
                        background: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                        boxShadow: isSelected ? `0 4px 14px -2px ${theme.phases.in.accent}40` : 'none',
                        fontSize: '12.5px',
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? 'var(--navy)' : 'var(--muted)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: theme.dot,
                          display: 'inline-block',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                        }}
                      />
                      <span>{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visualizer Area */}
            <div className="breath-wrap">
              <div
                className="halo-circle"
                style={{
                  transform: `scale(${activeScale * 1.15})`,
                  background: activePhaseData.halo,
                  transition: 'transform 4s ease-in-out, background 1.2s ease'
                }}
              />
              <div
                className="ring-circle"
                style={{
                  transform: `scale(${activeScale})`,
                  background: isBreathing ? activePhaseData.ring : currentTheme.phases.in.ring,
                  boxShadow: isBreathing ? activePhaseData.shadow : currentTheme.phases.in.shadow,
                  transition: 'transform 4s ease-in-out, background 1.2s ease, box-shadow 1.2s ease'
                }}
              >
                {isBreathing ? activeTitle : 'Ready'}
              </div>
            </div>

            {/* Active Phase Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
              {PHASE_TITLES.map((title, idx) => {
                const isActive = isBreathing && phaseIndex === idx;
                const phaseKey = PHASE_KEYS[idx];
                const phaseColor = currentTheme.phases[phaseKey].accent;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: isActive ? `${phaseColor}20` : 'rgba(0,0,0,0.03)',
                      color: isActive ? phaseColor : 'var(--muted)',
                      border: isActive ? `1.5px solid ${phaseColor}` : '1px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? phaseColor : '#A0AEC0' }}></span>
                    <span>{title}</span>
                  </div>
                );
              })}
            </div>

            {/* Phase Guidance Text */}
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: '22px',
                marginTop: '14px',
                color: isBreathing ? activePhaseData.accent : 'var(--navy)',
                transition: 'color 1s ease'
              }}
            >
              {isBreathing ? activeTitle : 'Breathe in as the circle expands'}
            </div>
            <div className="muted" style={{ fontSize: '13.5px', margin: '6px 0 24px', minHeight: '20px' }}>
              {isBreathing ? activePhaseData.sub : 'Box breathing · 4s in, hold, out, hold'}
            </div>

            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <button
                type="button"
                className={`btn btn-block ${isBreathing ? 'btn-ghost' : 'btn-primary'}`}
                style={!isBreathing ? {
                  background: `linear-gradient(135deg, ${activePhaseData.accent}, ${currentTheme.phases.out.accent})`,
                  boxShadow: `0 10px 22px -10px ${activePhaseData.accent}`
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
              <h3>Why Box Breathing Works</h3>
              <p className="muted" style={{ fontSize: '14.5px', lineHeight: 1.65 }}>
                Slow, structured breathing activates the vagus nerve and triggers your parasympathetic nervous system. A two-minute session immediately relieves chest tightness, grounds racing thoughts before exams, and eases you into restful sleep.
              </p>
            </div>

            <div
              className="card"
              style={{
                background: `linear-gradient(135deg, ${activePhaseData.accent}18, ${currentTheme.phases.hold.accent}14)`,
                border: `1.5px solid ${activePhaseData.accent}30`,
                transition: 'all 1.2s ease'
              }}
            >
              <div className="eyebrow" style={{ color: activePhaseData.accent }}>Your Calming Practice</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: activePhaseData.accent, marginTop: '4px', transition: 'color 1s ease' }}>
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
