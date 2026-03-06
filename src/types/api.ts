/**
 * Shared API types. Match these to your backend schema.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface EnrolledCourse extends Course {
  progress: number;
  done: number;
  total: number;
}

export interface CompilerResponse {
    output: string;
    error: string;
}
