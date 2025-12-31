import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA7b_qt0wkdMKHKTg28hjsPXQJLlZIi31I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pgconnect-9bc51.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pgconnect-9bc51",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pgconnect-9bc51.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "667002551443",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:667002551443:web:22bb7244b4fb795a22a166",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XY0QK390D7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in production
let analytics;
if (typeof window !== 'undefined' && !import.meta.env.DEV) {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
