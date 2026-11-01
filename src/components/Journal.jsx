import React, { useState } from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';

const PROMPTS = [
  { label: 'Gratitude', text: 'Today I am grateful for…' },
  { label: 'Energy check', text: 'What drained my energy today was…' },
  { label: 'What I need', text: 'What I really need right now is…' },
  { label: 'Unspoken words', text: 'Something I haven\'t said out loud yet is…' }
];

export default function Journal({ entries, onSaveEntry, onDeleteEntry, onShowToast }) {
  const [content, setContent] = useState('');

  const handlePromptClick = (text) => {
    setContent(prev => (prev ? prev + '\n\n' : '') + text + ' ');
  };

  const handleSave = () => {
    if (!content.trim()) {
      onShowToast('Please write a few words first 📝');
      return;
    }
    onSaveEntry({
      text: content.trim(),
      date: new Date().toISOString().slice(0, 10),
      at: Date.now()
    });
    setContent('');
    onShowToast('Journal entry saved privately 🌿');
  };

  return (
    <div>
      <div style={{ marginBottom: '26px' }}>
        <h1 style={{ fontSize: '32px', color: 'var(--navy)' }}>Private Journal</h1>
        <div className="muted" style={{ fontSize: '15px', marginTop: '4px' }}>
          Writing untangles racing thoughts. Encrypted and accessible only by you.
        </div>
      </div>

      <div className="grid g-2" style={{ alignItems: 'start' }}>
        {/* Editor */}
        <div className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-chip"
                onClick={() => handlePromptClick(p.text)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="field">
            <textarea
              className="textarea"
              placeholder="Start with whatever is on your mind right now…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: '260px' }}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleSave}
          >
            <Plus size={18} /> Save journal entry
          </button>
        </div>

        {/* Entries List */}
        <div>
          {entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
              <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '15px' }}>Your entries will appear here.</p>
              <small style={{ fontSize: '12px', display: 'block', marginTop: '6px' }}>
                Use prompts on the left or write freely whenever you need clarity.
              </small>
            </div>
          ) : (
            <div>
              {entries.slice().reverse().map((entry) => (
                <div key={entry.at} className="entry-card">
                  <div className="meta">
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>
                      {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                    <button
                      onClick={() => onDeleteEntry(entry.at)}
                      style={{
                        color: '#9CA3AF',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        transition: '0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = '#FDECEA'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                      title="Delete entry"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                  <p>{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

