import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getCurrentUser,
  login as loginRequest,
  loginWithFirebase as loginWithFirebaseRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/api/auth.api";
import { clearAuth, getStoredUser, hasStoredAuth, saveUser } from "@/lib/auth";
import type { FirebaseAuthPayload, LoginPayload, RegisterPayload, UserProfile } from "@/types/api";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<UserProfile>;
  loginWithFirebase: (payload: FirebaseAuthPayload) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => Promise<void>;
  loadUser: () => Promise<UserProfile | null>;
  refreshProfile: () => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (!hasStoredAuth()) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getCurrentUser();
      saveUser(profile);
      setUser(profile);
      return profile;
    } catch {
      clearAuth();
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    void (async () => {
      await loadUser();
      setLoading(false);
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    const session = await loginRequest(payload);
    setUser(session.user);
    return session.user;
  };

  const loginWithFirebase = async (payload: FirebaseAuthPayload) => {
    const session = await loginWithFirebaseRequest(payload);
    setUser(session.user);
    return session.user;
  };

  const register = async (payload: RegisterPayload) => {
    const session = await registerRequest(payload);
    setUser(session.user);
    return session.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      loginWithFirebase,
      register,
      logout,
      loadUser,
      refreshProfile: loadUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
