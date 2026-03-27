import api from "./client";
import type { LessonProgressPayload, LessonProgressResponse } from "@/types/api";

function normalizeProgress(topicId: string, data: Record<string, unknown>): LessonProgressResponse {
  return {
    topicId,
    watchSeconds: Number(data.watchSeconds ?? data.totalWatchSeconds ?? 0),
    completed: Boolean(data.completed ?? data.isCompleted),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}

export async function trackLessonProgress(topicId: string, payload: LessonProgressPayload) {
  const { data } = await api.post<Record<string, unknown>>(`/progress/lessons/${topicId}`, {
    watchSeconds: Math.abs(payload.watchSeconds),
  });
  return normalizeProgress(topicId, data);
}

export async function completeLesson(topicId: string) {
  const { data } = await api.post<Record<string, unknown>>(`/progress/lessons/${topicId}/complete`);
  return normalizeProgress(topicId, data);
}
