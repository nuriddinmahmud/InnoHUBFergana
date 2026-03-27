import api from "./client";
import { getCourseById, normalizeCourse, normalizeTopic } from "./courses.api";
import type { CourseDetail, EnrolledCourse, EnrollmentSummary } from "@/types/api";

function normalizeEnrollment(item: Record<string, unknown>): EnrollmentSummary {
  return {
    id: typeof item.id === "string" ? item.id : undefined,
    courseId: String(item.courseId ?? (item.course as Record<string, unknown> | undefined)?.id ?? ""),
    enrolledAt: typeof item.enrolledAt === "string" ? item.enrolledAt : undefined,
    lastTopicId:
      typeof item.lastTopicId === "string"
        ? item.lastTopicId
        : typeof (item.lastTopic as Record<string, unknown> | undefined)?.id === "string"
          ? String((item.lastTopic as Record<string, unknown>).id)
          : undefined,
    completedTopicsCount: Number(item.completedTopicsCount ?? item.completedCount ?? 0),
    progressPercent: Number(item.progressPercent ?? 0),
    status: typeof item.status === "string" ? item.status : undefined,
  };
}

function normalizeEnrolledCourse(item: Record<string, unknown>): EnrolledCourse {
  const course = (item.course as Record<string, unknown> | undefined) ?? item;

  return {
    id: String(course.id ?? item.courseId ?? ""),
    title: String(course.title ?? ""),
    description: String(course.description ?? ""),
    icon: typeof course.icon === "string" ? course.icon : undefined,
    image: typeof course.image === "string" ? course.image : typeof course.imageUrl === "string" ? course.imageUrl : undefined,
    gradient: typeof course.gradient === "string" ? course.gradient : undefined,
    totalLessons: Number(course.totalLessons ?? course.topicsCount ?? 0),
    level: (course.level as EnrolledCourse["level"]) ?? "Boshlang'ich",
    duration: String(course.duration ?? course.durationLabel ?? ""),
    status: (course.status as EnrolledCourse["status"]) ?? undefined,
    enrollmentId: typeof item.id === "string" ? item.id : undefined,
    enrolledAt: typeof item.enrolledAt === "string" ? item.enrolledAt : undefined,
    lastTopicId:
      typeof item.lastTopicId === "string"
        ? item.lastTopicId
        : typeof (item.lastTopic as Record<string, unknown> | undefined)?.id === "string"
          ? String((item.lastTopic as Record<string, unknown>).id)
          : undefined,
    completedTopicsCount: Number(item.completedTopicsCount ?? item.completedCount ?? 0),
    progressPercent: Number(item.progressPercent ?? 0),
  };
}

export async function enrollInCourse(courseId: string) {
  const { data } = await api.post<Record<string, unknown>>("/enrollments", { courseId });
  return normalizeEnrollment(data);
}

export async function getMyCourses(): Promise<EnrolledCourse[]> {
  const { data } = await api.get<Array<Record<string, unknown>>>("/enrollments/my-courses");
  return data.map(normalizeEnrolledCourse);
}

export async function getMyCourseById(courseId: string): Promise<CourseDetail & { enrollment?: EnrollmentSummary }> {
  const { data } = await api.get<Record<string, unknown>>(`/enrollments/my-courses/${courseId}`);
  const courseRecord = (data.course as Record<string, unknown> | undefined) ?? data;
  const rawTopics = Array.isArray(courseRecord.topics)
    ? courseRecord.topics
    : Array.isArray(courseRecord.lessons)
      ? courseRecord.lessons
      : [];
  const course =
    rawTopics.length > 0
      ? {
          ...normalizeCourse(courseRecord),
          topics: rawTopics.map((topic) => normalizeTopic(topic as Record<string, unknown>, String(courseRecord.id ?? courseId))),
          lessons: rawTopics.map((topic) => normalizeTopic(topic as Record<string, unknown>, String(courseRecord.id ?? courseId))),
        }
      : await getCourseById(String(courseRecord.id ?? courseId));

  return {
    ...course,
    isEnrolled: true,
    enrollment: normalizeEnrollment(data),
  };
}
