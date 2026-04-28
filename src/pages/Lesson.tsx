import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { completeLesson, trackLessonProgress } from "@/api/progress.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEnrolledCourse } from "@/hooks/useEnrolledCourses";
import { getApiErrorMessage } from "@/lib/api";

type WatchRange = {
  start: number;
  end: number;
};

const COMPLETION_THRESHOLD_PERCENT = 90;
const SEEK_JUMP_TOLERANCE_SECONDS = 6;
const TRACK_PROGRESS_DEBOUNCE_MS = 800;

function getVideoSource(videoIdOrUrl: string) {
  const source = videoIdOrUrl.trim();

  if (!source) {
    return "";
  }

  if (/^(https?:|\/|blob:|data:)/i.test(source)) {
    return source;
  }

  return `https://www.youtube.com/watch?v=${encodeURIComponent(source)}&cc_load_policy=1&cc_lang_pref=uz&rel=0`;
}

function mergeWatchRange(ranges: WatchRange[], nextRange: WatchRange) {
  if (nextRange.end <= nextRange.start) {
    return ranges;
  }

  const sortedRanges = [...ranges, nextRange].sort((first, second) => first.start - second.start);
  const mergedRanges: WatchRange[] = [];

  sortedRanges.forEach((range) => {
    const previousRange = mergedRanges[mergedRanges.length - 1];

    if (!previousRange || range.start > previousRange.end) {
      mergedRanges.push({ ...range });
      return;
    }

    previousRange.end = Math.max(previousRange.end, range.end);
  });

  return mergedRanges;
}

function getWatchRangesDuration(ranges: WatchRange[]) {
  return ranges.reduce((total, range) => total + Math.max(0, range.end - range.start), 0);
}

function getMediaSnapshot(event: SyntheticEvent<HTMLVideoElement>) {
  const media = event.currentTarget;
  const currentTime = Number.isFinite(media.currentTime) ? media.currentTime : 0;
  const duration = Number.isFinite(media.duration) && media.duration > 0 ? media.duration : 0;

  return {
    currentTime,
    duration,
  };
}

