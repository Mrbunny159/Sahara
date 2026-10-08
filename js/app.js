import { app, auth, db } from './firebase.js';
import { t, applyLanguage, getLanguage } from './lang.js';

import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged, updateProfile, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, where, setDoc, serverTimestamp,
  updateDoc, increment, orderBy, limit
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

console.log('Firebase connected:', app.name);

const $ = (selector) => document.querySelector(selector);

// ----- App state -----
const state = {
  name: '', contact: '', isGuest: false,
  answers: {}, moodHistory: [],
  journals: [
    { id: 1, title: 'A good day', content: 'Feeling a bit better today. Meditation helped me.', date: new Date() },
    { id: 2, title: 'Tough day', content: 'Had a tough day at work. Feeling stressed.', date: new Date(Date.now() - 86400000) },
  ],
  posts: [
    { id: 1, author: 'Riya',  avatar: '👩', text: 'You are stronger than you think. 💜', likes: 24, liked: false },
    { id: 2, author: 'Arjun', avatar: '👨', text: "It's okay to take a break. Rest is productive too.", likes: 18, liked: false },
  ],
};

// ----- Firebase helpers -----
const isLoggedIn = () => !!auth.currentUser;
const uid = () => auth.currentUser.uid;

async function saveUserProfile(user) {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid, name: user.displayName || 'Friend',
    email: user.email || '', language: getLanguage(), createdAt: serverTimestamp(),
  }, { merge: true });
}

/* ============ NAVIGATION WITH HISTORY ============ */
const mainScreens = ['screen-home', 'screen-journal', 'screen-community', 'screen-profile', 'screen-suggestions'];
let currentScreenId = 'screen-splash';
let lastCategory = 'Balanced';
const screenHistory = [];

function showScreen(screenId) {
  if (screenId === currentScreenId) return;
  screenHistory.push(currentScreenId);
  activateScreen(screenId);
}

function goBack() {
  activateScreen(screenHistory.pop() || 'screen-splash');
}

function resetNavigation() {
  screenHistory.length = 0;
  activateScreen('screen-splash');
}

function activateScreen(screenId) {
  const target = document.getElementById(screenId);
  if (!target) { console.warn(`Screen "${screenId}" is not built yet.`); return; }
  currentScreenId = screenId;

  document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
  target.classList.add('active');

  $('#bottom-nav').hidden = !mainScreens.includes(screenId);
  const activeFor = screenId === 'screen-suggestions' ? 'screen-home' : screenId;
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.screen === activeFor);
  });

  if (screenId === 'screen-home') renderHome();
  if (screenId === 'screen-mood-tracker') renderMoodTracker();
  if (screenId === 'screen-community') renderPosts();
  if (screenId === 'screen-profile') renderProfile();
  if (screenId === 'screen-counsellors') { renderCounsellors(); loadBookings(); }
}

document.querySelectorAll('.top-back').forEach((btn) => btn.addEventListener('click', goBack));
// 🌐 language buttons (splash globe + profile row) — THIS is the fix
document.querySelectorAll('[data-open-lang]').forEach((el) => el.addEventListener('click', () => showScreen('screen-language')));

// When language changes: re-render whatever screen is open (dynamic text)
window.addEventListener('mw-language-change', () => {
  const c = currentScreenId;
  if (c === 'screen-home') renderHome();
  if (c === 'screen-onboarding') renderQuestion();
  if (c === 'screen-results') finishOnboarding();
  if (c === 'screen-suggestions') renderSuggestions(lastCategory);
  if (c === 'screen-mood-tracker') renderMoodTracker();
  if (c === 'screen-community') renderPosts();
  if (c === 'screen-journal') renderJournal();
  if (c === 'screen-profile') renderProfile();
  if (c === 'screen-counsellors') { renderCounsellors(); loadBookings(); }
});

// ----- Auth observer -----
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.displayName || user.email);
    state.name = user.displayName || user.email.split('@')[0];
    state.contact = user.email || '';
    state.isGuest = false;
    loadJournalsFromCloud();
    loadMoodsFromCloud();
    loadPostsFromCloud();
    const currentScreen = document.querySelector('.screen.active')?.id;
    if (!currentScreen || currentScreen === 'screen-splash' || currentScreen === 'screen-auth') {
      showScreen('screen-welcome');
    }
  }
});

