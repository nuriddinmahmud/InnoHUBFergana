import { api, isBackendEnabled } from "@/lib/api";
import type { Course, EnrolledCourse } from "@/types/api";

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Web Development",
    description: "Learn HTML, CSS, and JavaScript to build modern websites",
    icon: "🌐",
    level: "Beginner",
  },
  {
    id: "2",
    title: "React Fundamentals",
    description: "Master React components, hooks, and state management",
    icon: "⚛️",
    level: "Intermediate",
  },
  {
    id: "3",
    title: "Advanced TypeScript",
    description: "Deep dive into TypeScript types, generics, and advanced patterns",
    icon: "📘",
    level: "Advanced",
  },
];

const MOCK_ENROLLED: EnrolledCourse[] = [
  { id: "1", title: "HTML", description: "Web Development", icon: "🌐", level: "Beginner", progress: 90, done: 27, total: 30 },
  { id: "2", title: "JavaScript", description: "Programming basics", icon: "⚡", level: "Intermediate", progress: 45, done: 14, total: 30 },
  { id: "3", title: "Python", description: "Python fundamentals", icon: "🐍", level: "Beginner", progress: 10, done: 3, total: 30 },
];

/**
 * Fetch all courses.
 * Uses backend when available, otherwise returns mock data.
 */
export async function fetchCourses(): Promise<Course[]> {
  if (isBackendEnabled) {
    return api.get<Course[]>("/courses");
  }
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_COURSES;
}

/**
 * Fetch user's enrolled courses (for Dashboard).
 * Uses backend when available, otherwise returns mock data.
 */
export async function fetchEnrolledCourses(): Promise<EnrolledCourse[]> {
  if (isBackendEnabled) {
    return api.get<EnrolledCourse[]>("/users/me/courses");
  }
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_ENROLLED;
}
