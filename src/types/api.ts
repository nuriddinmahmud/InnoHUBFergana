export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "active" | "blocked" | "pending";
export type CourseLevel = "Boshlang'ich" | "O'rta" | "Yuqori";
export type CourseStatus = "draft" | "published";
export type BackendCourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type BackendCourseStatus = "DRAFT" | "PUBLISHED";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  photoURL?: string;
  role: UserRole;
  status?: UserStatus | string;
  createdAt?: string;
}

export interface StoredAuthUser extends UserProfile {
  token?: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
}

export interface FirebaseAuthPayload {
  idToken: string;
  email: string;
  fullName: string;
  avatar?: string;
}

export interface TopicSummary {
  id: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  videoId: string;
  duration: string;
  content?: string;
  status?: "DRAFT" | "PUBLISHED";
  isPreview?: boolean;
  completed?: boolean;
  watchSeconds?: number;
}

export interface TopicMutationPayload {
  courseId: string;
  lessonNumber: number;
  title: string;
  videoId: string;
  durationLabel: string;
  contentMarkdown: string;
  contentHtml: string;
  isPreview: boolean;
  status: "DRAFT" | "PUBLISHED";
}

export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  gradient?: string;
  totalLessons: number;
  level: CourseLevel;
  duration: string;
  status?: CourseStatus;
}

export interface CourseDetail extends CourseSummary {
  topics: TopicSummary[];
  lessons?: TopicSummary[];
  isEnrolled?: boolean;
}

export interface CreateCoursePayload {
  title: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
  gradientFrom: string;
  gradientTo: string;
  level: BackendCourseLevel;
  durationLabel: string;
  totalLessons: number;
  status: BackendCourseStatus;
  sortOrder: number;
  createdBy: string;
}

export interface CourseFormValues {
  title: string;
  description: string;
  level: CourseLevel;
  durationLabel: string;
  imageUrl: string;
  status: "Qoralama" | "Nashr etilgan";
}

export interface EnrollmentSummary {
  id?: string;
  courseId: string;
  enrolledAt?: string;
  lastTopicId?: string;
  completedTopicsCount: number;
  progressPercent: number;
  status?: string;
  course?: CourseSummary;
}

export interface EnrolledCourse extends CourseSummary {
  enrollmentId?: string;
  enrolledAt?: string;
  lastTopicId?: string;
  completedTopicsCount: number;
  progressPercent: number;
}

export interface LessonProgressPayload {
  watchSeconds: number;
}

export interface LessonProgressResponse {
  topicId: string;
  watchSeconds: number;
  completed: boolean;
  updatedAt?: string;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number[];
  lastLessonId: number;
  completedCount: number;
  progressPercent: number;
}

export interface ProgressOverview {
  items: CourseProgress[];
  totalCompletedLessons: number;
  totalMinutes: number;
  totalHoursLabel: string;
}

export interface AdminDashboardStats {
  totals: {
    users: number;
    courses: number;
    topics: number;
    todayUsers: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    status: string;
  }>;
  courseStatuses: Array<{
    id: string;
    name: string;
    status: "Nashr etilgan" | "Qoralama";
    topicCount: number;
  }>;
  userSeries: Array<{
    day: string;
    users: number;
  }>;
  courseSeries: Array<{
    name: string;
    progress: number;
    started: number;
    icon: string;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  status: "Faol" | "Bloklangan" | "Kutilmoqda" | "Tekshirilmoqda";
}

export interface CompilerResponse {
  output: string;
  error: string;
}