/* ============ AUTH FLOW ============ */
$('#btn-get-started').addEventListener('click', () => showScreen('screen-auth'));
$('#btn-guest').addEventListener('click', () => { state.isGuest = true; startOnboarding(); });
$('#btn-signup').addEventListener('click', handleSignup);

async function handleSignup() {
  const name = $('#input-name').value.trim();
  const email = $('#input-contact').value.trim();
  const password = $('#input-password').value;

  if (email === '' || password.length < 6) { $('#auth-error').textContent = 'Please enter a valid email and a password (min 6 chars).'; return; }
  if (name === '') { $('#auth-error').textContent = 'Please enter your name.'; return; }

  $('#btn-signup').textContent = '...';
  $('#btn-signup').disabled = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await saveUserProfile(userCredential.user);
    state.name = name;
    state.contact = email;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use' || error.code === 'auth/invalid-credential') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        state.name = auth.currentUser.displayName || name || email.split('@')[0];
        state.contact = email;
      } catch (loginError) {
        $('#auth-error').textContent = 'Incorrect password.';
        resetSignupButton();
        return;
      }
    } else {
      $('#auth-error').textContent = error.message.replace('Firebase: ', '').replace(/(auth\/.*\))/, '');
      resetSignupButton();
      return;
    }
  }

  $('#auth-error').textContent = '';
  showScreen('screen-welcome');
  resetSignupButton();
}

function resetSignupButton() {
  $('#btn-signup').textContent = t('auth.signup');
  $('#btn-signup').disabled = false;
}

const googleProvider = new GoogleAuthProvider();
$('#btn-google').addEventListener('click', async () => {
  try {
    $('#btn-google').innerHTML = '...';
    const result = await signInWithPopup(auth, googleProvider);
    state.name = result.user.displayName || 'Friend';
    state.contact = result.user.email;
    await saveUserProfile(result.user);
    showScreen('screen-welcome');
  } catch (error) {
    console.error(error);
    if (error.code !== 'auth/popup-closed-by-user') $('#auth-error').textContent = 'Google login failed or was cancelled.';
  } finally {
    $('#btn-google').innerHTML = `🌐 ${t('auth.google')}`;
  }
});

$('#btn-phone').addEventListener('click', () => { showScreen('screen-otp'); startResendTimer(); });

// ----- OTP boxes -----
const otpBoxes = document.querySelectorAll('.otp-box');
otpBoxes.forEach((box, index) => {
  box.addEventListener('input', () => {
    box.value = box.value.replace(/[^0-9]/g, '');
    if (box.value && index < otpBoxes.length - 1) otpBoxes[index + 1].focus();
  });
  box.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); $('#btn-verify').click(); return; }
    if (event.key === 'Backspace' && !box.value && index > 0) otpBoxes[index - 1].focus();
  });
});

$('#btn-verify').addEventListener('click', () => {
  const code = Array.from(otpBoxes).map((box) => box.value).join('');
  if (code.length !== 6) { $('#otp-error').textContent = 'Please enter the 6-digit code.'; return; }
  $('#otp-error').textContent = '';
  goWelcome();
});

$('#link-change-number').addEventListener('click', () => showScreen('screen-auth'));

let resendInterval = null;
function startResendTimer() {
  stopResendTimer();
  let seconds = 25;
  $('#resend-timer').textContent = formatTime(seconds);
  resendInterval = setInterval(() => {
    seconds--;
    $('#resend-timer').textContent = formatTime(seconds);
    if (seconds <= 0) stopResendTimer();
  }, 1000);
}
function stopResendTimer() { clearInterval(resendInterval); resendInterval = null; }
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function goWelcome() {
  const firstName = state.name.split(' ')[0] || 'Friend';
  $('#welcome-title').textContent = `${t('welcome.title')}, ${firstName}! 👋`;
  showScreen('screen-welcome');
}
$('#btn-welcome-next').addEventListener('click', startOnboarding);

