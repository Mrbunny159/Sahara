// Firebase SDK via official CDN (ES modules)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB3rtjGBc1uUR-lz6a1qw1KBCZqY9mw1P8",
  authDomain: "mental-wellness-12.firebaseapp.com",
  projectId: "mental-wellness-12",
  storageBucket: "mental-wellness-12.firebasestorage.app",
  messagingSenderId: "930669100731",
  appId: "1:930669100731:web:816d83e4c36b2263f1b39e"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);