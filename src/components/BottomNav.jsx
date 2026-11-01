import React from 'react';
import { Home, Smile, BookOpen, MessageCircle, Wind, User } from 'lucide-react';

export default function BottomNav({ currentTab, setTab }) {
  return (
    <nav className="bottom-bar">
      <button
        className={currentTab === 'home' ? 'active' : ''}
        onClick={() => setTab('home')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        className={currentTab === 'mood' ? 'active' : ''}
        onClick={() => setTab('mood')}
      >
        <Smile size={20} />
        <span>Feel</span>
      </button>

      <button
        className={currentTab === 'journal' ? 'active' : ''}
        onClick={() => setTab('journal')}
      >
        <BookOpen size={20} />
        <span>Express</span>
      </button>

      <button
        className={currentTab === 'mitra' ? 'active' : ''}
        onClick={() => setTab('mitra')}
      >
        <MessageCircle size={20} />
        <span>Mitra</span>
      </button>

      <button
        className={currentTab === 'breathe' || currentTab === 'counsellors' ? 'active' : ''}
        onClick={() => setTab('breathe')}
      >
        <Wind size={20} />
        <span>Restore</span>
      </button>

      <button
        className={currentTab === 'profile' ? 'active' : ''}
        onClick={() => setTab('profile')}
      >
        <User size={20} />
        <span>Me</span>
      </button>
    </nav>
  );
}