/* ============ ENTER-KEY FLOW ============ */
function onEnter(el, fn) {
  el.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); fn(); }
  });
}
onEnter($('#input-name'), () => $('#input-contact').focus());
onEnter($('#input-contact'), () => $('#input-password').focus());
onEnter($('#input-password'), handleSignup);
onEnter($('#new-post-input'), () => $('#btn-new-post').click());
onEnter($('#journal-title'), () => $('#journal-content').focus());
$('#journal-content').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    $('#btn-save-journal').click();
  }
});

/* ============ ONBOARDING Q&A (translation-key driven) ============ */
const questions = [
  { id: 'mood', type: 'emoji', titleKey: 'q.mood.title',
    options: [
      { label: 'Very Bad', emoji: '😞', key: 'q.mood.veryBad' }, { label: 'Bad', emoji: '😕', key: 'q.mood.bad' },
      { label: 'Okay', emoji: '😐', key: 'q.mood.okay' }, { label: 'Good', emoji: '🙂', key: 'q.mood.good' },
      { label: 'Great', emoji: '😄', key: 'q.mood.great' },
    ] },
  { id: 'concerns', type: 'multi', titleKey: 'q.concerns.title',
    options: [
      { label: 'Stress / Anxiety', key: 'q.concerns.stress' }, { label: 'Sadness / Low Mood', key: 'q.concerns.sadness' },
      { label: 'Overthinking', key: 'q.concerns.overthinking' }, { label: 'Relationship Issues', key: 'q.concerns.relationship' },
      { label: 'Work / Study Pressure', key: 'q.concerns.work' }, { label: 'Other', key: 'q.concerns.other' },
    ] },
  { id: 'stress', type: 'single', titleKey: 'q.stress.title',
    options: [
      { label: 'Always', key: 'q.stress.always' }, { label: 'Often', key: 'q.stress.often' },
      { label: 'Sometimes', key: 'q.stress.sometimes' }, { label: 'Rarely', key: 'q.stress.rarely' },
      { label: 'Never', key: 'q.stress.never' },
    ] },
  { id: 'note', type: 'text', titleKey: 'q.note.title' },
];

const moodOption = (label) => questions[0].options.find((o) => o.label === label) || {};

let currentQuestion = 0;

function startOnboarding() {
  currentQuestion = 0;
  showScreen('screen-onboarding');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQuestion];
  $('#qa-progress').textContent = `${currentQuestion + 1} / ${questions.length}`;
  $('#qa-title').textContent = t(q.titleKey);
  $('#qa-error').textContent = '';
  $('#btn-qa-back').style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
  $('#btn-qa-next').textContent = currentQuestion === questions.length - 1 ? t('qa.submit') : t('qa.next');

  const isText = q.type === 'text';
  $('#qa-text').hidden = !isText;
  $('#qa-options').hidden = isText;
  if (isText) { $('#qa-text').value = state.answers[q.id] || ''; return; }

  const box = $('#qa-options');
  box.innerHTML = '';
  box.className = q.type === 'emoji' ? 'qa-options emoji-grid' : 'qa-options';

  q.options.forEach((opt) => {
    const button = document.createElement('button');
    button.className = 'option';
    if (q.type === 'emoji') button.innerHTML = `<span class="emoji">${opt.emoji}</span><small>${t(opt.key)}</small>`;
    else button.textContent = t(opt.key);

    const saved = state.answers[q.id];
    if (q.type === 'multi' ? (saved || []).includes(opt.label) : saved === opt.label) button.classList.add('selected');

    button.addEventListener('click', () => selectOption(q, opt.label, button, box));
    box.appendChild(button);
  });
}

function selectOption(q, label, button, box) {
  if (q.type === 'multi') {
    const saved = state.answers[q.id] || [];
    if (saved.includes(label)) {
      state.answers[q.id] = saved.filter((item) => item !== label);
      button.classList.remove('selected');
    } else {
      state.answers[q.id] = [...saved, label];
      button.classList.add('selected');
    }
  } else {
    state.answers[q.id] = label;
    box.querySelectorAll('.option').forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
  }
  $('#qa-error').textContent = '';
}

