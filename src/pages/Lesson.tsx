import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { completeLesson, trackLessonProgress } from "@/api/progress.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEnrolledCourse } from "@/hooks/useEnrolledCourses";
import { getApiErrorMessage } from "@/lib/api";

const Lesson = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { courseId = "", lessonId = "" } = useParams<{ courseId: string; lessonId: string }>();
  const enrolledCourseQuery = useEnrolledCourse(courseId, true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressError, setProgressError] = useState("");

  const course = enrolledCourseQuery.data;
  const topics = course?.topics ?? course?.lessons ?? [];
  const currentTopicIndex = useMemo(
    () => topics.findIndex((topic) => topic.id === lessonId),
    [lessonId, topics],
  );
  const currentTopic = currentTopicIndex >= 0 ? topics[currentTopicIndex] : topics[0];
  const previousTopic = currentTopicIndex > 0 ? topics[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex >= 0 ? topics[currentTopicIndex + 1] : null;

  useEffect(() => {
    setElapsedSeconds(currentTopic?.watchSeconds ?? 0);
    setIsCompleted(Boolean(currentTopic?.completed));
    setProgressError("");
  }, [currentTopic?.completed, currentTopic?.id, currentTopic?.watchSeconds]);

  useEffect(() => {
    if (!currentTopic) return;

    const tick = window.setInterval(() => {
      setElapsedSeconds((current) => current + 5);
    }, 5000);

    return () => window.clearInterval(tick);
  }, [currentTopic?.id]);

  useEffect(() => {
    if (!currentTopic || elapsedSeconds === 0) return;

    const controller = window.setTimeout(async () => {
      try {
        await trackLessonProgress(currentTopic.id, { watchSeconds: Math.abs(elapsedSeconds) });
        setProgressError("");
      } catch (error) {
        setProgressError(getApiErrorMessage(error, "Progressni saqlashda xato yuz berdi."));
      }
    }, 300);

    return () => window.clearTimeout(controller);
  }, [currentTopic, elapsedSeconds]);

  const completeMutation = useMutation({
    mutationFn: () => completeLesson(currentTopic!.id),
    onSuccess: async () => {
      setIsCompleted(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["enrollments", "my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["enrollments", "my-courses", courseId] }),
      ]);
    },
  });

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
                <iframe
                  src={`https://www.youtube.com/embed/${currentTopic.videoId}?cc_load_policy=1&cc_lang_pref=uz&rel=0`}
                  title={currentTopic.title}
                  className="aspect-video w-full rounded-xl border border-gray-200 dark:border-[#1E293B]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
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
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
                      Tomosha vaqti: <span className="font-semibold text-gray-900 dark:text-[#F8FAFC]">{elapsedSeconds}s</span>
                    </p>
                    {progressError ? <p className="text-sm text-red-500">{progressError}</p> : null}
                  </div>

                  <Button
                    className="bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                    onClick={() => completeMutation.mutate()}
                    disabled={completeMutation.isPending || isCompleted}
                  >
                    {isCompleted ? "Tugatilgan" : completeMutation.isPending ? "Saqlanmoqda..." : "Darsni tugatish"}
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
