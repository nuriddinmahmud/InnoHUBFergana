import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock3, PlayCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { useAuth } from "@/context/AuthContext";
import { courses } from "@/data/courses";
import { getStoredCourseProgress } from "@/hooks/useCourseProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const parseDurationToMinutes = (duration: string) => {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes + seconds / 60;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const courseProgress = useMemo(
    () =>
      courses.map((course) => {
        const progress = getStoredCourseProgress(course.id);
        const completedLessons = progress.completedLessons.length;
        const progressPercent = Math.round((completedLessons / course.totalLessons) * 100);
        const completedMinutes = course.lessons
          .filter((lesson) => progress.completedLessons.includes(lesson.id))
          .reduce((total, lesson) => total + parseDurationToMinutes(lesson.duration), 0);

        return {
          course,
          completedLessons,
          progressPercent,
          lastLessonId: progress.lastLessonId,
          completedMinutes,
        };
      }),
    [],
  );

  const totalCompletedLessons = courseProgress.reduce((total, item) => total + item.completedLessons, 0);
  const totalHours = courseProgress.reduce((total, item) => total + item.completedMinutes, 0) / 60;

  const stats = [
    {
      label: "Kurslar",
      value: String(courses.length),
      icon: BookOpen,
    },
    {
      label: "Tugatilgan darslar",
      value: String(totalCompletedLessons),
      icon: CheckCircle2,
    },
    {
      label: "O'rganish vaqti",
      value: `${totalHours.toFixed(1)} soat`,
      icon: Clock3,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <Card className="bg-gray-50 border border-gray-200 dark:bg-[#111111] dark:border-[#1E293B]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-16 w-16 rounded-2xl border border-gray-200 object-cover dark:border-[#1E293B]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-2xl font-bold text-gray-900 dark:border-[#1E293B] dark:bg-[#0D0D0D] dark:text-[#F8FAFC]">
                      {user?.name?.charAt(0).toUpperCase() ?? "I"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{user?.name ?? "INNOHUB"}</h2>
                    <p className="truncate text-sm text-gray-500 dark:text-[#94A3B8]">{user?.email ?? "Email topilmadi"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border border-gray-200 dark:bg-[#111111] dark:border-[#1E293B]">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F8FAFC]">Mening kurslarim</h3>
                  <Badge className="border border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]">
                    {courses.length} ta
                  </Badge>
                </div>

                <div className="space-y-3">
                  {courseProgress.map(({ course, completedLessons, progressPercent, lastLessonId }) => (
                    <div
                      key={course.id}
                      className="rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-[#22C55E] dark:border-[#1E293B] dark:bg-[#0D0D0D]"
                    >
                      <div className="flex items-start gap-3">
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
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-[#94A3B8]">{completedLessons}/{course.totalLessons} dars tugatildi</p>
                        </div>
                      </div>

                      <Progress value={progressPercent} className="mt-4 h-2 bg-gray-200 dark:bg-[#1E293B]" />

                      <Button
                        className="mt-4 w-full bg-[#22C55E] text-black font-semibold hover:bg-[#16A34A]"
                        onClick={() =>
                          navigate(
                            lastLessonId > 0
                              ? `/course/${course.id}/lesson/${lastLessonId}`
                              : `/course/${course.id}`,
                          )
                        }
                      >
                        Davom ettirish
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-[#F8FAFC]">
                Xush kelibsiz, {user?.name ?? "do'stim"}! 👋
              </h1>
              <p className="text-base text-gray-500 dark:text-[#94A3B8]">Bugun ham o'rganishda davom eting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-gray-50 border border-gray-200 rounded-xl transition-all hover:border-[#22C55E] dark:bg-[#111111] dark:border-[#1E293B]"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10">
                      <stat.icon className="h-6 w-6 text-[#22C55E]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-[#F8FAFC]">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-[#F8FAFC]">Barcha kurslar</h2>
                <Button
                  variant="outline"
                  className="border border-[#22C55E] text-[#22C55E] bg-transparent hover:bg-[#22C55E]/10"
                  onClick={() => navigate("/courses")}
                >
                  Hammasini ko'rish
                </Button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {courseProgress.map(({ course, completedLessons, progressPercent, lastLessonId }) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden bg-gray-50 border border-gray-200 transition-all hover:border-[#22C55E] dark:bg-[#111111] dark:border-[#1E293B]"
                  >
                    <div className={cn("flex h-[120px] items-center justify-center bg-gradient-to-br", course.gradient)}>
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-20 w-20 object-contain drop-shadow-lg"
                        />
                      ) : (
                        <span className="text-5xl drop-shadow-lg">{course.icon}</span>
                      )}
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h3>
                        <p className="text-sm leading-6 text-gray-500 dark:text-[#94A3B8]">{course.description}</p>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <Badge className="border border-[#22C55E] bg-transparent text-[#22C55E] text-xs">
                          {course.level}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-[#94A3B8]">{course.duration}</span>
                      </div>

                      <div className="space-y-2">
                        <Progress value={progressPercent} className="h-2 bg-gray-200 dark:bg-[#1E293B]" />
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-[#94A3B8]">
                          <span>{completedLessons}/{course.totalLessons} dars</span>
                          <span>{progressPercent}%</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-[#22C55E] text-black font-semibold hover:bg-[#16A34A]"
                        onClick={() =>
                          navigate(
                            completedLessons > 0
                              ? `/course/${course.id}/lesson/${lastLessonId}`
                              : `/course/${course.id}`,
                          )
                        }
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        {completedLessons > 0 ? "Davom ettirish" : "Boshlash"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
