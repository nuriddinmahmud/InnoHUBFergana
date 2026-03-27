import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const requiredFirebaseEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

const missingFirebaseEnv = requiredFirebaseEnv.filter((key) => !import.meta.env[key]?.trim());

if (missingFirebaseEnv.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingFirebaseEnv.join(", ")}`);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!.trim(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!.trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!.trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID!.trim(),
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});
