import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from 'firebase/auth';

// Firebase configuration read from Vite environment variables (prefixed with VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Check if the Firebase credentials have been configured with real values.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
      firebaseConfig.projectId &&
      firebaseConfig.projectId !== 'YOUR_FIREBASE_PROJECT_ID'
  );
};

// Fallback configuration to prevent initializeApp from crashing when environment variables are not yet populated.
const effectiveConfig = isFirebaseConfigured()
  ? firebaseConfig
  : {
      apiKey: firebaseConfig.apiKey || 'AIzaSyPotOfStudyDummyKeyForDevelopment123',
      authDomain: firebaseConfig.authDomain || 'pot-of-study.firebaseapp.com',
      projectId: firebaseConfig.projectId || 'pot-of-study',
      storageBucket: firebaseConfig.storageBucket || 'pot-of-study.appspot.com',
      messagingSenderId: firebaseConfig.messagingSenderId || '123456789012',
      appId: firebaseConfig.appId || '1:123456789012:web:potofstudydemo123',
    };

export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(effectiveConfig);

export const auth: Auth = getAuth(app);

// Enforce browser local persistence (persists user session across page reloads and browser restarts)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('Firebase persistence initialization note:', error);
  });
}
