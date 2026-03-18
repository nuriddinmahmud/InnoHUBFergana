import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3 } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/data/courses";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { cn } from "@/lib/utils";

const chartColors = ["#22C55E", "hsl(var(--border))"];

const CoursePage = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();

  const course = useMemo(
    () => courses.find((item) => item.id === courseId),
    [courseId],
  );

  const {
    markComplete,
    unmarkComplete,
    isCompleted,
    progressPercent,
    completedCount,
    lastLessonId,
    setLastLesson,
  } = useCourseProgress(course?.id ?? "");

  const resolvedLessonId = useMemo(() => {
    if (!course) return 1;
    const requestedId = Number(lessonId);
    const fallbackId =
      course.lessons.find((lesson) => lesson.id === lastLessonId)?.id ?? course.lessons[0]?.id ?? 1;

    if (!Number.isNaN(requestedId) && course.lessons.some((lesson) => lesson.id === requestedId)) {
      return requestedId;
    }

    return fallbackId;
  }, [course, lastLessonId, lessonId]);

  const currentLessonIndex = useMemo(() => {
    if (!course) return 0;
    return Math.max(
      course.lessons.findIndex((lesson) => lesson.id === resolvedLessonId),
      0,
    );
  }, [course, resolvedLessonId]);

  const currentLesson = course?.lessons[currentLessonIndex];

  useEffect(() => {
    if (!course) return;
    setLastLesson(resolvedLessonId);
  }, [course, resolvedLessonId, setLastLesson]);

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card className="bg-gray-50 border border-gray-200 dark:bg-[#111111] dark:border-[#1E293B]">
            <CardContent className="p-8 text-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-[#F8FAFC]">Kurs topilmadi</h1>
              <p className="text-gray-500 dark:text-[#94A3B8]">So'ralgan kurs mavjud emas yoki darslar hali qo'shilmagan.</p>
              <Button asChild className="bg-[#22C55E] text-black hover:bg-[#16A34A]">
                <Link to="/dashboard">Dashboard ga qaytish</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "completed", value: completedCount },
    { name: "remaining", value: Math.max(course.totalLessons - completedCount, 0) },
  ];

  const goToLesson = (nextLessonId: number) => {
    navigate(`/course/${course.id}/lesson/${nextLessonId}`);
  };

  const handleCompletionChange = (checked: boolean) => {
    if (checked) {
      markComplete(currentLesson.id);
      return;
    }

    unmarkComplete(currentLesson.id);
  };

  const previousLesson = course.lessons[currentLessonIndex - 1];
  const nextLesson = course.lessons[currentLessonIndex + 1];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-fit px-0 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard ga qaytish
            </Button>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl", course.gradient)}>
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  course.icon
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-[#94A3B8]">{course.description}</p>
              </div>
            </div>
          </div>
          <Badge className="w-fit border border-[#22C55E] bg-[#22C55E]/10 px-4 py-2 text-[#22C55E]">
            {progressPercent}% tugatildi
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)] gap-6">
          <div className="space-y-6">
            <Card className="overflow-hidden bg-gray-50 border border-gray-200 dark:bg-[#111111] dark:border-[#1E293B]">
              <CardContent className="p-4 sm:p-6">
                <iframe
                  src={`https://www.youtube.com/embed/${currentLesson.videoId}?cc_load_policy=1&cc_lang_pref=uz&rel=0`}
                  title={currentLesson.title}
                  className="w-full aspect-video rounded-xl border border-gray-200 dark:border-[#1E293B]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border border-gray-200 dark:bg-[#111111] dark:border-[#1E293B]">
              <CardContent className="p-6 space-y-5">
                <Badge variant="outline" className="border-gray-200 text-gray-500 dark:border-[#1E293B] dark:text-[#94A3B8]">
                  Dars #{currentLesson.id}
                </Badge>
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{currentLesson.title}</h2>
                  <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#94A3B8]">
                    <Clock3 className="h-4 w-4 text-[#22C55E]" />
                    {currentLesson.duration}
                  </p>
                  <p className="text-base leading-7 text-gray-500 dark:text-[#94A3B8]">
                    {course.title} kursining ushbu darsida {currentLesson.title.toLowerCase()} mavzusini oson va amaliy tarzda o'rganasiz.
                  </p>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 dark:border-[#1E293B] dark:bg-[#0D0D0D] dark:text-[#F8FAFC]">
                    <input
                      type="checkbox"
                      checked={isCompleted(currentLesson.id)}
                      onChange={(event) => handleCompletionChange(event.target.checked)}
                      className="h-4 w-4 rounded border-gray-200 bg-transparent accent-[#22C55E] dark:border-[#1E293B]"
                    />
                    <span className="text-sm sm:text-base">Bu darsni tugatdim</span>
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      className="border border-[#22C55E] bg-transparent text-[#22C55E] hover:bg-[#22C55E]/10"
                      onClick={() => previousLesson && goToLesson(previousLesson.id)}
                      disabled={!previousLesson}
                    >
                      ← Oldingi
                    </Button>
                    <Button
                      className="bg-[#22C55E] text-black font-semibold hover:bg-[#16A34A]"
                      onClick={() => nextLesson && goToLesson(nextLesson.id)}
                      disabled={!nextLesson}
                    >
                      Keyingi →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-50 border border-gray-200 dark:bg-[#111111] dark:border-[#1E293B]">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{completedCount}/{course.totalLessons} dars</p>
                </div>
                <Badge className="border border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]">
                  {course.level}
                </Badge>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-[#1E293B] dark:bg-[#0D0D0D]">
                <div className="mx-auto h-[140px] w-full max-w-[160px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        innerRadius={40}
                        outerRadius={55}
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-[#F8FAFC]">{progressPercent}%</span>
                    <span className="text-xs text-gray-500 dark:text-[#94A3B8]">progress</span>
                  </div>
                </div>
                <p className="mt-2 text-center text-sm text-gray-500 dark:text-[#94A3B8]">{completedCount} ta dars tugatildi</p>
              </div>

              <div className="space-y-3">
                <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                  {course.lessons.map((lesson) => {
                    const completed = isCompleted(lesson.id);
                    const current = lesson.id === currentLesson.id;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => goToLesson(lesson.id)}
                        className={cn(
                          "w-full rounded-xl border-l-2 border-transparent px-4 py-3 text-left transition-all",
                          completed && "bg-[#22C55E]/10",
                          current && "border-[#22C55E] bg-[#22C55E]/20",
                          !completed && !current && "hover:bg-gray-100 dark:hover:bg-[#0D0D0D]",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                              completed ? "bg-[#22C55E] text-black" : "bg-gray-200 text-gray-500 dark:bg-[#1E293B] dark:text-[#94A3B8]",
                            )}
                          >
                            {lesson.id}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn("truncate text-sm font-medium", current ? "text-gray-900 dark:text-[#F8FAFC]" : "text-gray-500 dark:text-[#94A3B8]")}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#94A3B8]">{lesson.duration}</p>
                          </div>
                          {completed ? <CheckCircle2 className="h-4 w-4 text-[#22C55E]" /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
