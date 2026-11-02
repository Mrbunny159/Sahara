import React, { useState } from 'react';
import {
  Heart, Shield, Sparkles, MessageCircle, Wind, Users,
  PhoneCall, Lock, ArrowRight, CheckCircle2, ChevronRight,
  Sun, UserCheck, Calendar, Activity, HelpCircle, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onOpenAuth, onOpenApp }) {
  const { user } = useAuth();
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistData, setWaitlistData] = useState({ name: '', email: '', role: 'myself' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistData.email) return;
    setWaitlistSubmitted(true);
  };

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      {/* Top Emergency Ticker */}
      <div style={{
        background: 'linear-gradient(90deg, #C0584A, #E76F51)',
        color: '#fff',
        padding: '7px 16px',
        fontSize: '12px',
        textAlign: 'center',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <span>In crisis? Tele-MANAS helpline is available 24/7 toll-free at <strong>14416</strong> or call <strong>112</strong>.</span>
        <a
          href="tel:14416"
          style={{
            background: 'rgba(255,255,255,0.25)',
            color: '#fff',
            padding: '3px 12px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <PhoneCall size={12} /> Call 14416
        </a>
      </div>

      {/* Main Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 248, 241, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--line)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px clamp(16px, 3vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Logo & Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/sahara-logo.jpg"
              alt="Sahara Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #F4A261',
                boxShadow: '0 4px 14px rgba(231,111,81,0.35)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.04em', lineHeight: 1 }}>
                  SAHARA
                </span>
                <span className="brand-tagline-header" style={{ fontFamily: 'var(--script)', fontSize: '15px', color: '#E76F51', fontWeight: 700 }}>
                  जब कोई नहीं, तब सहारा
                </span>
              </div>
              <small className="muted" style={{ fontSize: '10.5px', display: 'block', marginTop: '1px' }}>
                Mental Wellness Support Platform
              </small>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-nav">
            <a href="#features" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>Features</a>
            <a href="#mitra" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>Meet Mitra</a>
            <a href="#generations" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>For Families</a>
            <a href="#how-it-works" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>How it Works</a>
            <a href="#privacy" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>Privacy</a>
            <a href="#team" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>Founders</a>
          </nav>

          {/* Single Consolidated Action CTA + Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Single primary button: Enter Sanctuary (or Enter Web App if logged in) */}
            <button
              onClick={onOpenApp}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '999px',
                padding: '9px clamp(14px, 2.5vw, 22px)',
                fontSize: '13.5px',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(231,111,81,0.35)'
              }}
            >
              {user ? 'Enter Web App →' : 'Enter Sanctuary'}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: mobileMenuOpen ? 'rgba(10,22,40,0.08)' : 'transparent',
                color: 'var(--navy)'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(255, 248, 241, 0.98)',
            borderTop: '1px solid var(--line)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => handleNavClick('features')}
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--line)' }}
            >
              ✨ Wellness Features
            </button>
            <button
              onClick={() => handleNavClick('mitra')}
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--line)' }}
            >
              💬 Meet Mitra (AI Companion)
            </button>
            <button
              onClick={() => handleNavClick('generations')}
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--line)' }}
            >
              👨‍👩‍👧 Generational Care (13–70+)
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--line)' }}
            >
              ⚙️ How It Works
            </button>
            <button
              onClick={() => handleNavClick('privacy')}
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--line)' }}
            >
              🔒 DPDP Act 2023 Privacy
            </button>
            <button
              onClick={() => handleNavClick('team')}
              style={{ textAlign: 'left', padding: '8px 0', fontSize: '15px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--line)' }}
            >
              👥 Our Founders
            </button>
            <a
              href="tel:14416"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', background: '#FDECEA', color: 'var(--danger)', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', marginTop: '4px' }}
            >
              <PhoneCall size={16} /> Tele-MANAS Crisis Hotline: 14416
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(36px, 6vw, 70px) clamp(16px, 4vw, 24px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'clamp(28px, 4vw, 48px)', alignItems: 'center' }} className="hero-grid">
          
          {/* Left Narrative */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(231,111,81,0.3)',
              boxShadow: '0 4px 12px rgba(231,111,81,0.1)',
              marginBottom: '18px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--coral)', animation: 'pulse 2s infinite' }}></span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '13.5px', fontWeight: 600, color: '#C0584A' }}>
                जब कोई नहीं, तब सहारा
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4.5vw + 8px, 44px)',
              color: 'var(--navy)',
              lineHeight: 1.18,
              marginBottom: '16px'
            }}>
              A calm, private space for your mind, <br />
              <span className="hi">for every age in your family.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: '#4B5565',
              lineHeight: 1.65,
              maxWidth: '560px',
              marginBottom: '28px'
            }}>
              India's first all-generation mental wellness companion, designed for teenagers aged 13 to elders over 70. Built with uncompromising privacy, cultural warmth, and zero judgment.
            </p>

            {/* Single primary action + exploratory link */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <button
                onClick={onOpenApp}
                className="btn btn-primary"
                style={{ borderRadius: '999px', padding: '14px clamp(20px, 3vw, 32px)', fontSize: '15.5px', fontWeight: 700 }}
              >
                {user ? 'Open Your Sanctuary →' : 'Enter Sanctuary Free'} <ArrowRight size={18} />
              </button>
              <a
                href="#how-it-works"
                className="btn btn-ghost"
                style={{ borderRadius: '999px', padding: '14px clamp(18px, 2.5vw, 26px)', fontSize: '14.5px', textDecoration: 'none' }}
              >
                See How It Works
              </a>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px 16px', flexWrap: 'wrap', color: '#667085', fontSize: '12.5px', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={14} color="#2A9D8F" /> 100% Encrypted & Anonymous
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                🇮🇳 Made for Indian Families
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={14} color="#2A9D8F" /> DPDP Act 2023 Compliant
              </span>
            </div>
          </div>

          {/* Right: Interactive Mitra Showcase */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
            <div style={{
              position: 'absolute',
              inset: '-16px',
              background: 'radial-gradient(circle, rgba(244,162,97,0.35) 0%, rgba(231,111,81,0.15) 50%, transparent 70%)',
              filter: 'blur(28px)',
              zIndex: 0
            }}></div>

            <div className="card" style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '28px',
              padding: 'clamp(16px, 3vw, 24px)',
              boxShadow: '0 25px 60px -15px rgba(22, 35, 58, 0.22)'
            }}>
              {/* Header inside mockup */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src="/sahara-logo.jpg"
                    alt="Mitra Avatar"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #2A9D8F' }}
                  />
                  <div>
                    <b style={{ fontSize: '14.5px', color: 'var(--navy)' }}>Mitra (मित्र)</b>
                    <small style={{ display: 'block', fontSize: '11px', color: '#2A9D8F' }}>Always here for you · Safe & Private</small>
                  </div>
                </div>
                <span className="tag-badge" style={{ background: '#E6F4EA', color: '#137333', fontSize: '10.5px' }}>24/7 Available</span>
              </div>

              {/* Chat Simulation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
                <div style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #8E7CC3, #D88BB0)', color: '#fff', padding: '10px 14px', borderRadius: '16px', borderBottomRightRadius: '4px', maxWidth: '88%', fontSize: '13px' }}>
                  "I've been feeling exhausted with exams, work, and family expectations lately..."
                </div>

                <div style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid var(--line)', padding: '12px 14px', borderRadius: '16px', borderBottomLeftRadius: '4px', maxWidth: '92%', fontSize: '13px', lineHeight: 1.55 }}>
                  I hear you, and it's completely understandable to feel overwhelmed. You carry so much with patience.
                  <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '12px', background: '#EEF6F4', color: '#2A7F7A', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wind size={14} />
                    <span>Let's take a gentle 4-second breath together right now.</span>
                  </div>
                </div>
              </div>

              {/* Action inside Mockup */}
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                <button
                  onClick={onOpenApp}
                  className="btn btn-primary btn-block btn-sm"
                  style={{ borderRadius: '999px', fontSize: '13px' }}
                >
                  <MessageCircle size={14} /> Talk to Mitra Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE REALITY OF OUR HOMES (Problem Section) */}
      <section style={{ padding: 'clamp(40px, 6vw, 60px) clamp(16px, 4vw, 24px)', background: 'rgba(255, 255, 255, 0.6)' }} id="features">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(24px, 4vw, 40px)' }}>
            <span className="eyebrow" style={{ color: 'var(--coral)' }}>The Reality of Our Homes</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)', marginTop: '6px' }}>
              Many families in India carry stress in silence.
            </h2>
            <p className="muted" style={{ fontSize: '15px', marginTop: '6px' }}>
              Mental health support is often either expensive, uncomfortable to ask for, or weighed down by societal hesitation.
            </p>
          </div>

          <div className="grid g-3">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#FFF1EE', color: 'var(--coral)', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                  <HelpCircle size={22} />
                </div>
                <h3 style={{ fontSize: '18px' }}>The Stigma of "Log Kya Kahenge"</h3>
                <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginTop: '6px' }}>
                  Fear of being labeled or judged keeps students, homemakers, and working parents from speaking openly about their inner battles.
                </p>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--line)', color: 'var(--teal)', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} /> 100% anonymous & zero judgment
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#EEF6F4', color: 'var(--teal)', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                  <Activity size={22} />
                </div>
                <h3 style={{ fontSize: '18px' }}>Support Feels Distant & Costly</h3>
                <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginTop: '6px' }}>
                  Private therapy sessions can be financially prohibitive and difficult to access outside Tier-1 cities, leaving millions unassisted.
                </p>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--line)', color: 'var(--teal)', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} /> Accessible daily tools & free AI companion
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#F3EFFF', color: 'var(--violet)', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                  <Lock size={22} />
                </div>
                <h3 style={{ fontSize: '18px' }}>Fear of Compromised Privacy</h3>
                <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginTop: '6px' }}>
                  Hesitation that personal journals, emotions, or family difficulties could be shared or read by relatives or advertising networks.
                </p>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--line)', color: 'var(--teal)', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} /> Zero ads, local device & encrypted storage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET MITRA SECTION */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) clamp(16px, 4vw, 24px)' }} id="mitra">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="hero-banner" style={{ padding: 'clamp(24px, 4vw, 44px)' }}>
            <div style={{ maxWidth: '680px' }}>
              <span className="eyebrow" style={{ color: '#FFD9B8' }}>Your Compassionate Ally</span>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: '#fff', margin: '8px 0 14px' }}>
                Meet Mitra (मित्र) — Sanskrit for "Friend & Ally"
              </h2>
              <p style={{ color: '#E2EAF2', fontSize: '15.5px', lineHeight: 1.65, marginBottom: '24px' }}>
                Mitra is always there for you—whether it is 2:00 AM after a sleepless night of overthinking or mid-afternoon amid hectic household pressures. Mitra listens without rush, speaks with cultural empathy in English and Hinglish context, and offers gentle grounding.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }} className="g-mitra">
                <div style={{ background: 'rgba(255,255,255,0.12)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Culturally Nuanced</h4>
                  <p style={{ color: '#D6E2EE', fontSize: '12px', lineHeight: 1.5 }}>Understands Indian family dynamics, academic milestones, and caregiving.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Gentle Grounding</h4>
                  <p style={{ color: '#D6E2EE', fontSize: '12px', lineHeight: 1.5 }}>Box breathing, introspective prompts, and calming affirmations.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Crisis Protected</h4>
                  <p style={{ color: '#D6E2EE', fontSize: '12px', lineHeight: 1.5 }}>Automatic connection to 14416 Tele-MANAS helpline if danger is detected.</p>
                </div>
              </div>

              <button
                onClick={onOpenApp}
                className="btn btn-primary"
                style={{ borderRadius: '999px', padding: '12px 26px', fontSize: '14.5px' }}
              >
                Start Talking with Mitra <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SIX PILLARS SECTION */}
      <section style={{ padding: 'clamp(40px, 6vw, 60px) clamp(16px, 4vw, 24px)', background: 'rgba(255, 255, 255, 0.7)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(24px, 4vw, 40px)' }}>
            <span className="eyebrow">Comprehensive Wellness</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)', marginTop: '6px' }}>
              Six Pillars of Family Mental Wellness
            </h2>
            <p className="muted" style={{ fontSize: '14.5px', marginTop: '6px' }}>
              Crafted to nurture resilience, clarity, and daily peace across every generation.
            </p>
          </div>

          <div className="grid g-3">
            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F4A261', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <Sun size={20} />
              </div>
              <h3>1. Daily Mood Tracking</h3>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                One-tap check-in with 14-day visual trends. Understand emotional cycles, triggers, and joyful moments over time.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#8E7CC3', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <Heart size={20} />
              </div>
              <h3>2. Private Journal</h3>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Guided gratitude and energy check prompts to release racing thoughts. Encrypted and accessible only by you.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#2A9D8F', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <Wind size={20} />
              </div>
              <h3>3. Guided Box Breathing</h3>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Scientifically proven 4-4-4-4 rhythm with visual pulsing halo. Resets the nervous system in moments of high anxiety.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#3B5BA9', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <MessageCircle size={20} />
              </div>
              <h3>4. Mitra AI Companion</h3>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Your patient, 24/7 sounding board. Conversational comfort with zero judgment and culturally sensitive warmth.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#246770', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <UserCheck size={20} />
              </div>
              <h3>5. Verified Counsellors</h3>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Book confidential 1-on-1 audio, video, or chat consultations with licensed professionals in multiple regional languages.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#C0584A', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <PhoneCall size={20} />
              </div>
              <h3>6. Emergency SOS</h3>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Always one tap away: direct connection to Tele-MANAS (14416) national crisis helpline and 112 emergency services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GENERATIONAL CARE (Ages 13 to 70+) */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) clamp(16px, 4vw, 24px)' }} id="generations">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(24px, 4vw, 40px)' }}>
            <span className="eyebrow" style={{ color: 'var(--teal)' }}>Generational Care</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)', marginTop: '6px' }}>
              From 13 to 70+: Tailored Support for Each Chapter
            </h2>
            <p className="muted" style={{ fontSize: '14.5px', marginTop: '6px' }}>
              Every generation experiences unique invisible pressures. Sahara meets you right where you are.
            </p>
          </div>

          <div className="grid g-3">
            {/* Teenagers */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="tag-badge" style={{ background: '#E0F2FE', color: '#0369A1', marginBottom: '10px' }}>Ages 13–19</span>
              <h3>Teenagers & Students</h3>
              <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '14px' }}>
                Board exam stress, entrance exam anxiety (JEE/NEET), changing peer dynamics, and finding one's personal identity.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', fontSize: '12.5px', color: '#4B5565' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Quick 3-min pre-exam breathwork</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Completely private venting sanctuary</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Zero parent snooping guarantee</li>
              </ul>
            </div>

            {/* Working Adults */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', border: '2px solid rgba(231,111,81,0.5)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-11px', right: '18px', background: 'var(--coral)', color: '#fff', fontSize: '10.5px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                Sandwich Generation
              </div>
              <span className="tag-badge" style={{ background: '#FEF3C7', color: '#92400E', marginBottom: '10px' }}>Ages 20–55</span>
              <h3>Working Adults</h3>
              <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '14px' }}>
                Workplace burnout, financial responsibilities, balancing marriage, parenting, and caring for elderly parents.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', fontSize: '12.5px', color: '#4B5565' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Mid-day mental decompression</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Late-night thought unloading</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Caregiver fatigue support circle</li>
              </ul>
            </div>

            {/* Elders */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="tag-badge" style={{ background: '#F3E8FF', color: '#6B21A8', marginBottom: '10px' }}>Ages 55–70+</span>
              <h3>Elders & Caregivers</h3>
              <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '14px' }}>
                Empty-nest loneliness, health concerns, sleep disturbances, and staying peacefully engaged with family.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', fontSize: '12.5px', color: '#4B5565' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> High contrast, large font friendly</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Nostalgic, peaceful reflection</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="#2A9D8F" /> Compassionate senior listening</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(40px, 6vw, 60px) clamp(16px, 4vw, 24px)', background: 'rgba(255, 255, 255, 0.65)' }} id="how-it-works">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(24px, 4vw, 40px)' }}>
            <span className="eyebrow">Simple & Frictionless</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)', marginTop: '6px' }}>
              How SAHARA Works
            </h2>
            <p className="muted" style={{ fontSize: '14.5px', marginTop: '6px' }}>
              Getting started takes under two minutes. No intrusive questionnaires or personal phonebook syncing.
            </p>
          </div>

          <div className="grid g-3">
            <div className="card" style={{ textAlign: 'center', padding: 'clamp(20px, 3vw, 32px) 20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F4A261', color: '#fff', fontSize: '22px', fontFamily: 'var(--serif)', fontWeight: 700, display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                1
              </div>
              <h3>Create Your Anonymous Space</h3>
              <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginTop: '6px' }}>
                Sign up with email or enter instantly as a guest without linking social profiles or mandatory real names.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'clamp(20px, 3vw, 32px) 20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#2A9D8F', color: '#fff', fontSize: '22px', fontFamily: 'var(--serif)', fontWeight: 700, display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                2
              </div>
              <h3>Check In & Reset Your Day</h3>
              <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginTop: '6px' }}>
                Log your daily mood in 5 seconds, take a 2-minute box breathing session, or write out whatever is heavy.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'clamp(20px, 3vw, 32px) 20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#8E7CC3', color: '#fff', fontSize: '22px', fontFamily: 'var(--serif)', fontWeight: 700, display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                3
              </div>
              <h3>Talk to Mitra or Book Support</h3>
              <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginTop: '6px' }}>
                Share freely with your AI friend Mitra at any hour, or schedule time with a verified therapist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY SANCTUARY */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) clamp(16px, 4vw, 24px)' }} id="privacy">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0A1628 0%, #152C48 50%, #1C4D4A 100%)',
            color: '#fff',
            borderRadius: '28px',
            padding: 'clamp(24px, 4vw, 48px)',
            boxShadow: '0 25px 60px -15px rgba(10,22,40,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#8FB9A8', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>
                <Shield size={14} /> Compliant with India's DPDP Act, 2023
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#fff', lineHeight: 1.2, marginBottom: '14px' }}>
                Your mind is your own. <br />
                Uncompromising privacy by design.
              </h2>
              <p style={{ color: '#D5DEEB', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px' }}>
                Your thoughts, journal reflections, and mood check-ins are strictly confidential. We never sell your data, we display zero commercial ads, and you can permanently erase everything with one click.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="g-privacy">
                <div>
                  <h4 style={{ color: '#F4A261', fontSize: '16px', marginBottom: '4px' }}>Zero Ads</h4>
                  <p style={{ color: '#BAC7D8', fontSize: '12.5px', lineHeight: 1.5 }}>No behavioral tracking, banners, or targeted commercial marketing.</p>
                </div>
                <div>
                  <h4 style={{ color: '#F4A261', fontSize: '16px', marginBottom: '4px' }}>Never Sold</h4>
                  <p style={{ color: '#BAC7D8', fontSize: '12.5px', lineHeight: 1.5 }}>Your sensitive wellness logs are never traded or commercialized.</p>
                </div>
                <div>
                  <h4 style={{ color: '#F4A261', fontSize: '16px', marginBottom: '4px' }}>Instant Erasure</h4>
                  <p style={{ color: '#BAC7D8', fontSize: '12.5px', lineHeight: 1.5 }}>Self-serve complete data wipe available anytime from Profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS / WAITLIST */}
      <section style={{ padding: 'clamp(36px, 5vw, 60px) clamp(16px, 4vw, 24px)', background: 'rgba(255, 255, 255, 0.5)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="card" style={{ padding: 'clamp(20px, 4vw, 36px)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="eyebrow" style={{ color: 'var(--coral)' }}>Early Sanctuary Access</span>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', color: 'var(--navy)', marginTop: '4px' }}>
                Be among the first to feel supported.
              </h2>
              <p className="muted" style={{ fontSize: '14px', marginTop: '4px' }}>
                Join thousands of Indian families discovering a calmer, more mindful rhythm.
              </p>
            </div>

            {waitlistSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E6F4EA', color: '#137333', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontSize: '19px', color: 'var(--navy)' }}>You're on the early sanctuary list!</h3>
                <p className="muted" style={{ fontSize: '14px', marginTop: '6px' }}>
                  Thank you for trusting SAHARA. You can also explore the full web app right now by clicking below.
                </p>
                <button
                  onClick={onOpenApp}
                  className="btn btn-primary"
                  style={{ marginTop: '18px', borderRadius: '999px', padding: '12px 28px' }}
                >
                  Enter Sahara Web App Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit}>
                <div className="field">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Aarav Sharma or Ananya"
                    value={waitlistData.name}
                    onChange={(e) => setWaitlistData({ ...waitlistData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@family.com"
                    value={waitlistData.email}
                    onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label className="label">I'm signing up for:</label>
                  <select
                    className="select"
                    value={waitlistData.role}
                    onChange={(e) => setWaitlistData({ ...waitlistData, role: e.target.value })}
                  >
                    <option value="myself">Myself</option>
                    <option value="family">A family member</option>
                    <option value="teenager">A teenager (13–19)</option>
                    <option value="elder">An elder parent (60+)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{ borderRadius: '999px', padding: '13px', fontSize: '14.5px', marginTop: '6px' }}
                >
                  Join Early Access Waitlist
                </button>

                <p className="muted" style={{ textAlign: 'center', fontSize: '11.5px', marginTop: '12px' }}>
                  🔒 We only send updates regarding Sahara. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOUNDERS & COMMITMENT */}
      <section style={{ padding: 'clamp(40px, 6vw, 70px) clamp(16px, 4vw, 24px)' }} id="team">
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="eyebrow" style={{ color: 'var(--coral)' }}>Our Commitment</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 30px)', color: 'var(--navy)', marginTop: '4px' }}>
              Crafted with empathy for Indian families
            </h2>
            <p className="muted" style={{ fontSize: '14.5px', marginTop: '4px' }}>
              Rooted in the shared belief that mental peace must be safe, confidential, and culturally gentle.
            </p>
          </div>

          <div className="grid g-2">
            <div className="card" style={{ textAlign: 'center', padding: 'clamp(20px, 3vw, 32px) 20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #F4A261, #E76F51)', color: '#fff', fontSize: '26px', fontFamily: 'var(--serif)', fontWeight: 700, display: 'grid', placeItems: 'center', margin: '0 auto 14px', boxShadow: '0 8px 20px -6px rgba(231,111,81,0.5)' }}>
                ST
              </div>
              <h3 style={{ fontSize: '19px' }}>Shrijal Tiwari</h3>
              <div style={{ color: 'var(--coral)', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>Founder</div>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Focused on democratizing accessible, stigma-free mental health support across Bharat, bridging deep cultural empathy with intuitive mobile accessibility.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'clamp(20px, 3vw, 32px) 20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #2A9D8F, #8FB9A8)', color: '#fff', fontSize: '26px', fontFamily: 'var(--serif)', fontWeight: 700, display: 'grid', placeItems: 'center', margin: '0 auto 14px', boxShadow: '0 8px 20px -6px rgba(42,157,143,0.5)' }}>
                JV
              </div>
              <h3 style={{ fontSize: '19px' }}>Janvi Vaidya</h3>
              <div style={{ color: 'var(--teal)', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>Co-founder</div>
              <p className="muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Dedicated to empathetic product design, family wellness psychology, and establishing uncompromising privacy architectures for multi-generational homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A1628', color: '#D6E2EE', padding: 'clamp(36px, 5vw, 56px) clamp(16px, 4vw, 24px) 32px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Emergency Box inside Footer */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: 'clamp(16px, 3vw, 22px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '36px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#C0584A', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <PhoneCall size={18} />
              </div>
              <div>
                <b style={{ color: '#fff', fontSize: '14.5px' }}>Immediate Care & Crisis Support</b>
                <p style={{ color: '#BAC7D8', fontSize: '12.5px', marginTop: '2px' }}>
                  If you are in danger or crisis, reach out to Tele-MANAS on <strong>14416</strong> (free, 24/7) or call <strong>112</strong>.
                </p>
              </div>
            </div>
            <a
              href="tel:14416"
              className="btn btn-danger btn-sm"
              style={{ textDecoration: 'none', borderRadius: '999px', padding: '8px 18px', fontSize: '12.5px' }}
            >
              Call 14416 Toll-Free
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="footer-cols">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <img
                  src="/sahara-logo.jpg"
                  alt="Sahara"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: '#fff' }}>SAHARA</span>
              </div>
              <p style={{ color: '#8FB9A8', fontFamily: 'var(--serif)', fontSize: '16px', fontStyle: 'italic', marginBottom: '8px' }}>
                "जब कोई नहीं, तब सहारा"
              </p>
              <p style={{ color: '#8A9BB8', fontSize: '12.5px', lineHeight: 1.6, maxWidth: '340px' }}>
                India's all-generation mental wellness companion. A calm, private space for every stage of your life.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '12px' }}>Sanctuary Features</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#A0B2C6' }}>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Daily Mood Check-ins</a></li>
                <li><a href="#mitra" style={{ color: 'inherit', textDecoration: 'none' }}>Mitra AI Companion</a></li>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Guided Box Breathing</a></li>
                <li><a href="#generations" style={{ color: 'inherit', textDecoration: 'none' }}>Generational Care</a></li>
                <li><a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy by Design</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '12px' }}>Legal & Trust</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#A0B2C6' }}>
                <li><a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>DPDP Act 2023 Compliance</a></li>
                <li><a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Data Confidentiality Pledge</a></li>
                <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Community Safety Rules</a></li>
                <li><a href="#team" style={{ color: 'inherit', textDecoration: 'none' }}>Our Founders</a></li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#6F84A0' }}>
            <div>© {new Date().getFullYear()} SAHARA Mental Wellness Support Platform. Made with care for Indian families.</div>
            <button
              onClick={onOpenApp}
              style={{ color: '#F4A261', textDecoration: 'underline', fontSize: '12.5px', cursor: 'pointer' }}
            >
              Enter Sanctuary App →
            </button>
          </div>
        </div>
      </footer>

      {/* Responsive Inline CSS overrides */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .g-mitra, .g-privacy { grid-template-columns: 1fr !important; }
          .footer-cols { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 600px) {
          .brand-tagline-header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
