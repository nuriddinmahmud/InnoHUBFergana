import api from "./client";
import { normalizeUser, saveAuthSession } from "@/lib/auth";
import type { AuthResponse, FirebaseAuthPayload, LoginPayload, RegisterPayload, UserProfile } from "@/types/api";

export function normalizeAuthResponse(data: Record<string, unknown>): AuthResponse {
  const userPayload =
    (data.user as Record<string, unknown> | undefined) ??
    (data.data as Record<string, unknown> | undefined) ??
    data;

  return {
    user: normalizeUser(userPayload),
    accessToken:
      typeof data.accessToken === "string"
        ? data.accessToken
        : typeof data.token === "string"
          ? data.token
          : undefined,
    token:
      typeof data.token === "string"
        ? data.token
        : typeof data.accessToken === "string"
          ? data.accessToken
          : undefined,
    refreshToken: typeof data.refreshToken === "string" ? data.refreshToken : undefined,
  };
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<Record<string, unknown>>("/auth/login", payload);
  const session = normalizeAuthResponse(data);
  saveAuthSession(session);
  return session;
}

export async function register(payload: RegisterPayload) {
  const registerPayload = {
    email: payload.email.trim(),
    password: payload.password,
    fullName: payload.fullName.trim(),
    ...(payload.avatarUrl ? { avatarUrl: payload.avatarUrl.trim() } : {}),
  };

  const { data } = await api.post<Record<string, unknown>>("/auth/register", registerPayload);
  const session = normalizeAuthResponse(data);

  if (session.accessToken ?? session.token) {
    saveAuthSession(session);
    return session;
  }

  return login({
    email: payload.email,
    password: payload.password,
  });
}

export async function loginWithFirebase(payload: FirebaseAuthPayload) {
  const firebasePayload = {
    idToken: payload.idToken.trim(),
    email: payload.email.trim(),
    fullName: payload.fullName.trim(),
    ...(payload.avatar ? { avatar: payload.avatar.trim() } : {}),
  };

  const { data } = await api.post<Record<string, unknown>>("/auth/firebase", firebasePayload);
  const session = normalizeAuthResponse({
    ...data,
    user: {
      email: firebasePayload.email,
      fullName: firebasePayload.fullName,
      ...(firebasePayload.avatar
        ? {
            avatar: firebasePayload.avatar,
            avatarUrl: firebasePayload.avatar,
            photoURL: firebasePayload.avatar,
          }
        : {}),
      ...((data.user as Record<string, unknown> | undefined) ?? {}),
    },
  });

  if (!(session.accessToken ?? session.token)) {
    throw new Error("Firebase autentifikatsiyasidan keyin JWT qaytmadi.");
  }

  saveAuthSession(session);
  return session;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await api.get<Record<string, unknown>>("/auth/me");
  return normalizeUser((data.user as Record<string, unknown> | undefined) ?? data);
}

export async function logout() {
  await api.post("/auth/logout");
}
