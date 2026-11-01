import React, { useState } from 'react';
import { Check, Sparkles, Smile, Calendar, Trash2 } from 'lucide-react';

const MOODS = [
  { e: '😔', l: 'Low', v: 1 },
  { e: '😕', l: 'Uneasy', v: 2 },
  { e: '😐', l: 'Okay', v: 3 },
  { e: '🙂', l: 'Good', v: 4 },
  { e: '😊', l: 'Great', v: 5 }
];

export default function MoodTracker({ moods, onSaveMood, onDeleteMood, onShowToast }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (selectedMood === null) {
      onShowToast('Please select how you feel first 🌿');
      return;
    }
    const m = MOODS[selectedMood];
    onSaveMood({
      date: new Date().toISOString().slice(0, 10),
      v: m.v,
      label: m.l,
      note: note.trim(),
      at: Date.now()
    });
    setSelectedMood(null);
    setNote('');
    onShowToast('Check-in saved. Thank you for noticing yourself 💛');
  };

  // Calculate insight
  const recent = moods.slice(-7);
  const avg = recent.length ? recent.reduce((a, b) => a + b.v, 0) / recent.length : null;
  let insightMsg = 'Check in for a few days and your personal emotional patterns will gently appear here.';
  if (avg !== null) {
    if (avg >= 4) {
      insightMsg = 'Your recent check-ins have been lifting. Notice what has helped you feel steady, and do more of it.';
    } else if (avg >= 3) {
      insightMsg = 'You have been balanced lately. Quiet rest, time outdoors, and small intentional routines add up.';
    } else {
      insightMsg = 'Things have felt heavy recently. Please be gentle with yourself. Talking to Mitra or trying guided breathing can give your mind some room.';
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontSize: '32px', color: 'var(--navy)' }}>Mood Check-in</h1>
        <div className="muted" style={{ fontSize: '15px', marginTop: '4px' }}>
          Naming how you feel is the first step toward lightness. There is no wrong answer.
        </div>
      </div>

      <div className="grid g-main">
        {/* Input Form */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>How are you feeling right now?</h3>

          <div className="mgrid">
            {MOODS.map((m, idx) => (
              <button
                key={idx}
                type="button"
                className={`mcard ${selectedMood === idx ? 'sel' : ''}`}
                onClick={() => setSelectedMood(idx)}
              >
                <span className="e">{m.e}</span>
                <span>{m.l}</span>
              </button>
            ))}
          </div>

          <div className="field">
            <label className="label">
              What's contributing to it? <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              className="textarea"
              placeholder="A tough meeting, a late night, exam expectations, a good cup of tea..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ minHeight: '110px' }}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleSave}
          >
            <Check size={18} /> Save check-in
          </button>
        </div>

        {/* Insight & History */}
        <div className="stack">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(244,162,97,0.18), rgba(231,111,81,0.12))' }}>
            <div className="eyebrow" style={{ color: 'var(--coral)' }}>Personal Reflection Insight</div>
            <p style={{ fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.6 }}>
              {insightMsg}
            </p>
          </div>

          <div className="card">
            <h3>Recent check-ins</h3>
            {moods.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--muted)', fontSize: '13.5px' }}>
                No check-ins yet. Log your first above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {moods.slice().reverse().slice(0, 6).map((item, idx) => {
                  const mObj = MOODS[item.v - 1] || MOODS[2];
                  return (
                    <div
                      key={idx}
                      className="spread"
                      style={{ padding: '12px 0', borderBottom: idx < 5 ? '1px solid var(--line)' : 'none' }}
                    >
                      <div className="row">
                        <span style={{ fontSize: '24px' }}>{mObj.e}</span>
                        <div>
                          <b style={{ fontSize: '14px', color: 'var(--navy)' }}>{item.label}</b>
                          <div className="muted" style={{ fontSize: '12px' }}>
                            {new Date(item.date + 'T00:00:00').toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="muted" style={{ fontSize: '12.5px', maxWidth: '45%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.note || 'No note'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