function hasAnswer(q) {
  const a = state.answers[q.id];
  return q.type === 'multi' ? Array.isArray(a) && a.length > 0 : !!a;
}

$('#btn-qa-back').addEventListener('click', () => { if (currentQuestion > 0) { currentQuestion--; renderQuestion(); } });
$('#btn-qa-next').addEventListener('click', () => {
  const q = questions[currentQuestion];
  if (q.type === 'text') state.answers[q.id] = $('#qa-text').value.trim();
  else if (!hasAnswer(q)) { $('#qa-error').textContent = t('qa.error'); return; }
  if (currentQuestion < questions.length - 1) { currentQuestion++; renderQuestion(); }
  else finishOnboarding();
});

/* ============ RESULTS + SUGGESTIONS ============ */
const moodScores   = { 'Very Bad': 1, 'Bad': 2, 'Okay': 3, 'Good': 4, 'Great': 5 };
const stressScores = { 'Always': 5, 'Often': 4, 'Sometimes': 3, 'Rarely': 2, 'Never': 1 };

const categoryInfo = {
  'High Stress':     { emoji: '😞', pillClass: 'pill-red',    nameKey: 'cat.high',     msgKey: 'cat.high.msg' },
  'Moderate Stress': { emoji: '😐', pillClass: 'pill-orange', nameKey: 'cat.moderate', msgKey: 'cat.moderate.msg' },
  'Balanced':        { emoji: '🙂', pillClass: 'pill-green',  nameKey: 'cat.balanced', msgKey: 'cat.balanced.msg' },
};

const services = [
  { id: 'counsellor', icon: '👩️', color: 'pink',   titleKey: 'svc.counsellor', descKey: 'svc.counsellor.desc', screen: 'screen-counsellor' },
  { id: 'meditate',   icon: '🌿', color: 'green',  titleKey: 'svc.meditate',   descKey: 'svc.meditate.desc',   screen: 'screen-meditate' },
  { id: 'mood',       icon: '📈', color: 'blue',   titleKey: 'svc.mood',       descKey: 'svc.mood.desc',       screen: 'screen-mood-tracker' },
  { id: 'articles',   icon: '📖', color: 'orange', titleKey: 'svc.articles',   descKey: 'svc.articles.desc',   screen: 'screen-articles' },
];

const planByCategory = {
  'High Stress':     ['counsellor', 'meditate', 'mood', 'articles'],
  'Moderate Stress': ['meditate', 'mood', 'articles', 'counsellor'],
  'Balanced':        ['mood', 'articles', 'meditate'],
};

function calculateCategory() {
  const mood = moodScores[state.answers.mood] || 3;
  const stress = stressScores[state.answers.stress] || 3;
  const score = (6 - mood) + stress;
  if (score >= 7) return 'High Stress';
  if (score >= 4) return 'Moderate Stress';
  return 'Balanced';
}

function finishOnboarding() {
  lastCategory = calculateCategory();
  const info = categoryInfo[lastCategory];
  $('#result-emoji').textContent = info.emoji;
  $('#result-message').textContent = t(info.msgKey);
  const pill = $('#result-category');
  pill.textContent = t(info.nameKey);
  pill.className = 'mood-pill ' + info.pillClass;
  renderSuggestions(lastCategory);
  showScreen('screen-results');
}

function renderSuggestions(category) {
  const list = $('#suggestions-list');
  list.innerHTML = '';
  planByCategory[category].forEach((id) => {
    const service = services.find((s) => s.id === id);
    const card = document.createElement('button');
    card.className = 'suggestion-card';
    card.innerHTML = `
      <span class="suggestion-icon icon-${service.color}">${service.icon}</span>
      <span class="suggestion-text"><strong>${t(service.titleKey)}</strong><small>${t(service.descKey)}</small></span>
      <span class="chev">›</span>`;
    card.addEventListener('click', () => showScreen(service.screen));
    list.appendChild(card);
  });
}

$('#btn-view-suggestions').addEventListener('click', () => showScreen('screen-suggestions'));

// ----- Toast -----
let toastTimeout = null;
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

