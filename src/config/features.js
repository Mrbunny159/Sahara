// Application Feature Flags and Configuration
// Guest login is modular and can be enabled or removed in future iterations by toggling ENABLE_GUEST_MODE.
export const FEATURE_FLAGS = {
  ENABLE_GUEST_MODE: true, // Set to false to completely disable/remove guest login UI & logic
  ENABLE_FIRESTORE_SYNC: true, // Synchronizes user data to Cloud Firestore when signed in
};

