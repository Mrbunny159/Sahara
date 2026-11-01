import { FEATURE_FLAGS } from '../config/features';

const GUEST_SESSION_KEY = 'sahara_active_guest_session';

/**
 * Modular Guest Authentication Service.
 * Manages completely isolated guest sessions.
 * Each guest receives a unique session ID so multiple guest logins never share or bleed data.
 * When guest login is retired in future iterations, this module can be cleanly removed.
 */
export const GuestAuthService = {
  isEnabled() {
    return Boolean(FEATURE_FLAGS.ENABLE_GUEST_MODE);
  },

  createGuestSession(guestName = 'Dear Friend') {
    if (!this.isEnabled()) {
      throw new Error('Guest login is currently disabled.');
    }

    // Generate unique isolated session ID
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const guestUser = {
      uid: guestId,
      displayName: guestName.trim() || 'Dear Friend',
      email: null,
      isGuest: true,
      sessionId: guestId,
      createdAt: Date.now()
    };

    // Store active guest session in sessionStorage (isolated per tab/session)
    sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestUser));

    // Clear any previous guest storage key to ensure 100% clean blank state
    this.initGuestData(guestId);

    return guestUser;
  },

  getCurrentGuest() {
    if (!this.isEnabled()) return null;
    try {
      const saved = sessionStorage.getItem(GUEST_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  clearGuestSession() {
    const current = this.getCurrentGuest();
    if (current?.sessionId) {
      sessionStorage.removeItem(`sahara_guest_data_${current.sessionId}`);
    }
    sessionStorage.removeItem(GUEST_SESSION_KEY);
  },

  // Isolated data storage for this guest
  initGuestData(guestId) {
    const emptyState = {
      moods: [],
      entries: [],
      chat: [],
      breaths: 0,
      bookings: []
    };
    sessionStorage.setItem(`sahara_guest_data_${guestId}`, JSON.stringify(emptyState));
    return emptyState;
  },

  loadGuestData(guestId) {
    try {
      const data = sessionStorage.getItem(`sahara_guest_data_${guestId}`);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return this.initGuestData(guestId);
  },

  saveGuestData(guestId, data) {
    if (!guestId) return;
    try {
      sessionStorage.setItem(`sahara_guest_data_${guestId}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Guest data save warning:', e);
    }
  }
};

