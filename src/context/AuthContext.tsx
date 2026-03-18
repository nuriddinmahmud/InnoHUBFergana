import {
  GoogleAuthProvider,
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { auth, googleProvider } from "@/lib/firebase";

type StoredUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  photoURL?: string;
  token: string;
};

type AuthContextValue = {
  user: StoredUser | null;
  loading: boolean;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildStoredUser(firebaseUser: FirebaseUser, token: string): StoredUser {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "Foydalanuvchi",
    avatar: firebaseUser.photoURL ?? undefined,
    photoURL: firebaseUser.photoURL ?? undefined,
    token,
  };
}

function readStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
        return;
      }

      const freshToken = await firebaseUser.getIdToken();
      const storedUser = buildStoredUser(firebaseUser, freshToken);
      localStorage.setItem("user", JSON.stringify(storedUser));
      setUser(storedUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const firebaseUser = result.user;
    const freshToken = credential?.accessToken ?? (await firebaseUser.getIdToken());
    const storedUser = buildStoredUser(firebaseUser, freshToken);

    localStorage.setItem("user", JSON.stringify(storedUser));
    setUser(storedUser);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      token: user?.token ?? null,
      loginWithGoogle,
      logout,
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
