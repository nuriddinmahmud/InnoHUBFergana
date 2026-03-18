import { api } from "@/lib/api";

// 1. Ma'lumotlar turlari (Types)
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Register uchun yuboriladigan ma'lumotlar turi
export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

// Login uchun yuboriladigan ma'lumotlar turi
export interface LoginCredentials {
  email: string;
  password: string;
}

// 2. API Funksiyalari

// Ro'yxatdan o'tish
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const data = await api.post<AuthResponse>("/auth/register", userData);
  
  if (data.access_token) {
    localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.access_token }));
  }
  
  return data;
};

// Tizimga kirish
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const data = await api.post<AuthResponse>("/auth/login", credentials);
  
  if (data.access_token) {
    localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.access_token }));
  }
  
  return data;
};

// Profil ma'lumotlarini olish
export const getProfile = async (): Promise<User> => {
  return api.get<User>("/auth/profile");
};

// Tizimdan chiqish
export const logout = (): void => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};