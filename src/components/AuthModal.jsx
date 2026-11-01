import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, loginAsGuest, isGuestModeEnabled } = useAuth();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup' | 'guest'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (tab === 'guest') {
      const res = loginAsGuest(name || 'Dear Friend');
      setLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Guest login is not available.');
      }
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (tab === 'signup') {
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        setLoading(false);
        return;
      }
      const res = await signupWithEmail(email, password, name || 'Friend');
      if (res.success) {
        setLoading(false);
        onSuccess();
      } else {
        setError(res.error?.includes('email-already-in-use') ? 'This email is already registered. Please sign in instead.' : (res.error || 'Registration failed.'));
        setLoading(false);
      }
    } else {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        setLoading(false);
        onSuccess();
      } else {
        setError(res.error?.includes('invalid-credential') ? 'Invalid email or password.' : (res.error || 'Sign in failed.'));
        setLoading(false);
      }
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const res = await loginWithGoogle();
    if (res.success) {
      setLoading(false);
      onSuccess();
    } else {
      setError(res.error || 'Google sign-in was interrupted.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', color: '#667085' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <img
            src="/sahara-logo.jpg"
            alt="Sahara Logo"
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', boxShadow: '0 6px 18px rgba(231,111,81,0.35)' }}
          />
          <h2 style={{ fontSize: '24px', color: 'var(--navy)' }}>Welcome to SAHARA</h2>
          <p className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>जब कोई नहीं, तब सहारा</p>
        </div>

        {/* Modular Tab Switcher */}
        <div style={{ display: 'flex', background: '#F2EFF6', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => { setTab('signin'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '9px',
              fontSize: '13.5px',
              fontWeight: 600,
              background: tab === 'signin' ? '#fff' : 'transparent',
              color: tab === 'signin' ? 'var(--navy)' : 'var(--muted)',
              boxShadow: tab === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '9px',
              fontSize: '13.5px',
              fontWeight: 600,
              background: tab === 'signup' ? '#fff' : 'transparent',
              color: tab === 'signup' ? 'var(--navy)' : 'var(--muted)',
              boxShadow: tab === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            New Account
          </button>
          {isGuestModeEnabled && (
            <button
              type="button"
              onClick={() => { setTab('guest'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '9px',
                fontSize: '13.5px',
                fontWeight: 600,
                background: tab === 'guest' ? '#fff' : 'transparent',
                color: tab === 'guest' ? 'var(--navy)' : 'var(--muted)',
                boxShadow: tab === 'guest' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Guest Access
            </button>
          )}
        </div>

        {error && (
          <div style={{
            background: '#FDECEA',
            color: '#A0463D',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid #F5C6BE'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tab !== 'signin' && (
            <div className="field">
              <label className="label">
                {tab === 'guest' ? 'What should we call you?' : 'Your Name'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Aarav or Priya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#8A9BB8' }} />
              </div>
            </div>
          )}

          {tab !== 'guest' && (
            <>
              <div className="field">
                <label className="label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#8A9BB8' }} />
                </div>
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="input"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#8A9BB8' }} />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '6px' }}
          >
            {loading ? 'Please wait...' : (
              tab === 'signin' ? 'Sign In to Sahara' :
              tab === 'signup' ? 'Create Free Sanctuary' : 'Enter as Anonymous Guest'
            )}
          </button>
        </form>

        {tab !== 'guest' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0', color: '#A0AEC0', fontSize: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
              <span>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="btn btn-ghost btn-block"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '18px', color: '#7E8B9F', fontSize: '12px' }}>
          <ShieldCheck size={14} color="#2A9D8F" />
          <span>100% Confidential · Compliant with DPDP Act 2023</span>
        </div>
      </div>
    </div>
  );
}
