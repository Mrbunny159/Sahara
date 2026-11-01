import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import MitraChat from './components/MitraChat';
import RestoreCare from './components/RestoreCare';
import Community from './components/Community';
import ProfilePrivacy from './components/ProfilePrivacy';
import { SyncService } from './lib/syncService';

// Zero filler data - clean initial state
const CLEAN_EMPTY_STATE = {
  moods: [],
  entries: [],
  chat: [],
  breaths: 0,
  bookings: []
};

export default function App() {
  const { user, loading, logout } = useAuth();

  // App Flow: 'landing' -> 'splash' -> 'app'
  const [view, setView] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentTab, setTab] = useState('home');

  // Core synchronized user data
  const [wellnessData, setWellnessData] = useState(CLEAN_EMPTY_STATE);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Toast notifications
  const [toastMsg, setToastMsg] = useState('');

  // 1. Sync User Data when user logs in or switches
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (user) {
        const data = await SyncService.loadUserData(user);
        if (isMounted) {
          // Initialize default gentle greeting if chat is brand new
          const initialChat = (data.chat && data.chat.length > 0)
            ? data.chat
            : [{
                from: 'mitra',
                text: `Namaste${user.displayName ? ' ' + user.displayName : ''} 🙏. I'm Mitra. This is your safe, private sanctuary. How is your mind feeling today?`,
                at: Date.now()
              }];

          setWellnessData({
            ...data,
            chat: initialChat
          });
          setIsDataLoaded(true);
        }
      } else {
        if (isMounted) {
          setWellnessData(CLEAN_EMPTY_STATE);
          setIsDataLoaded(false);
        }
      }
    }

    loadData();

    return () => { isMounted = false; };
  }, [user]);

  // 2. Persist local cache when state changes
  useEffect(() => {
    if (user && isDataLoaded) {
      SyncService.persistLocal(user, wellnessData);
    }
  }, [wellnessData, user, isDataLoaded]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 2800);
  };

  // Auth flow triggers
  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    // User Journey: Landing -> Login -> Logo -> Splash Screen Animation -> Web App
    setView('splash');
  };

  const handleSplashComplete = () => {
    setView('app');
  };

  // --- Synchronized Data Actions ---

  // Moods
  const handleSaveMood = async (moodObj) => {
    setWellnessData(prev => ({
      ...prev,
      moods: [...prev.moods, moodObj]
    }));
    await SyncService.syncAddMood(user, moodObj);
  };

  const handleSaveQuickMood = async (m) => {
    const newMood = {
      date: new Date().toISOString().slice(0, 10),
      v: m.v,
      label: m.l,
      note: 'Quick check-in from dashboard',
      at: Date.now()
    };
    await handleSaveMood(newMood);
    showToast(`Logged mood: ${m.l} ${m.e} 🌿`);
  };

  const handleDeleteMood = async (at) => {
    setWellnessData(prev => ({
      ...prev,
      moods: prev.moods.filter(m => m.at !== at)
    }));
    await SyncService.syncDeleteMood(user, at);
    showToast('Check-in removed.');
  };

  // Journals
  const handleSaveEntry = async (entryObj) => {
    setWellnessData(prev => ({
      ...prev,
      entries: [...prev.entries, entryObj]
    }));
    await SyncService.syncAddJournal(user, entryObj);
  };

  const handleDeleteEntry = async (at) => {
    setWellnessData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.at !== at)
    }));
    await SyncService.syncDeleteJournal(user, at);
    showToast('Journal entry deleted.');
  };

  // Chat
  const handleSendMessage = (msgObj) => {
    setWellnessData(prev => ({
      ...prev,
      chat: [...prev.chat, msgObj]
    }));
  };

  // Breaths
  const handleIncrementBreath = async () => {
    const updatedCount = (wellnessData.breaths || 0) + 1;
    setWellnessData(prev => ({
      ...prev,
      breaths: updatedCount
    }));
    await SyncService.syncIncrementBreath(user, updatedCount);
  };

  // Bookings
  const handleAddBooking = async (bookingObj) => {
    const cloudId = await SyncService.syncAddBooking(user, bookingObj);
    if (cloudId) bookingObj.id = cloudId;
    setWellnessData(prev => ({
      ...prev,
      bookings: [bookingObj, ...(prev.bookings || [])]
    }));
  };

  const handleCancelBooking = async (id) => {
    setWellnessData(prev => ({
      ...prev,
      bookings: (prev.bookings || []).filter(b => b.id !== id)
    }));
    await SyncService.syncDeleteBooking(user, id);
    showToast('Consultation cancelled.');
  };

  // Erase all data
  const handleEraseAllData = () => {
    setWellnessData(CLEAN_EMPTY_STATE);
    if (user) {
      SyncService.persistLocal(user, CLEAN_EMPTY_STATE);
    }
    showToast('All your sanctuary data has been erased.');
    setTab('home');
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    setView('landing');
    setWellnessData(CLEAN_EMPTY_STATE);
    showToast('Signed out safely. Take care 🌿');
  };

  // Render Splash Animation
  if (view === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Render Public Landing Page
  if (view === 'landing') {
    return (
      <>
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onOpenApp={() => {
            if (user) {
              setView('splash');
            } else {
              setAuthModalOpen(true);
            }
          }}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        {toastMsg && (
          <div className="toast-bar">
            <span>🌿</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </>
    );
  }

  // Render Main Web App
  return (
    <div className="app-shell">
      {/* Sidebar for Desktop */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        onGoLanding={() => setView('landing')}
      />

      {/* Main Screen Body */}
      <main className="app-main">
        {currentTab === 'home' && (
          <Dashboard
            setTab={setTab}
            moods={wellnessData.moods}
            entries={wellnessData.entries}
            onSaveQuickMood={handleSaveQuickMood}
          />
        )}

        {currentTab === 'mood' && (
          <MoodTracker
            moods={wellnessData.moods}
            onSaveMood={handleSaveMood}
            onDeleteMood={handleDeleteMood}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'journal' && (
          <Journal
            entries={wellnessData.entries}
            onSaveEntry={handleSaveEntry}
            onDeleteEntry={handleDeleteEntry}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'mitra' && (
          <MitraChat
            chat={wellnessData.chat}
            onSendMessage={handleSendMessage}
            userName={user?.displayName || 'Friend'}
          />
        )}

        {(currentTab === 'breathe' || currentTab === 'counsellors') && (
          <RestoreCare
            breaths={wellnessData.breaths}
            bookings={wellnessData.bookings}
            onIncrementBreath={handleIncrementBreath}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'community' && (
          <Community
            userName={user?.displayName || 'Friend'}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePrivacy
            onEraseAllData={handleEraseAllData}
            onShowToast={showToast}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav
        currentTab={currentTab}
        setTab={setTab}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-bar">
          <span>🌿</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
