import { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { enrollInCourse } from "@/api/enrollments.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useCourse } from "@/hooks/useCourses";
import { useEnrolledCourse } from "@/hooks/useEnrolledCourses";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const CoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { courseId = "" } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuth();
  const courseQuery = useCourse(courseId);
  const enrolledCourseQuery = useEnrolledCourse(courseId, isAuthenticated);

  const course = enrolledCourseQuery.data ?? courseQuery.data;
  const topics = useMemo(() => course?.topics ?? course?.lessons ?? [], [course]);
  const enrollment = enrolledCourseQuery.data?.enrollment;
  const isEnrolled = Boolean(isAuthenticated && (enrollment || enrolledCourseQuery.data?.isEnrolled || course?.isEnrolled));
  const firstTopicId = topics[0]?.id;
  const continueTopicId = enrollment?.lastTopicId ?? firstTopicId;

  const enrollMutation = useMutation({
    mutationFn: () => enrollInCourse(courseId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] }),
        queryClient.invalidateQueries({ queryKey: ["enrollments", "my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["enrollments", "my-courses", courseId] }),
      ]);

      if (firstTopicId) {
        navigate(`/course/${courseId}/lesson/${firstTopicId}`);
      }
    },
  });

  if (courseQuery.isLoading || (isAuthenticated && enrolledCourseQuery.isLoading && !course)) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16">
          <Card className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
            <CardContent className="p-8 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
              Kurs yuklanmoqda...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16">
          <Card className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
            <CardContent className="space-y-4 p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-[#F8FAFC]">Kurs topilmadi</h1>
              <Button asChild className="bg-[#22C55E] text-black hover:bg-[#16A34A]">
                <Link to="/courses">Kurslarga qaytish</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Button
          variant="ghost"
          className="w-fit px-0 text-gray-500 hover:bg-transparent hover:text-gray-900 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kurslarga qaytish
        </Button>

        <Card className="overflow-hidden border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
          <div className={cn("flex min-h-[220px] items-center justify-center bg-gradient-to-br p-8", course.gradient)}>
            {course.image ? (
              <img src={course.image} alt={course.title} className="h-32 w-32 object-contain" />
            ) : (
              <span className="text-7xl">{course.icon ?? "📘"}</span>
            )}
          </div>

          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]">{course.level}</Badge>
                  <Badge variant="outline">{course.duration}</Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h1>
                <p className="max-w-3xl text-base leading-7 text-gray-500 dark:text-[#94A3B8]">{course.description}</p>
              </div>

              {isEnrolled ? (
                <div className="space-y-3 lg:min-w-[240px]">
                  <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/10 p-4">
                    <p className="text-sm text-[#22C55E]">Progress</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-[#F8FAFC]">
                      {enrollment?.progressPercent ?? 0}%
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-[#94A3B8]">
                      {enrollment?.completedTopicsCount ?? 0}/{course.totalLessons} dars tugatilgan
                    </p>
                  </div>

                  <Button
                    className="w-full bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                    onClick={() =>
                      continueTopicId
                        ? navigate(`/course/${course.id}/lesson/${continueTopicId}`)
                        : navigate(`/course/${course.id}`)
                    }
                    disabled={!continueTopicId}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-3 lg:min-w-[240px]">
                  <Button
                    className="w-full bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                    onClick={() => navigate("/login", { state: { from: location } })}
                  >
                    Log in to Enroll
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
                    Kursga yozilish va darslarni davom ettirish uchun tizimga kiring.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 lg:min-w-[240px]">
                  <Button
                    className="w-full bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                    onClick={() => enrollMutation.mutate()}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending ? "Enroll qilinmoqda..." : "Enroll Now"}
                  </Button>
                  {enrollMutation.isError ? (
                    <p className="text-sm text-red-500">
                      {getApiErrorMessage(enrollMutation.error, "Kursga yozilishda xato yuz berdi.")}
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border border-gray-200 bg-white dark:border-[#1E293B] dark:bg-[#0D0D0D]">
                <CardContent className="flex items-center gap-3 p-4">
                  <BookOpen className="h-5 w-5 text-[#22C55E]" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-[#94A3B8]">Darslar</p>
                    <p className="font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.totalLessons} ta</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-white dark:border-[#1E293B] dark:bg-[#0D0D0D]">
                <CardContent className="flex items-center gap-3 p-4">
                  <Clock3 className="h-5 w-5 text-[#22C55E]" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-[#94A3B8]">Davomiylik</p>
                    <p className="font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.duration}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-white dark:border-[#1E293B] dark:bg-[#0D0D0D]">
                <CardContent className="flex items-center gap-3 p-4">
                  <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-[#94A3B8]">Holat</p>
                    <p className="font-semibold text-gray-900 dark:text-[#F8FAFC]">
                      {isEnrolled ? "Enroll qilingan" : isAuthenticated ? "Boshlanmagan" : "Login kerak"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">Mavzular</h2>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <Card key={topic.id} className="border border-gray-200 bg-white dark:border-[#1E293B] dark:bg-[#0D0D0D]">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-[#22C55E]">Dars #{topic.lessonNumber}</p>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-[#F8FAFC]">{topic.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-[#94A3B8]">{topic.duration}</p>
                      </div>

                      {isEnrolled ? (
                        <Button
                          variant="outline"
                          className="border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10"
                          onClick={() => navigate(`/course/${course.id}/lesson/${topic.id}`)}
                        >
                          Ochish
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursePage;
