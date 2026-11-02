import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Trash2, LogOut, ShieldCheck, Check, AlertTriangle, X } from 'lucide-react';

export default function ProfilePrivacy({
  onEraseAllData,
  onShowToast,
  onLogout
}) {
  const { user, updateDisplayName } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [showEraseModal, setShowEraseModal] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    await updateDisplayName(name.trim());
    onShowToast('Profile name updated 🌿');
  };

  const handleConfirmErase = () => {
    setShowEraseModal(false);
    onEraseAllData();
  };

  return (
    <div>
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--navy)' }}>Profile & Privacy</h1>
        <div className="muted" style={{ fontSize: '15px', marginTop: '4px' }}>
          Manage your identity and retain total ownership over your sanctuary data.
        </div>
      </div>

      <div className="grid g-2" style={{ alignItems: 'start' }}>
        {/* Personal Details */}
        <div className="card">
          <h3>Your Profile</h3>

          <div className="field">
            <label className="label">Display Name</label>
            <input
              type="text"
              className="input"
              placeholder="What should Mitra call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <small className="muted" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Used for your greeting and friendly conversations with Mitra.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-navy"
              onClick={handleSaveName}
            >
              <Check size={16} /> Save Changes
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onLogout}
              style={{ color: 'var(--coral)' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(230,241,236,0.9), rgba(236,232,250,0.9))', border: '1px solid #D9E6EE', boxShadow: 'none' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Lock size={22} color="#2A9D8F" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <b style={{ color: '#24443A', display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                  Privacy by Design · DPDP Act, 2023 Compliant
                </b>
                <p style={{ fontSize: '13px', color: '#3F5E53', lineHeight: 1.55 }}>
                  Your check-ins, journal reflections, and personal conversations stay confidential and encrypted. No advertisements, no data broker selling, and zero third-party commercial trackers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Ownership & Erase */}
        <div className="stack">
          <div className="card">
            <h3>Account Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', marginBottom: '18px' }}>
              <div>
                <span className="muted">Account Type: </span>
                <strong>{user?.isGuest ? 'Anonymous Guest' : 'Registered Member'}</strong>
              </div>
              {user?.email && (
                <div>
                  <span className="muted">Email: </span>
                  <strong>{user.email}</strong>
                </div>
              )}
              <div>
                <span className="muted">Status: </span>
                <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Active Sanctuary Member</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid #F5C6BE' }}>
            <h3 style={{ color: 'var(--danger)' }}>Erase All Your Data</h3>
            <p className="muted" style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '18px' }}>
              Under DPDP 2023 principles, you can wipe your entire digital footprint on SAHARA instantly. This clears all moods, journals, and chat logs forever.
            </p>
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={() => setShowEraseModal(true)}
            >
              <Trash2 size={16} /> Erase all my data
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showEraseModal && (
        <div className="modal-backdrop" onClick={() => setShowEraseModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)', marginBottom: '14px' }}>
              <AlertTriangle size={28} />
              <h2 style={{ fontSize: '20px', color: 'var(--navy)' }}>Erase all your data?</h2>
            </div>
            <p className="muted" style={{ fontSize: '14.5px', lineHeight: 1.6, marginBottom: '22px' }}>
              This permanently deletes all your check-ins, journal entries, and conversations with Mitra. This action is immediate and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowEraseModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmErase}
              >
                Yes, erase everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

