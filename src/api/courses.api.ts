import api from "./client";
import { resolveCourseGradientClass } from "@/lib/course-gradient";
import type { CourseDetail, CourseSummary, CreateCoursePayload, TopicSummary } from "@/types/api";

function extractCourseItems(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload as Record<string, unknown>[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.items)) {
      return record.items as Record<string, unknown>[];
    }

    if (Array.isArray(record.data)) {
      return record.data as Record<string, unknown>[];
    }

    if (Array.isArray(record.courses)) {
      return record.courses as Record<string, unknown>[];
    }
  }

  return [];
}

function mapBackendLevelToUi(level?: string): CourseSummary["level"] {
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

function mapBackendStatusToUi(status?: string): CourseSummary["status"] {
  return (status ?? "").toUpperCase() === "PUBLISHED" ? "published" : "draft";
}

export function normalizeTopic(topic: Record<string, unknown>, courseId: string): TopicSummary {
  return {
    id: String(topic.id ?? topic.topicId ?? topic.topic_id ?? topic.lessonId ?? topic.lesson_id ?? ""),
    courseId,
    lessonNumber: Number(topic.lessonNumber ?? topic.lesson_number ?? topic.order ?? topic.position ?? 0),
    title: String(topic.title ?? topic.name ?? ""),
    videoId: String(topic.videoId ?? topic.video_id ?? topic.youtubeVideoId ?? topic.youtube_video_id ?? ""),
    duration: String(topic.duration ?? topic.durationLabel ?? topic.duration_label ?? "0:00"),
    content:
      typeof topic.content === "string"
        ? topic.content
        : typeof topic.contentMarkdown === "string"
          ? topic.contentMarkdown
          : typeof topic.content_markdown === "string"
            ? topic.content_markdown
            : undefined,
    status:
      typeof topic.status === "string" && (topic.status === "DRAFT" || topic.status === "PUBLISHED")
        ? topic.status
        : undefined,
    isPreview: typeof topic.isPreview === "boolean" ? topic.isPreview : typeof topic.is_preview === "boolean" ? topic.is_preview : undefined,
    completed: typeof topic.completed === "boolean" ? topic.completed : undefined,
    watchSeconds:
      typeof topic.watchSeconds === "number"
        ? topic.watchSeconds
        : typeof topic.watch_seconds === "number"
          ? topic.watch_seconds
          : undefined,
  };
}

export function normalizeCourse(course: Record<string, unknown>): CourseSummary {
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
  const gradient =
    typeof course.gradient === "string"
      ? course.gradient
      : undefined;

  return {
    id: String(course.id ?? course.slug ?? ""),
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
      gradient,
      gradientFrom,
      gradientTo,
    }),
    totalLessons: Number(course.totalLessons ?? course.total_lessons ?? course.topicsCount ?? course.topicCount ?? 0),
    level: mapBackendLevelToUi(typeof course.level === "string" ? course.level : undefined),
    duration: String(course.duration ?? course.durationLabel ?? course.duration_label ?? ""),
    status: mapBackendStatusToUi(typeof course.status === "string" ? course.status : undefined),
  };
}

export async function getCourses(): Promise<CourseSummary[]> {
  const requestUrl = `${api.defaults.baseURL ?? ""}/courses`;
  const { data } = await api.get<Record<string, unknown> | Array<Record<string, unknown>>>("/courses");
  const normalizedCourses = extractCourseItems(data).map(normalizeCourse);

  if (import.meta.env.DEV) {
    console.debug("[courses.api] GET", requestUrl);
    console.debug("[courses.api] raw response", data);
    console.debug("[courses.api] normalized courses", normalizedCourses);
  }

  return normalizedCourses;
}

export async function getCourseById(courseId: string): Promise<CourseDetail> {
  const { data } = await api.get<Record<string, unknown>>(`/courses/${courseId}`);
  const summary = normalizeCourse(data);
  const rawTopics = Array.isArray(data.topics) ? data.topics : Array.isArray(data.lessons) ? data.lessons : [];
  const topics = rawTopics.map((topic) => normalizeTopic(topic as Record<string, unknown>, summary.id));

  return {
    ...summary,
    totalLessons: summary.totalLessons || topics.length,
    topics,
    lessons: topics,
    isEnrolled: typeof data.isEnrolled === "boolean" ? data.isEnrolled : undefined,
  };
}

export async function createCourse(payload: CreateCoursePayload) {
  const { data } = await api.post<Record<string, unknown>>("/courses", payload);
  return getCourseById(String(data.id ?? data.slug ?? ""));
}
