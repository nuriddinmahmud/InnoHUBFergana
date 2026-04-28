import api from "./client";
import { normalizeTopic } from "./courses.api";
import { resolveCourseGradientClass } from "@/lib/course-gradient";
import type {
  AdminDashboardStats,
  AdminUser,
  CourseDetail,
  CourseLevel,
  CourseStatus,
  CourseSummary,
  CreateCoursePayload,
  TopicMutationPayload,
  TopicSummary,
  UpdateCoursePayload,
} from "@/types/api";

function asRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  return payload as Record<string, unknown>;
}

function extractItems<T>(payload: unknown, keys: string[] = []): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const record = asRecord(payload);
  if (record) {
    for (const key of ["items", "data", ...keys]) {
      if (Array.isArray(record[key])) {
        return record[key] as T[];
      }
    }
  }

  return [];
}

function toNumber(value: unknown, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function toStringValue(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function clampPercent(value: unknown) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))));
}

function buildInitials(value: string) {
  const initials = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "IN";
}

function mapBackendLevelToUi(level?: string): CourseLevel {
  switch ((level ?? "").toUpperCase()) {
    case "BEGINNER":
      return "Boshlang'ich";
    case "INTERMEDIATE":
      return "O'rta";
    case "ADVANCED":
      return "Yuqori";
    default:
      return "Boshlang'ich";
  }
}

function mapBackendStatusToUi(status?: string): CourseStatus {
  return (status ?? "").toUpperCase() === "PUBLISHED" ? "published" : "draft";
}

function mapAdminCourseStatus(status: unknown): "Nashr etilgan" | "Qoralama" {
  const normalizedStatus = toStringValue(status).toUpperCase();
  return normalizedStatus === "PUBLISHED" || normalizedStatus === "NASHR ETILGAN" ? "Nashr etilgan" : "Qoralama";
}

function mapAdminUserStatus(status: unknown): AdminUser["status"] {
  switch (toStringValue(status).toLowerCase()) {
    case "active":
    case "faol":
      return "Faol";
    case "blocked":
    case "bloklangan":
      return "Bloklangan";
    case "pending":
    case "kutilmoqda":
      return "Kutilmoqda";
    case "review":
    case "reviewing":
    case "tekshirilmoqda":
      return "Tekshirilmoqda";
    default:
      return "Faol";
  }
}

function mapAdminUserStatusToBackend(status: AdminUser["status"]) {
  switch (status) {
    case "Bloklangan":
      return "blocked";
    case "Kutilmoqda":
      return "pending";
    case "Tekshirilmoqda":
      return "reviewing";
    case "Faol":
    default:
      return "active";
  }
}

function normalizeCourseSummary(course: Record<string, unknown>): CourseSummary {
  const gradientFrom =
    typeof course.gradientFrom === "string"
      ? course.gradientFrom
      : typeof course.gradient_from === "string"
        ? course.gradient_from
        : "";
  const gradientTo =
    typeof course.gradientTo === "string"
      ? course.gradientTo
      : typeof course.gradient_to === "string"
        ? course.gradient_to
        : "";

  return {
    id: String(course.id ?? ""),
    title: String(course.title ?? course.name ?? ""),
    description: String(course.description ?? ""),
    icon: typeof course.icon === "string" ? course.icon : undefined,
    image:
      typeof course.image === "string"
        ? course.image
        : typeof course.imageUrl === "string"
          ? course.imageUrl
          : typeof course.image_url === "string"
            ? course.image_url
          : undefined,
    gradient: resolveCourseGradientClass({
      gradient: typeof course.gradient === "string" ? course.gradient : undefined,
      gradientFrom,
      gradientTo,
    }),
    totalLessons: Number(course.totalLessons ?? course.total_lessons ?? course.topicCount ?? course.topicsCount ?? 0),
    level: mapBackendLevelToUi(typeof course.level === "string" ? course.level : undefined),
    duration: String(course.duration ?? course.durationLabel ?? course.duration_label ?? ""),
    status: mapBackendStatusToUi(typeof course.status === "string" ? course.status : undefined),
  };
}

function normalizeAdminUser(user: Record<string, unknown>): AdminUser {
  const name = toStringValue(user.name ?? user.fullName ?? user.full_name, "User");
  const avatarValue = toStringValue(user.avatar, "");

  return {
    id: toStringValue(user.id ?? user.userId),
    name,
    email: toStringValue(user.email),
    avatar: avatarValue && !avatarValue.includes("://") ? avatarValue : buildInitials(name),
    joinedAt: toStringValue(user.joinedAt ?? user.createdAt ?? user.created_at, "-"),
    status: mapAdminUserStatus(user.status),
  };
}

function normalizeTopicSummary(topic: Record<string, unknown>): TopicSummary {
  const courseId = toStringValue(topic.courseId ?? topic.course_id);
  return normalizeTopic(topic, courseId);
}

function normalizeRecentUser(user: Record<string, unknown>) {
  return {
    id: toStringValue(user.id ?? user.userId),
    name: toStringValue(user.name ?? user.fullName ?? user.full_name, "Foydalanuvchi"),
    email: toStringValue(user.email),
    joinedAt: toStringValue(user.joinedAt ?? user.createdAt ?? user.created_at, "-"),
    status: toStringValue(user.status, "Faol"),
  };
}

