import axios from "axios";
import { FirebaseError } from "firebase/app";
import { getRedirectResult, signInWithPopup, signInWithRedirect, type UserCredential } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export type GoogleAuthProfile = {
  idToken: string;
  email: string;
  fullName: string;
  avatar?: string;
};

export type GoogleSignInResult =
  | {
      status: "success";
      profile: GoogleAuthProfile;
    }
  | {
      status: "redirect";
    };

async function mapGoogleCredential(result: UserCredential): Promise<GoogleAuthProfile> {
  const idToken = (await result.user.getIdToken()).trim();
  const email = result.user.email?.trim();

  if (!idToken) {
    throw new Error("Google idToken topilmadi.");
  }

  if (!email) {
    throw new Error("Google akkaunti uchun email topilmadi.");
  }

  const fullName = result.user.displayName?.trim() || email.split("@")[0];
  const avatar = result.user.photoURL?.trim();

  return {
    idToken,
    email,
    fullName,
    ...(avatar ? { avatar } : {}),
  };
}

function shouldFallbackToRedirect(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error && /Cross-Origin-Opener-Policy|window\.closed/i.test(error.message);
  }

  return (
    error.code === "auth/popup-blocked" ||
    error.code === "auth/web-storage-unsupported" ||
    (error.code === "auth/popup-closed-by-user" &&
      /Cross-Origin-Opener-Policy|window\.closed/i.test(error.message))
  );
}

function getGoogleAuthConfig() {
  if (!auth || !googleProvider) {
    throw new Error("Google orqali kirish hozircha sozlanmagan. Firebase sozlamalarini tekshiring.");
  }

  return {
    auth,
    googleProvider,
  };
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const firebaseAuth = getGoogleAuthConfig();

  try {
    const result = await signInWithPopup(firebaseAuth.auth, firebaseAuth.googleProvider);

    return {
      status: "success",
      profile: await mapGoogleCredential(result),
    };
  } catch (error) {
    if (shouldFallbackToRedirect(error)) {
      await signInWithRedirect(firebaseAuth.auth, firebaseAuth.googleProvider);
      return {
        status: "redirect",
      };
    }

    throw error;
  }
}

export async function getGoogleRedirectProfile(): Promise<GoogleAuthProfile | null> {
  if (!auth) {
    return null;
  }

  const result = await getRedirectResult(auth);

  if (!result) {
    return null;
  }

  return mapGoogleCredential(result);
}

export function getGoogleAuthErrorMessage(
  error: unknown,
  fallback = "Google orqali kirishda xato yuz berdi.",
) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/popup-blocked":
        return "Popup bloklandi, redirect orqali davom etiladi.";
      case "auth/popup-closed-by-user":
        return "Google kirish oynasi yopildi.";
      case "auth/cancelled-popup-request":
        return "Google kirish jarayoni bekor qilindi.";
      case "auth/web-storage-unsupported":
        return "Brauzer popup autentifikatsiyasini qo'llamadi, redirect ishlatiladi.";
      default:
        return error.message || fallback;
    }
  }

  if (axios.isAxiosError(error)) {
    return fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