$('#btn-book-session').addEventListener('click', () => showScreen('screen-counsellors'));
$('#link-view-counsellors').addEventListener('click', () => showScreen('screen-counsellors'));
$('#btn-start-session').addEventListener('click', () => showToast(t('toast.demoMeditate')));
document.querySelectorAll('.demo-soon').forEach((el) => el.addEventListener('click', () => showToast(t('toast.comingSoon'))));

/* ============ DASHBOARD + NAV ============ */
document.querySelectorAll('[data-screen]').forEach((el) => el.addEventListener('click', () => showScreen(el.dataset.screen)));

const tips = ['tip.1', 'tip.2', 'tip.3', 'tip.4', 'tip.5'];

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'greet.morning';
  if (hour < 17) return 'greet.afternoon';
  return 'greet.evening';
}

function renderHome() {
  const firstName = state.name.split(' ')[0] || 'Friend';
  $('#home-greeting').textContent = `${t(getGreetingKey())}, ${firstName}! 👋`;
  $('#daily-tip').textContent = t(tips[new Date().getDate() % tips.length]);
}

function renderMoodRow() {
  const row = $('#mood-row');
  questions[0].options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'mood-btn';
    btn.textContent = opt.emoji;
    btn.title = opt.label;
    btn.addEventListener('click', () => saveQuickMood(opt.label));
    row.appendChild(btn);
  });
}

function saveQuickMood(mood) {
  const entry = { date: new Date(), mood };
  state.moodHistory.push(entry);
  if (isLoggedIn()) {
    addDoc(collection(db, 'moods'), { uid: uid(), mood, date: entry.date })
      .catch((err) => console.error(err));
  }
  showToast(`${t('toast.moodSaved')}: ${t(moodOption(mood).key)} 💚`);
}

function seedDemoMoods() {
  const moods = ['Good', 'Okay', 'Bad', 'Great', 'Okay'];
  moods.forEach((mood, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (moods.length - i));
    state.moodHistory.push({ date: d, mood });
  });
}
seedDemoMoods();
renderMoodRow();

/* ============ TALK TO EXPERT ============ */
const counsellors = [
  { name: 'Dr. Priya Sharma',  spec: 'Stress & Anxiety',            avatar: '👩️', exp: '8 yrs' },
  { name: 'Rahul Mehta',       spec: 'Relationships & Self-esteem', avatar: '🧑⚕️', exp: '6 yrs' },
  { name: 'Dr. Anil Kulkarni', spec: 'Work-life & Burnout',         avatar: '👨⚕️', exp: '10 yrs' },
];

function renderCounsellors() {
  const box = $('#counsellor-list');
  box.innerHTML = '';
  counsellors.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'counsellor-card';
    card.innerHTML = `
      <span class="post-avatar">${c.avatar}</span>
      <span class="suggestion-text"><strong>${c.name}</strong><small>${c.spec} • ${c.exp}</small></span>
      <button class="btn btn-primary btn-sm">Book</button>`;
    card.querySelector('button').addEventListener('click', () => bookSession(c));
    box.appendChild(card);
  });
}

async function bookSession(c) {
  if (isLoggedIn()) {
    try {
      await addDoc(collection(db, 'bookings'), { uid: uid(), counsellor: c.name, spec: c.spec, date: new Date() });
      showToast(`${t('toast.booked')} ${c.name} 💚`);
    } catch (err) {
      console.error(err);
      showToast(t('toast.bookingFailed'));
      return;
    }
  } else {
    showToast(`${t('toast.demoBooking')}: ${c.name}`);
  }
  loadBookings();
}

async function loadBookings() {
  const box = $('#booking-list');
  if (!isLoggedIn()) { box.innerHTML = `<p class="placeholder-note">${t('cl.login')}</p>`; return; }
  try {
    const snap = await getDocs(query(collection(db, 'bookings'), where('uid', '==', uid())));
    if (snap.empty) { box.innerHTML = `<p class="placeholder-note">${t('cl.none')}</p>`; return; }
    box.innerHTML = '';
    snap.docs.forEach((d) => {
      const b = d.data();
      const date = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      const row = document.createElement('div');
      row.className = 'history-item';
      row.innerHTML = `<span>🗓️ ${b.counsellor}</span><small>${formatDayLabel(date)}</small>`;
      box.appendChild(row);
    });
  } catch (err) { console.error(err); }
}

