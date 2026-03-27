import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/hooks/useCourses";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const Courses = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const coursesQuery = useCourses();
  const enrolledCoursesQuery = useEnrolledCourses(isAuthenticated);
  const coursesErrorMessage = getApiErrorMessage(coursesQuery.error, "Kurslar ma'lumotini yuklashda xato yuz berdi.");

  const courseCards = useMemo(() => {
    const enrolledMap = new Map((enrolledCoursesQuery.data ?? []).map((item) => [item.id, item]));

    return (coursesQuery.data ?? []).map((course) => {
      const enrolled = enrolledMap.get(course.id);
      return {
        ...course,
        isEnrolled: Boolean(enrolled),
        completedTopicsCount: enrolled?.completedTopicsCount ?? 0,
        progressPercent: enrolled?.progressPercent ?? 0,
        lastTopicId: enrolled?.lastTopicId,
      };
    });
  }, [coursesQuery.data, enrolledCoursesQuery.data]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-[#F8FAFC] sm:text-5xl">Barcha kurslar</h1>
            <p className="text-lg text-gray-500 dark:text-[#94A3B8]">
              Backenddan kelgan kurslar ro&apos;yxati, enrollment holati va progress shu yerda ko&apos;rinadi.
            </p>
          </div>

          {coursesQuery.isLoading ? (
            <Card className="border border-gray-200 bg-gray-100 dark:border-[#1E293B] dark:bg-[#111111]">
              <CardContent className="p-10 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
                Kurslar yuklanmoqda...
              </CardContent>
            </Card>
          ) : coursesQuery.isError ? (
            <Card className="border border-red-500/40 bg-red-500/10">
              <CardContent className="p-10 text-center text-sm text-red-500">
                {coursesErrorMessage}
              </CardContent>
            </Card>
          ) : courseCards.length === 0 ? (
            <Card className="border border-gray-200 bg-gray-100 dark:border-[#1E293B] dark:bg-[#111111]">
              <CardContent className="p-10 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
                Hozircha foydalanuvchilar uchun nashr etilgan kurslar topilmadi.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courseCards.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden border border-gray-200 bg-gray-100 transition-all hover:border-[#22C55E] dark:border-[#1E293B] dark:bg-[#111111]"
                >
                  <div className={cn("flex h-[140px] items-center justify-center bg-gradient-to-br", course.gradient)}>
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="h-24 w-24 object-contain" />
                    ) : (
                      <span className="text-5xl">{course.icon ?? "📘"}</span>
                    )}
                  </div>

                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h2>
                      <p className="text-sm leading-6 text-gray-500 dark:text-[#94A3B8]">{course.description}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <Badge className="border border-[#22C55E] bg-transparent text-[#22C55E]">{course.level}</Badge>
                      <span className="text-sm text-gray-500 dark:text-[#94A3B8]">{course.duration}</span>
                    </div>

                    {course.isEnrolled ? (
                      <div className="space-y-2">
                        <Progress value={course.progressPercent} className="h-2 bg-gray-200 dark:bg-[#1E293B]" />
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-[#94A3B8]">
                          <span>{course.completedTopicsCount}/{course.totalLessons} dars</span>
                          <span>{course.progressPercent}%</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-[#94A3B8]">
                        {course.totalLessons} ta dars mavjud.
                      </p>
                    )}

                    <Button
                      className="w-full bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      {course.isEnrolled ? "Davom ettirish" : "Batafsil ko'rish"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Courses;
