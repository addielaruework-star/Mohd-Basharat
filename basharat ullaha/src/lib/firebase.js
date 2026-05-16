import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "dummy",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "dummy",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

// Initialize persistence as soon as possible for admin session stability
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.error("Firebase auth persistence error:", err);
  });
}

export default app;
