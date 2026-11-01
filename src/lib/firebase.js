import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3rtjGBc1uUR-lz6a1qw1KBCZqY9mw1P8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mental-wellness-12.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mental-wellness-12",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mental-wellness-12.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "930669100731",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:930669100731:web:816d83e4c36b2263f1b39e"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;

