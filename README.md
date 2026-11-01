# 🧠 Sahara — Mental Wellness Support Platform

> **"जब कोई नहीं, तब सहारा"**  
> India's first all-generation mental wellness companion, designed for teenagers aged 13 to elders over 70. Built with uncompromising privacy, cultural warmth, and zero judgment.

---

## 🌟 Overview

**Sahara** provides a serene, private, and culturally empathetic digital sanctuary to help Indian families monitor, nurture, and reclaim their mental peace. Re-architected with **React 19 + Vite**, Sahara delivers a seamless, responsive experience across all screen sizes (mobile, tablet, desktop).

### 🧭 User Journey Flow
1. **Landing Page:** Comprehensive sanctuary introduction featuring the 6 Pillars of Wellness, Generational Care (Students, Working Adults, Elders), Indian Mental Health realities ("Log kya kahenge"), Meet Mitra, and Founder Commitments.
2. **Authentication:** Frictionless access via Email/Password, Google Sign-In, or 1-tap Anonymous Guest Mode.
3. **Logo & Splash Screen Animation:** Immersive transition featuring the official Sahara Logo, radiant glowing aura, Hindi script tagline (*"जब कोई नहीं, तब सहारा"*), and calming progress loader.
4. **Web App Sanctuary:** Personal dashboard, daily mood tracker, private journal, Mitra AI companion, guided 4-4-4-4 box breathing, verified therapist directory, and support circles.

---

## ✨ Core Features

### 📈 Daily Mood Tracking & Trend Curve (Feel)
- **5-Point Mood Scale:** Check in with intuitive emojis (Low 😔, Uneasy 😕, Okay 😐, Good 🙂, Great 😊).
- **14-Day Visual Trend:** Interactive SVG trend curve mapping emotional trajectories.
- **Actionable Insights:** Dynamically calculated reflection notes based on rolling check-in averages.

### 📓 Private Journal (Express)
- **Reflective Prompts:** Guided chips for Gratitude, Energy Checks, and What I Need.
- **Encrypted & Confidential:** Stored securely for your eyes only with DPDP Act 2023 compliance.

### 🤖 Talk to Mitra — AI Companion (Express)
- **Always Available:** 24/7 empathetic conversational companion culturally tuned to Indian family dynamics.
- **Crisis Detection System:** Real-time safety filters linking directly to national **Tele-MANAS (14416)** and **Emergency 112**.

### 🌿 Guided Box Breathing & Care (Restore)
- **Interactive 4-4-4-4 Rhythm:** Smooth expanding/contracting halo visualizer (Inhale 4s, Hold 4s, Exhale 4s, Rest 4s).
- **Session Celebration:** Confetti celebration upon finishing centering sessions.
- **Immediate SOS Banner:** Prominent Tele-MANAS hotline banner with 1-click calling.

### 👩‍⚕️ Verified Counsellor Directory (Connect)
- **Expert Directory:** Profiles of verified clinical psychologists and family therapists with language proficiencies (Hindi, English, Tamil, Marathi, Bengali, etc.).
- **Confidential Booking:** Select date, time slot, and session format (Video, Audio, Chat).

### 👥 Supportive Community Circles
- **Safe Spaces:** Filter by groups (Students & Exams, Working Adults & Burnout, Caregivers & Elders).
- **Uplifting Interaction:** Anonymous posts and supportive reaction counters.

### 🔒 Privacy Sanctuary & Data Ownership (Me)
- **DPDP Act 2023 Compliant:** Strict zero-advertising, zero data-selling policy.
- **Instant Data Erasure:** 1-click permanent deletion of all local and cloud logs.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8, Lucide React, Canvas Confetti
- **Design System:** Custom glassmorphic CSS, Fraunces serif + Inter sans typography, warm sunset palette
- **Backend & Cloud:** Google Firebase (Authentication & Cloud Firestore)
- **PWA Capabilities:** Web App Manifest (`public/manifest.json`), responsive viewport styling

---

## 📁 Project Structure

```text
Sahara/
├── dist/                    # Compiled production build
├── public/
│   ├── sahara-logo.jpg      # Official Sahara project logo
│   └── manifest.json        # PWA Web App Manifest
├── src/
│   ├── assets/
│   │   └── sahara-logo.jpg  # Logo asset
│   ├── components/
│   │   ├── AuthModal.jsx     # Login, Sign up & Guest access modal
│   │   ├── BottomNav.jsx     # Mobile fixed navigation bar
│   │   ├── Community.jsx     # Supportive peer circles feed
│   │   ├── Dashboard.jsx     # Core dashboard with SVG mood chart
│   │   ├── Journal.jsx       # Private guided journal
│   │   ├── LandingPage.jsx   # Public landing page
│   │   ├── MitraChat.jsx     # Empathetic AI companion chat
│   │   ├── MoodTracker.jsx   # Mood check-in and dynamic insights
│   │   ├── ProfilePrivacy.jsx# Profile, DPDP compliance, & erase data
│   │   ├── RestoreCare.jsx   # Box breathing visualizer & counsellors
│   │   ├── Sidebar.jsx       # Desktop sticky sidebar
│   │   └── SplashScreen.jsx  # Logo animation splash transition
│   ├── context/
│   │   └── AuthContext.jsx   # Firebase Auth & Guest state provider
│   ├── lib/
│   │   └── firebase.js       # Firebase initialization from .env
│   ├── styles/
│   │   └── index.css         # Sahara glassmorphic design system
│   ├── App.jsx               # Master user journey coordinator
│   └── main.jsx              # React entry point
├── .env                     # Firebase API keys & config
├── .env.example             # Template for environment variables
├── firebase.json            # Firebase Hosting configuration (dist/)
├── package.json             # NPM dependencies & scripts
├── vite.config.js           # Vite build & dev configuration
└── README.md                # Project documentation
```

---

## 🔑 Environment Variables (`.env`)

Add your Firebase configuration to `.env` in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

### 4. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```