/* ============ MOOD TRACKER + JOURNAL + COMMUNITY + PROFILE ============ */
function renderMoodTracker() {
  const chart = $('#mood-chart');
  chart.innerHTML = '';
  const recent = state.moodHistory.slice(-7);
  recent.forEach((entry) => {
    const score = moodScores[entry.mood] || 3;
    const opt = moodOption(entry.mood);
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `<span class="bar-emoji">${opt.emoji || '😐'}</span><div class="bar" style="height: ${score * 20}px"></div><small>${entry.date.toLocaleDateString('en-GB', { weekday: 'short' })}</small>`;
    chart.appendChild(col);
  });
  const goodDays = recent.filter((e) => (moodScores[e.mood] || 3) >= 4).length;
  $('#mood-insight').textContent = goodDays === 1 ? t('mt.insightOne') : t('mt.insightMany', { x: goodDays });
}

$('#btn-view-history').addEventListener('click', () => {
  const list = $('#mood-history');
  list.hidden = !list.hidden;
  if (list.hidden) return;
  list.innerHTML = '';
  [...state.moodHistory].reverse().forEach((entry) => {
    const opt = moodOption(entry.mood);
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<span>${formatDayLabel(entry.date)}</span><span>${opt.emoji || '😐'} ${t(opt.key) || entry.mood}</span>`;
    list.appendChild(item);
  });
});

function formatDayLabel(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return t('day.today');
  if (date.toDateString() === yesterday.toDateString()) return t('day.yesterday');
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

async function loadMoodsFromCloud() {
  if (!isLoggedIn()) return;
  try {
    const q = query(collection(db, 'moods'), where('uid', '==', uid()));
    const snapshot = await getDocs(q);
    const cloud = snapshot.docs.map((d) => {
      const data = d.data();
      return { mood: data.mood, date: data.date?.toDate ? data.date.toDate() : new Date(data.date) };
    });
    cloud.sort((a, b) => a.date - b.date);
    state.moodHistory = cloud;
  } catch (err) { console.error('Failed to load moods:', err); }
}

async function loadPostsFromCloud() {
  if (!isLoggedIn()) return;
  try {
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    state.posts = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id, author: data.author, avatar: data.avatar, text: data.text,
        likes: data.likes || 0, liked: false,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });
    renderPosts();
  } catch (err) { console.error('Failed to load posts:', err); }
}

// ----- Journal -----
$('#tab-entries').addEventListener('click', () => showJournalTab('entries'));
$('#tab-new').addEventListener('click', () => showJournalTab('new'));

function showJournalTab(tab) {
  $('#tab-entries').classList.toggle('active', tab === 'entries');
  $('#tab-new').classList.toggle('active', tab === 'new');
  $('#journal-entries').hidden = tab !== 'entries';
  $('#journal-new').hidden = tab !== 'new';
  if (tab === 'entries') renderJournal();
}

function renderJournal() {
  const box = $('#journal-entries');
  box.innerHTML = '';
  if (state.journals.length === 0) { box.innerHTML = `<p class="placeholder-note">${t('j.none')}</p>`; return; }
  state.journals.forEach((entry) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `<header><small>${formatDayLabel(entry.date)}</small><button class="delete-btn">${t('j.delete')}</button></header><strong>${entry.title}</strong><p>${entry.content}</p>`;
    card.querySelector('.delete-btn').addEventListener('click', () => deleteJournal(entry.id));
    box.appendChild(card);
  });
}

async function deleteJournal(id) {
  state.journals = state.journals.filter((e) => e.id !== id);
  renderJournal();
  if (isLoggedIn()) await deleteDoc(doc(db, 'journals', id)).catch((err) => console.error(err));
  showToast(t('j.deleted'));
}

$('#btn-save-journal').addEventListener('click', async () => {
  const title = $('#journal-title').value.trim();
  const content = $('#journal-content').value.trim();
  if (!title || !content) { showToast(t('j.contentPh')); return; }

  const entry = { id: Date.now(), title, content, date: new Date() };
  state.journals.unshift(entry);

  if (isLoggedIn()) {
    try {
      const ref = await addDoc(collection(db, 'journals'), { uid: uid(), title, content, date: entry.date });
      entry.id = ref.id;
    } catch (err) {
      console.error(err);
      showToast(t('toast.cloudFailed'));
    }
  }

  $('#journal-title').value = '';
  $('#journal-content').value = '';
  showJournalTab('entries');
  showToast(t('j.saved'));
});

async function loadJournalsFromCloud() {
  if (!isLoggedIn()) return;
  try {
    const q = query(collection(db, 'journals'), where('uid', '==', uid()));
    const snapshot = await getDocs(q);
    const cloudJournals = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id, title: data.title, content: data.content,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      };
    });
    cloudJournals.sort((a, b) => b.date - a.date);
    state.journals = cloudJournals;
    renderJournal();
  } catch (err) { console.error('Failed to load journals:', err); }
}

// ----- Community -----
function renderPosts() {
  const box = $('#posts-list');
  box.innerHTML = '';
  state.posts.forEach((post) => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `<div class="post-head"><span class="post-avatar">${post.avatar}</span><strong>${post.author}</strong></div><p>${post.text}</p><button class="like-btn ${post.liked ? 'liked' : ''}">❤️ ${post.likes}</button>`;
    card.querySelector('.like-btn').addEventListener('click', async (event) => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      event.currentTarget.textContent = `❤️ ${post.likes}`;
      event.currentTarget.classList.toggle('liked', post.liked);
      if (isLoggedIn()) {
        await updateDoc(doc(db, 'posts', post.id), { likes: increment(post.liked ? 1 : -1) })
          .catch((err) => console.error(err));
      }
    });
    box.appendChild(card);
  });
}

$('#btn-new-post').addEventListener('click', async () => {
  const input = $('#new-post-input');
  const text = input.value.trim();
  if (!text) { showToast(t('c.writeFirst')); return; }

  const post = { id: Date.now(), author: state.name.split(' ')[0] || 'Guest', avatar: '🙂', text, likes: 0, liked: false };
  state.posts.unshift(post);
  input.value = '';
  renderPosts();

  if (isLoggedIn()) {
    try {
      const ref = await addDoc(collection(db, 'posts'), { uid: uid(), author: post.author, avatar: post.avatar, text, likes: 0, date: new Date() });
      post.id = ref.id;
    } catch (err) {
      console.error(err);
      showToast(t('toast.cloudFailed'));
    }
  }
  showToast(t('c.posted'));
});

// ----- Profile -----
function renderProfile() {
  const firstName = state.name.split(' ')[0] || 'Friend';
  $('#profile-avatar').textContent = firstName[0].toUpperCase();
  $('#profile-name').textContent = state.isGuest ? t('p.guest') : state.name;
  $('#profile-contact').textContent = state.isGuest ? t('p.guestMode') : state.contact;
  $('#stat-moods').textContent = state.moodHistory.length;
  $('#stat-journals').textContent = state.journals.length;
  $('#stat-posts').textContent = state.posts.length;
}

$('#btn-logout').addEventListener('click', async () => {
  await signOut(auth);
  state.name = '';
  state.contact = '';
  state.isGuest = false;
  resetNavigation();
  showToast(t('toast.loggedOut'));
});

/* ============ PWA ============ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW registration failed', err));
  });
}

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  setTimeout(() => $('#install-banner').hidden = false, 3000);
});

$('#btn-install').addEventListener('click', async () => {
  if (!deferredInstallPrompt) { showToast('Install not available'); return; }
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  if (outcome === 'accepted') showToast(t('toast.installed'));
  deferredInstallPrompt = null;
  $('#install-banner').hidden = true;
});

$('#btn-dismiss-install').addEventListener('click', () => $('#install-banner').hidden = true);
window.addEventListener('appinstalled', () => {
  $('#install-banner').hidden = true;
  showToast(t('toast.installed'));
});