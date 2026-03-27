import type { SyntheticEvent } from "react";
import type { AuthResponse, StoredAuthUser, UserProfile, UserRole } from "@/types/api";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";
export const DEFAULT_AVATAR_SRC = "/default-avatar.png";
export const DEFAULT_AVATAR_JPG_SRC = "/default-avatar.jpg";
export const UI_AVATAR_FALLBACK_SRC = "https://ui-avatars.com/api/?name=User";

export function normalizeRole(role?: string | null): UserRole {
  switch ((role ?? "").toUpperCase()) {
    case "ADMIN":
    case "admin":
      return "ADMIN";
    case "SUPER_ADMIN":
    case "super_admin":
      return "SUPER_ADMIN";
    default:
      return "STUDENT";
  }
}

export function normalizeUser(input: Partial<UserProfile> | Record<string, unknown>): UserProfile {
  const user = input as Partial<UserProfile> & Record<string, unknown>;
  const firstName = typeof user.firstName === "string" ? user.firstName : "";
  const lastName = typeof user.lastName === "string" ? user.lastName : "";
  const fallbackName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: String(user.id ?? user.userId ?? ""),
    email: String(user.email ?? ""),
    name:
      String(user.name ?? user.fullName ?? fallbackName ?? "").trim() ||
      String(user.email ?? "User").split("@")[0],
    avatarUrl: typeof user.avatarUrl === "string" ? user.avatarUrl : undefined,
    avatar: typeof user.avatar === "string" ? user.avatar : typeof user.avatarUrl === "string" ? user.avatarUrl : undefined,
    photoURL: typeof user.photoURL === "string" ? user.photoURL : undefined,
    role: normalizeRole(typeof user.role === "string" ? user.role : undefined),
    status: typeof user.status === "string" ? user.status : undefined,
    createdAt: typeof user.createdAt === "string" ? user.createdAt : undefined,
  };
}

export function saveAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveUser(user: UserProfile) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return normalizeUser(JSON.parse(raw) as StoredAuthUser);
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthResponse) {
  const token = session.accessToken ?? session.token;
  if (token) {
    saveAccessToken(token);
  }
  saveUser(normalizeUser(session.user));
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasStoredAuth() {
  return Boolean(getAccessToken());
}

export function getAvatarSrc(avatar?: string | null, avatarUrl?: string | null) {
  const candidate = avatar?.trim() || avatarUrl?.trim() || "";
  return candidate || UI_AVATAR_FALLBACK_SRC;
}

export function handleAvatarError(event: SyntheticEvent<HTMLImageElement, Event>) {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === "ui-avatar") {
    target.dataset.fallbackApplied = "local-default";
    target.src = DEFAULT_AVATAR_JPG_SRC;
    return;
  }

  if (target.dataset.fallbackApplied === "local-default") {
    return;
  }

  target.dataset.fallbackApplied = "ui-avatar";
  target.src = UI_AVATAR_FALLBACK_SRC;
}
