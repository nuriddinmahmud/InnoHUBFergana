import { useCallback, useEffect, useMemo, useState } from "react";
import { courses } from "@/data/courses";

type CourseProgress = {
  completedLessons: number[];
  lastLessonId: number;
};

const getStorageKey = (courseId: string) => `innohub_progress_${courseId}`;

export const getStoredCourseProgress = (courseId: string): CourseProgress => {
  try {
    const raw = localStorage.getItem(getStorageKey(courseId));
    if (!raw) {
      return { completedLessons: [], lastLessonId: 1 };
    }

    const parsed = JSON.parse(raw) as Partial<CourseProgress>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons.filter((lessonId): lessonId is number => typeof lessonId === "number")
        : [],
      lastLessonId: typeof parsed.lastLessonId === "number" ? parsed.lastLessonId : 1,
    };
  } catch {
    return { completedLessons: [], lastLessonId: 1 };
  }
};

export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgress>(() => getStoredCourseProgress(courseId));

  useEffect(() => {
    setProgress(getStoredCourseProgress(courseId));
  }, [courseId]);

  const saveProgress = useCallback(
    (nextProgress: CourseProgress) => {
      localStorage.setItem(getStorageKey(courseId), JSON.stringify(nextProgress));
      setProgress(nextProgress);
    },
    [courseId],
  );

  const getProgress = useCallback(() => progress, [progress]);

  const markComplete = useCallback(
    (lessonId: number) => {
      const completedLessons = progress.completedLessons.includes(lessonId)
        ? progress.completedLessons
        : [...progress.completedLessons, lessonId].sort((a, b) => a - b);

      saveProgress({
        completedLessons,
        lastLessonId: lessonId,
      });
    },
    [progress.completedLessons, saveProgress],
  );

  const unmarkComplete = useCallback(
    (lessonId: number) => {
      saveProgress({
        completedLessons: progress.completedLessons.filter((id) => id !== lessonId),
        lastLessonId: progress.lastLessonId === lessonId ? 1 : progress.lastLessonId,
      });
    },
    [progress.completedLessons, progress.lastLessonId, saveProgress],
  );

  const setLastLesson = useCallback(
    (lessonId: number) => {
      saveProgress({
        completedLessons: progress.completedLessons,
        lastLessonId: lessonId,
      });
    },
    [progress.completedLessons, saveProgress],
  );

  const isCompleted = useCallback(
    (lessonId: number) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons],
  );

  const totalLessons = useMemo(
    () => courses.find((course) => course.id === courseId)?.totalLessons ?? 0,
    [courseId],
  );

  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    getProgress,
    markComplete,
    unmarkComplete,
    isCompleted,
    progressPercent,
    completedCount,
    lastLessonId: progress.lastLessonId,
    setLastLesson,
  };
}
