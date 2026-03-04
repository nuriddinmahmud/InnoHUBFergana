import { api, isBackendEnabled } from "@/lib/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/api";

/**
 * Login with email/password.
 * Uses backend when VITE_API_URL is set, otherwise mock.
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (isBackendEnabled) {
    const res = await api.post<AuthResponse>("/auth/login", payload);
    const userWithToken = {
      ...res.user,
      token: res.token,
      name: res.user.name,
    };
    localStorage.setItem("user", JSON.stringify(userWithToken));
    return res;
  }

  // Mock: simulate delay, return fake user
  await new Promise((r) => setTimeout(r, 800));
  const mockUser = {
    id: "1",
    email: payload.email,
    name: "Sardor Karimov",
    token: "mock-token",
  };
  localStorage.setItem("user", JSON.stringify(mockUser));
  return {
    user: { id: mockUser.id, email: mockUser.email, name: mockUser.name },
    token: mockUser.token,
  };
}

/**
 * Register new user.
 * Uses backend when VITE_API_URL is set, otherwise mock.
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  if (isBackendEnabled) {
    const res = await api.post<AuthResponse>("/auth/register", payload);
    const userWithToken = {
      ...res.user,
      token: res.token,
      name: res.user.name,
    };
    localStorage.setItem("user", JSON.stringify(userWithToken));
    return res;
  }

  // Mock
  await new Promise((r) => setTimeout(r, 800));
  const fullName = `${payload.firstName} ${payload.lastName}`;
  const mockUser = {
    id: "1",
    email: payload.email,
    name: fullName,
    token: "mock-token",
  };
  localStorage.setItem("user", JSON.stringify(mockUser));
  return {
    user: { id: mockUser.id, email: mockUser.email, name: mockUser.name },
    token: mockUser.token,
  };
}