function normalizeCourseStatus(course: Record<string, unknown>) {
  return {
    id: toStringValue(course.id ?? course.courseId),
    name: toStringValue(course.name ?? course.title, "Kurs"),
    status: mapAdminCourseStatus(course.status),
    topicCount: toNumber(course.topicCount ?? course.topicsCount ?? course.totalLessons ?? course.totalTopics),
  };
}

function normalizeUserSeriesPoint(point: Record<string, unknown>) {
  return {
    day: toStringValue(point.day ?? point.label ?? point.date, "-"),
    users: toNumber(point.users ?? point.count ?? point.total),
  };
}

function normalizeCourseSeriesPoint(point: Record<string, unknown>) {
  const name = toStringValue(point.name ?? point.title, "Kurs");

  return {
    name,
    progress: clampPercent(
      point.progress ??
        point.averageCompletionPercent ??
        point.average_completion_percent ??
        point.completionPercent ??
        point.completion_percent,
    ),
    started: toNumber(point.started ?? point.startedUsersCount ?? point.started_users_count),
    icon: toStringValue(point.icon, buildInitials(name)),
  };
}

function normalizeAdminStats(payload: unknown): AdminDashboardStats {
  const record = asRecord(payload) ?? {};
  const totals = asRecord(record.totals) ?? record;
  const charts = asRecord(record.charts) ?? asRecord(record.series) ?? {};

  return {
    totals: {
      users: toNumber(totals.users ?? totals.usersCount ?? totals.users_count),
      courses: toNumber(totals.courses ?? totals.coursesCount ?? totals.courses_count),
      topics: toNumber(totals.topics ?? totals.topicsCount ?? totals.topics_count),
      todayUsers: toNumber(
        totals.todayUsers ?? totals.todayUsersCount ?? totals.today_users ?? totals.today_users_count,
      ),
    },
    recentUsers: extractItems<Record<string, unknown>>(
      record.recentUsers ?? record.latestUsers ?? record.users ?? record.recent_users ?? record,
      ["recentUsers", "latestUsers", "users", "recent_users"],
    ).map(normalizeRecentUser),
    courseStatuses: extractItems<Record<string, unknown>>(
      record.courseStatuses ?? record.courseStatusList ?? record.course_statuses ?? record,
      ["courseStatuses", "courseStatusList", "course_statuses"],
    ).map(normalizeCourseStatus),
    userSeries: extractItems<Record<string, unknown>>(
      charts.userSeries ?? charts.users ?? record.userSeries ?? record.usersSeries ?? record.user_series ?? charts,
      ["userSeries", "usersSeries", "user_series", "users"],
    ).map(normalizeUserSeriesPoint),
    courseSeries: extractItems<Record<string, unknown>>(
      charts.courseSeries ??
        charts.courses ??
        record.courseSeries ??
        record.courseStats ??
        record.course_statistics ??
        record,
      ["courseSeries", "courseStats", "course_statistics", "courses"],
    ).map(normalizeCourseSeriesPoint),
  };
}

export async function fetchAdminStats(): Promise<AdminDashboardStats> {
  const { data } = await api.get<Record<string, unknown>>("/admin/stats");
  return normalizeAdminStats(data);
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[] | { items?: AdminUser[]; data?: AdminUser[]; users?: AdminUser[] }>(
    "/admin/users",
  );
  return extractItems<Record<string, unknown>>(data, ["users"]).map(normalizeAdminUser);
}

export async function updateAdminUserStatus(userId: string, status: AdminUser["status"]): Promise<AdminUser> {
  const { data } = await api.patch<Record<string, unknown>>(`/admin/users/${userId}`, {
    status: mapAdminUserStatusToBackend(status),
  });
  const record = asRecord(data) ?? {};
  const normalizedPayload = asRecord(record.user) ?? record;
  return normalizeAdminUser(normalizedPayload);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

export async function fetchAdminCourses(): Promise<CourseSummary[]> {
  const { data } = await api.get<CourseSummary[] | { items?: CourseSummary[]; data?: CourseSummary[]; courses?: CourseSummary[] }>(
    "/courses",
  );
  return extractItems<Record<string, unknown>>(data, ["courses"]).map(normalizeCourseSummary);
}

export async function fetchAdminTopics(courseId?: string): Promise<TopicSummary[]> {
  const { data } = await api.get<TopicSummary[] | { items?: TopicSummary[]; data?: TopicSummary[]; topics?: TopicSummary[] }>(
    "/topics",
  );
  const topics = extractItems<Record<string, unknown>>(data, ["topics"]).map(normalizeTopicSummary);
  return courseId ? topics.filter((topic) => topic.courseId === courseId) : topics;
}

export async function createCourse(payload: CreateCoursePayload): Promise<CourseDetail> {
  const { data } = await api.post<CourseDetail>("/courses", payload);
  return data;
}

export async function updateCourse(courseId: string, payload: UpdateCoursePayload): Promise<CourseDetail> {
  const { data } = await api.patch<CourseDetail>(`/courses/${courseId}`, payload);
  return data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await api.delete(`/courses/${courseId}`);
}

export async function createTopic(payload: TopicMutationPayload): Promise<TopicSummary> {
  const { data } = await api.post<Record<string, unknown>>("/topics", payload);
  return normalizeTopicSummary(data);
}

export async function updateTopic(topicId: string, payload: TopicMutationPayload): Promise<TopicSummary> {
  const { data } = await api.patch<Record<string, unknown>>(`/topics/${topicId}`, payload);
  return normalizeTopicSummary(data);
}

export async function deleteTopic(topicId: string): Promise<void> {
  await api.delete(`/topics/${topicId}`);
}
