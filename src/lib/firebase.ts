import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const requiredFirebaseEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let firebaseInitializationError: Error | null = null;

const getFirebaseConfig = (): FirebaseOptions => {
  const missingFirebaseEnv = requiredFirebaseEnv.filter((key) => !import.meta.env[key]?.trim());

  if (missingFirebaseEnv.length > 0) {
    throw new Error(`Missing Firebase environment variables: ${missingFirebaseEnv.join(", ")}`);
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY!.trim(),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!.trim(),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!.trim(),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!.trim(),
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!.trim(),
    appId: import.meta.env.VITE_FIREBASE_APP_ID!.trim(),
  };
};

try {
  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  auth = getAuth(firebaseApp);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
} catch (error) {
  firebaseInitializationError = error instanceof Error ? error : new Error("Firebase initialization failed.");
  console.warn("Firebase initialization failed. Google authentication is disabled.", error);
}

export { auth, firebaseApp, firebaseInitializationError, googleProvider };
export const isFirebaseAuthEnabled = Boolean(auth && googleProvider);
