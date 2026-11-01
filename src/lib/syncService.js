import { db } from './firebase';
import {
  collection, doc, addDoc, getDocs, deleteDoc,
  query, where, orderBy, limit, setDoc, updateDoc, increment, getDoc
} from 'firebase/firestore';
import { GuestAuthService } from './guestAuthService';

const getUserCacheKey = (uid) => `sahara_user_${uid}_data`;

export const SyncService = {
  // Check if we should sync to Cloud Firestore
  shouldSyncToCloud(user) {
    return user && !user.isGuest && user.uid && !user.uid.startsWith('guest_');
  },

  /**
   * Load entire state for the active user:
   * - If registered: loads from Firestore (with local cache fallback)
   * - If guest: loads strictly from isolated GuestAuthService
   */
  async loadUserData(user) {
    if (!user) {
      return { moods: [], entries: [], chat: [], breaths: 0, bookings: [] };
    }

    // Guest Mode: strictly isolated in-memory/session data, never touching cloud
    if (user.isGuest) {
      return GuestAuthService.loadGuestData(user.sessionId || user.uid);
    }

    // Registered Member: load from Cloud Firestore
    const cacheKey = getUserCacheKey(user.uid);
    let cached = null;
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) cached = JSON.parse(raw);
    } catch (e) {}

    try {
      // 1. Fetch Moods
      const moodsQ = query(collection(db, 'moods'), where('uid', '==', user.uid));
      const moodsSnap = await getDocs(moodsQ);
      const moods = moodsSnap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          v: data.v || data.mood || 3,
          label: data.label || 'Okay',
          note: data.note || '',
          date: data.date || new Date().toISOString().slice(0, 10),
          at: data.at || Date.now()
        };
      }).sort((a, b) => (a.at || 0) - (b.at || 0));

      // 2. Fetch Journals
      const journalsQ = query(collection(db, 'journals'), where('uid', '==', user.uid));
      const journalsSnap = await getDocs(journalsQ);
      const entries = journalsSnap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          text: data.text || data.content || '',
          date: data.date || new Date().toISOString().slice(0, 10),
          at: data.at || Date.now()
        };
      }).sort((a, b) => (a.at || 0) - (b.at || 0));

      // 3. Fetch Bookings
      const bookingsQ = query(collection(db, 'bookings'), where('uid', '==', user.uid));
      const bookingsSnap = await getDocs(bookingsQ);
      const bookings = bookingsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      // 4. Fetch User Stats (Breaths, etc.)
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      const breaths = userData.breaths || 0;

      // Keep Chat from local storage cache
      const chat = cached?.chat || [];

      const syncedData = {
        moods,
        entries,
        chat,
        breaths,
        bookings
      };

      // Update local cache
      localStorage.setItem(cacheKey, JSON.stringify(syncedData));
      return syncedData;
    } catch (err) {
      console.warn('Firestore sync warning (using cached data):', err.message);
      return cached || { moods: [], entries: [], chat: [], breaths: 0, bookings: [] };
    }
  },

  // Save full data state locally or in guest service
  persistLocal(user, data) {
    if (!user) return;
    if (user.isGuest) {
      GuestAuthService.saveGuestData(user.sessionId || user.uid, data);
    } else {
      localStorage.setItem(getUserCacheKey(user.uid), JSON.stringify(data));
    }
  },

  // Mood sync
  async syncAddMood(user, mood) {
    if (!this.shouldSyncToCloud(user)) return null;
    try {
      const docRef = await addDoc(collection(db, 'moods'), {
        uid: user.uid,
        v: mood.v,
        mood: mood.v,
        label: mood.label,
        note: mood.note || '',
        date: mood.date,
        at: mood.at || Date.now()
      });
      return docRef.id;
    } catch (e) {
      console.warn('Sync add mood warning:', e);
      return null;
    }
  },

  async syncDeleteMood(user, at) {
    if (!this.shouldSyncToCloud(user)) return;
    try {
      const q = query(collection(db, 'moods'), where('uid', '==', user.uid), where('at', '==', at));
      const snap = await getDocs(q);
      snap.forEach(async (d) => {
        await deleteDoc(doc(db, 'moods', d.id));
      });
    } catch (e) {
      console.warn('Sync delete mood warning:', e);
    }
  },

  // Journal sync
  async syncAddJournal(user, entry) {
    if (!this.shouldSyncToCloud(user)) return null;
    try {
      const docRef = await addDoc(collection(db, 'journals'), {
        uid: user.uid,
        text: entry.text,
        content: entry.text,
        date: entry.date,
        at: entry.at || Date.now()
      });
      return docRef.id;
    } catch (e) {
      console.warn('Sync add journal warning:', e);
      return null;
    }
  },

  async syncDeleteJournal(user, at) {
    if (!this.shouldSyncToCloud(user)) return;
    try {
      const q = query(collection(db, 'journals'), where('uid', '==', user.uid), where('at', '==', at));
      const snap = await getDocs(q);
      snap.forEach(async (d) => {
        await deleteDoc(doc(db, 'journals', d.id));
      });
    } catch (e) {
      console.warn('Sync delete journal warning:', e);
    }
  },

  // Breath count sync
  async syncIncrementBreath(user, count) {
    if (!this.shouldSyncToCloud(user)) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { breaths: count }, { merge: true });
    } catch (e) {
      console.warn('Sync breath warning:', e);
    }
  },

  // Bookings sync
  async syncAddBooking(user, booking) {
    if (!this.shouldSyncToCloud(user)) return null;
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        uid: user.uid,
        counsellor: booking.counsellor,
        specialty: booking.specialty,
        spec: booking.specialty,
        date: booking.date,
        time: booking.time,
        type: booking.type,
        createdAt: booking.createdAt || Date.now()
      });
      return docRef.id;
    } catch (e) {
      console.warn('Sync booking warning:', e);
      return null;
    }
  },

  async syncDeleteBooking(user, bookingId) {
    if (!this.shouldSyncToCloud(user)) return;
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (e) {
      console.warn('Sync delete booking warning:', e);
    }
  },

  // Community Posts sync (shared across users)
  async fetchCommunityPosts() {
    try {
      const q = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
    } catch (e) {
      console.warn('Fetch community posts warning:', e);
      return [];
    }
  },

  async addCommunityPost(user, post) {
    if (!user || user.isGuest) {
      return null;
    }
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        uid: user.uid,
        author: user.displayName || 'Sanctuary Friend',
        circle: post.circle || 'General',
        tag: post.tag || '🌱 General Support',
        avatar: post.avatar || '🌿',
        text: post.text,
        likes: 0,
        date: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.warn('Add community post warning:', e);
      return null;
    }
  },

  async likeCommunityPost(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (e) {
      console.warn('Like post warning:', e);
    }
  }
};

