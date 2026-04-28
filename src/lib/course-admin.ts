import type {
  BackendCourseLevel,
  BackendCourseStatus,
  CourseFormValues,
  CourseLevel,
  CreateCoursePayload,
  UpdateCoursePayload,
} from "@/types/api";

export const COURSE_DEFAULT_ICON = "book-open";
export const COURSE_DEFAULT_GRADIENT_FROM = "#0F172A";
export const COURSE_DEFAULT_GRADIENT_TO = "#2563EB";
export const COURSE_DEFAULT_TOTAL_LESSONS = 0;
export const COURSE_DEFAULT_SORT_ORDER = 0;

export function slugifyCourseTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function mapUiLevelToBackend(level: CourseLevel): BackendCourseLevel {
  switch (level) {
    case "Boshlang'ich":
      return "BEGINNER";
    case "O'rta":
      return "INTERMEDIATE";
    case "Yuqori":
      return "ADVANCED";
    default:
      return "BEGINNER";
  }
}

export function mapUiStatusToBackend(status: "Qoralama" | "Nashr etilgan"): BackendCourseStatus {
  return status === "Nashr etilgan" ? "PUBLISHED" : "DRAFT";
}

export function validateCourseForm(form: CourseFormValues) {
  const title = form.title.trim();
  const description = form.description.trim();
  const durationLabel = form.durationLabel.trim();
  const imageUrl = form.imageUrl.trim();

  if (!title) {
    return "Kurs nomi majburiy.";
  }

  if (title.length > 160) {
    return "Kurs nomi 160 belgidan oshmasligi kerak.";
  }

  if (!description) {
    return "Kurs tavsifi majburiy.";
  }

  if (!durationLabel) {
    return "Davomiylik matni majburiy.";
  }

  if (durationLabel.length > 64) {
    return "Davomiylik matni 64 belgidan oshmasligi kerak.";
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      return "Muqova rasmi uchun to'g'ri URL kiriting.";
    }
  }

  return "";
}

export function buildCreateCoursePayload(form: CourseFormValues, createdBy: string): CreateCoursePayload {
  const title = form.title.trim();
  const slug = slugifyCourseTitle(title);

  const payload: CreateCoursePayload = {
    title,
    slug,
    description: form.description.trim(),
    icon: COURSE_DEFAULT_ICON,
    gradientFrom: COURSE_DEFAULT_GRADIENT_FROM,
    gradientTo: COURSE_DEFAULT_GRADIENT_TO,
    level: mapUiLevelToBackend(form.level),
    durationLabel: form.durationLabel.trim(),
    totalLessons: COURSE_DEFAULT_TOTAL_LESSONS,
    status: mapUiStatusToBackend(form.status),
    sortOrder: COURSE_DEFAULT_SORT_ORDER,
    createdBy,
  };

  const imageUrl = form.imageUrl.trim();
  if (imageUrl) {
    payload.imageUrl = imageUrl;
  }

  return payload;
}

export function buildUpdateCoursePayload(form: CourseFormValues): UpdateCoursePayload {
  const title = form.title.trim();
  const payload: UpdateCoursePayload = {
    title,
    slug: slugifyCourseTitle(title),
    description: form.description.trim(),
    icon: COURSE_DEFAULT_ICON,
    gradientFrom: COURSE_DEFAULT_GRADIENT_FROM,
    gradientTo: COURSE_DEFAULT_GRADIENT_TO,
    level: mapUiLevelToBackend(form.level),
    durationLabel: form.durationLabel.trim(),
    status: mapUiStatusToBackend(form.status),
  };

  const imageUrl = form.imageUrl.trim();
  if (imageUrl) {
    payload.imageUrl = imageUrl;
  }

  return payload;
}
