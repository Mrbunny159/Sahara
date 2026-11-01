import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth, db, googleProvider
} from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc, setDoc, serverTimestamp
} from 'firebase/firestore';
import { GuestAuthService } from '../lib/guestAuthService';
import { FEATURE_FLAGS } from '../config/features';

const AuthContext = createContext(null);
const LOCAL_USER_KEY = 'sahara_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check if there is an active guest session first
    if (FEATURE_FLAGS.ENABLE_GUEST_MODE) {
      const activeGuest = GuestAuthService.getCurrentGuest();
      if (activeGuest) return activeGuest;
    }

    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userData = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Friend',
          isGuest: false,
          photoURL: fbUser.photoURL || null
        };
        setUser(userData);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));

        // Sync user profile to Firestore
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            uid: fbUser.uid,
            name: userData.displayName,
            email: userData.email || '',
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.warn('Firestore user profile sync fallback:', e.message);
        }
      } else {
        // If logged in as guest, maintain guest unless logged out
        if (FEATURE_FLAGS.ENABLE_GUEST_MODE) {
          const guest = GuestAuthService.getCurrentGuest();
          if (guest) {
            setUser(guest);
            setLoading(false);
            return;
          }
        }
        setUser(null);
        localStorage.removeItem(LOCAL_USER_KEY);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with Email
  const signupWithEmail = async (email, password, displayName) => {
    try {
      // Clear any guest session
      GuestAuthService.clearGuestSession();

      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(res.user, { displayName });
      }
      const userData = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: displayName || res.user.email?.split('@')[0] || 'Friend',
        isGuest: false
      };
      setUser(userData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Sign in with Email
  const loginWithEmail = async (email, password) => {
    try {
      // Clear any guest session
      GuestAuthService.clearGuestSession();

      const res = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || res.user.email?.split('@')[0] || 'Friend',
        isGuest: false
      };
      setUser(userData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      GuestAuthService.clearGuestSession();

      const res = await signInWithPopup(auth, googleProvider);
      const userData = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || 'Friend',
        photoURL: res.user.photoURL,
        isGuest: false
      };
      setUser(userData);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Continue as Isolated Guest (Modular)
  const loginAsGuest = (guestName = 'Dear Friend') => {
    if (!FEATURE_FLAGS.ENABLE_GUEST_MODE) {
      return { success: false, error: 'Guest login is currently disabled.' };
    }
    const guestUser = GuestAuthService.createGuestSession(guestName);
    setUser(guestUser);
    return { success: true, user: guestUser };
  };

  // Update Display Name
  const updateDisplayName = async (newName) => {
    if (!newName) return;
    if (user?.isGuest) {
      const updated = { ...user, displayName: newName };
      setUser(updated);
      sessionStorage.setItem('sahara_active_guest_session', JSON.stringify(updated));
      return;
    }
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: newName });
        await setDoc(doc(db, 'users', auth.currentUser.uid), { name: newName }, { merge: true });
      } catch (e) {
        console.warn('Update name warning:', e);
      }
    }
    const updated = { ...user, displayName: newName };
    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
  };

  // Log Out
  const logout = async () => {
    if (user?.isGuest) {
      GuestAuthService.clearGuestSession();
    } else {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Signout warning:', e);
      }
      localStorage.removeItem(LOCAL_USER_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isGuestModeEnabled: FEATURE_FLAGS.ENABLE_GUEST_MODE,
      signupWithEmail,
      loginWithEmail,
      loginWithGoogle,
      loginAsGuest,
      updateDisplayName,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