const Lesson = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { courseId = "", lessonId = "" } = useParams<{ courseId: string; lessonId: string }>();
  const enrolledCourseQuery = useEnrolledCourse(courseId, true);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [playerError, setPlayerError] = useState("");
  const watchedRangesRef = useRef<WatchRange[]>([]);
  const savedWatchSecondsRef = useRef(0);
  const watchedSecondsRef = useRef(0);
  const lastPlaybackSecondRef = useRef<number | null>(null);
  const completionRequestedRef = useRef(false);
  const trackedWatchSecondsRef = useRef(0);

  const course = enrolledCourseQuery.data;
  const topics = useMemo(() => {
    if (!course) {
      return [];
    }

    return course.topics?.length ? course.topics : course.lessons ?? [];
  }, [course]);
  const currentTopicIndex = useMemo(
    () => topics.findIndex((topic) => topic.id === lessonId),
    [lessonId, topics],
  );
  const currentTopic = currentTopicIndex >= 0 ? topics[currentTopicIndex] : topics[0];
  const previousTopic = currentTopicIndex > 0 ? topics[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex >= 0 ? topics[currentTopicIndex + 1] : null;
  const videoSource = currentTopic ? getVideoSource(currentTopic.videoId) : "";
  const watchedPercent = durationSeconds > 0 ? Math.min(100, Math.round((watchedSeconds / durationSeconds) * 100)) : 0;
  const hasWatchedEnough = watchedPercent >= COMPLETION_THRESHOLD_PERCENT;

  const completeMutation = useMutation({
    mutationFn: () => completeLesson(currentTopic!.id),
    onSuccess: async () => {
      setIsCompleted(true);
      setProgressError("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["enrollments", "my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["enrollments", "my-courses", courseId] }),
      ]);
    },
    onError: (error) => {
      completionRequestedRef.current = false;
      setProgressError(getApiErrorMessage(error, "Darsni tugatishda xato yuz berdi."));
    },
  });

  const requestCompletionIfQualified = useCallback(
    (nextWatchedSeconds: number, nextDurationSeconds: number) => {
      if (!currentTopic || isCompleted || completionRequestedRef.current || completeMutation.isPending) {
        return;
      }

      if (nextDurationSeconds <= 0) {
        return;
      }

      const nextPercent = (nextWatchedSeconds / nextDurationSeconds) * 100;

      if (nextPercent >= COMPLETION_THRESHOLD_PERCENT) {
        completionRequestedRef.current = true;
        completeMutation.mutate();
      }
    },
    [completeMutation, currentTopic, isCompleted],
  );

  const setWatchedSecondsValue = useCallback((nextWatchedSeconds: number) => {
    const normalizedSeconds = Math.max(0, Math.floor(nextWatchedSeconds));
    watchedSecondsRef.current = normalizedSeconds;
    setWatchedSeconds(normalizedSeconds);
  }, []);

  const recordPlaybackPosition = useCallback(
    (currentTime: number, duration: number) => {
      if (!currentTopic) {
        return;
      }

      if (duration > 0) {
        setDurationSeconds(duration);
      }

      const previousTime = lastPlaybackSecondRef.current;
      lastPlaybackSecondRef.current = currentTime;

      if (previousTime === null) {
        return;
      }

      const delta = currentTime - previousTime;

      if (delta <= 0 || delta > SEEK_JUMP_TOLERANCE_SECONDS) {
        return;
      }

      const rangeEnd = duration > 0 ? Math.min(currentTime, duration) : currentTime;
      const rangeStart = Math.max(0, Math.min(previousTime, rangeEnd));
      watchedRangesRef.current = mergeWatchRange(watchedRangesRef.current, {
        start: rangeStart,
        end: rangeEnd,
      });

      const sessionWatchedSeconds = getWatchRangesDuration(watchedRangesRef.current);
      const nextWatchedSeconds = savedWatchSecondsRef.current + sessionWatchedSeconds;
      const nextDurationSeconds = duration || durationSeconds;

      setWatchedSecondsValue(nextWatchedSeconds);
      requestCompletionIfQualified(nextWatchedSeconds, nextDurationSeconds);
    },
    [currentTopic, durationSeconds, requestCompletionIfQualified, setWatchedSecondsValue],
  );

  const handlePlayerProgress = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const { currentTime, duration } = getMediaSnapshot(event);
      recordPlaybackPosition(currentTime, duration);
    },
    [recordPlaybackPosition],
  );

  const handlePlayerEnded = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const { currentTime, duration } = getMediaSnapshot(event);
      const finalDurationSeconds = duration || durationSeconds;
      const finalCurrentTime = finalDurationSeconds > 0 ? finalDurationSeconds : currentTime;

      recordPlaybackPosition(finalCurrentTime, finalDurationSeconds);
      lastPlaybackSecondRef.current = null;
      requestCompletionIfQualified(watchedSecondsRef.current, finalDurationSeconds);
    },
    [durationSeconds, recordPlaybackPosition, requestCompletionIfQualified],
  );

  const handlePlayerSeeked = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime } = getMediaSnapshot(event);
    lastPlaybackSecondRef.current = currentTime;
  }, []);

  const handleDurationChange = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const { duration } = getMediaSnapshot(event);

      if (duration <= 0) {
        return;
      }

      setDurationSeconds(duration);
      requestCompletionIfQualified(watchedSecondsRef.current, duration);
    },
    [requestCompletionIfQualified],
  );

  useEffect(() => {
    const initialWatchSeconds = currentTopic?.watchSeconds ?? 0;

    savedWatchSecondsRef.current = initialWatchSeconds;
    watchedSecondsRef.current = initialWatchSeconds;
    watchedRangesRef.current = [];
    lastPlaybackSecondRef.current = null;
    completionRequestedRef.current = Boolean(currentTopic?.completed);
    trackedWatchSecondsRef.current = initialWatchSeconds;
    setWatchedSeconds(initialWatchSeconds);
    setDurationSeconds(0);
    setIsCompleted(Boolean(currentTopic?.completed));
    setProgressError("");
    setPlayerError("");
  }, [currentTopic?.completed, currentTopic?.id, currentTopic?.watchSeconds]);

  useEffect(() => {
    if (!currentTopic || watchedSeconds <= 0 || watchedSeconds === trackedWatchSecondsRef.current) {
      return;
    }

    const controller = window.setTimeout(async () => {
      try {
        await trackLessonProgress(currentTopic.id, { watchSeconds: watchedSeconds });
        trackedWatchSecondsRef.current = watchedSeconds;
        setProgressError("");
      } catch (error) {
        setProgressError(getApiErrorMessage(error, "Progressni saqlashda xato yuz berdi."));
      }
    }, TRACK_PROGRESS_DEBOUNCE_MS);

    return () => window.clearTimeout(controller);
  }, [currentTopic, watchedSeconds]);

  if (enrolledCourseQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16">
          <Card className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
            <CardContent className="p-8 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
              Dars yuklanmoqda...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (enrolledCourseQuery.isError || !course) {
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  if (!currentTopic) {
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Button
          variant="ghost"
          className="w-fit px-0 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
          onClick={() => navigate(`/course/${courseId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kursga qaytish
        </Button>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
          <div className="space-y-6">
            <Card className="overflow-hidden border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
              <CardContent className="p-4 sm:p-6">
                <div className="aspect-video overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-[#1E293B]">
                  {videoSource ? (
                    <ReactPlayer
                      src={videoSource}
                      controls
                      playsInline
                      width="100%"
                      height="100%"
                      onProgress={handlePlayerProgress}
                      onTimeUpdate={handlePlayerProgress}
                      onDurationChange={handleDurationChange}
                      onSeeked={handlePlayerSeeked}
                      onEnded={handlePlayerEnded}
                      onError={() => setPlayerError("Videoni yuklashda xato yuz berdi.")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/70">
                      Bu dars uchun video manzili mavjud emas.
                    </div>
                  )}
                </div>
                {playerError ? <p className="mt-3 text-sm text-red-500">{playerError}</p> : null}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <p className="text-sm text-[#22C55E]">Dars #{currentTopic.lessonNumber}</p>
                  <h1 className="text-3xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{currentTopic.title}</h1>
                  <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#94A3B8]">
                    <Clock3 className="h-4 w-4 text-[#22C55E]" />
                    {currentTopic.duration}
                  </p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 dark:prose-invert dark:text-[#94A3B8]">
                  <ReactMarkdown>{currentTopic.content ?? "Bu dars uchun matnli kontent hozircha mavjud emas."}</ReactMarkdown>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
                      Haqiqiy tomosha:{" "}
                      <span className="font-semibold text-gray-900 dark:text-[#F8FAFC]">{watchedSeconds}s</span>
                      {durationSeconds > 0 ? (
                        <span className="text-gray-500 dark:text-[#94A3B8]"> / {Math.floor(durationSeconds)}s ({watchedPercent}%)</span>
                      ) : null}
                    </p>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-[#1E293B]">
                      <div
                        className="h-full rounded-full bg-[#22C55E] transition-all"
                        style={{ width: `${watchedPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-[#94A3B8]">
                      Dars avtomatik yakunlanishi uchun videoning kamida {COMPLETION_THRESHOLD_PERCENT}% qismi tomosha qilinishi kerak.
                    </p>
                    {progressError ? <p className="text-sm text-red-500">{progressError}</p> : null}
                  </div>

                  <Button
                    className="bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                    onClick={() => requestCompletionIfQualified(watchedSecondsRef.current, durationSeconds)}
                    disabled={completeMutation.isPending || isCompleted || !hasWatchedEnough}
                  >
                    {isCompleted
                      ? "Tugatilgan"
                      : completeMutation.isPending
                        ? "Saqlanmoqda..."
                        : hasWatchedEnough
                          ? "Darsni tugatish"
                          : "90% tomosha qiling"}
                  </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="border border-[#22C55E] bg-transparent text-[#22C55E] hover:bg-[#22C55E]/10"
                    onClick={() => previousTopic && navigate(`/course/${courseId}/lesson/${previousTopic.id}`)}
                    disabled={!previousTopic}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Oldingi
                  </Button>
                  <Button
                    className="bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                    onClick={() => nextTopic && navigate(`/course/${courseId}/lesson/${nextTopic.id}`)}
                    disabled={!nextTopic}
                  >
                    Keyingi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
            <CardContent className="space-y-6 p-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h2>
                <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
                  {course.enrollment?.completedTopicsCount ?? 0}/{course.totalLessons} dars tugatildi
                </p>
              </div>

              <div className="space-y-2">
                {topics.map((topic) => {
                  const active = topic.id === currentTopic.id;
                  const completed = topic.completed || (active && isCompleted);

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => navigate(`/course/${courseId}/lesson/${topic.id}`)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-[#22C55E] bg-[#22C55E]/10"
                          : "border-gray-200 bg-white hover:border-[#22C55E] dark:border-[#1E293B] dark:bg-[#0D0D0D]"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
                        {topic.lessonNumber}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900 dark:text-[#F8FAFC]">{topic.title}</p>
                        <p className="text-xs text-gray-500 dark:text-[#94A3B8]">{topic.duration}</p>
                      </div>
                      {completed ? <CheckCircle2 className="h-4 w-4 text-[#22C55E]" /> : null}
                    </button>
                  );
                })}
              </div>

              <Button variant="outline" asChild>
                <Link to={`/course/${courseId}`}>Kurs tafsilotlari</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
