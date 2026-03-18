import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/courses";
import { getStoredCourseProgress } from "@/hooks/useCourseProgress";
import { cn } from "@/lib/utils";

const Courses = () => {
  const navigate = useNavigate();

  const courseProgress = useMemo(
    () =>
      courses.map((course) => {
        const completedLessons = getStoredCourseProgress(course.id).completedLessons.length;
        return {
          ...course,
          completedLessons,
          progressPercent: Math.round((completedLessons / course.totalLessons) * 100),
        };
      }),
    [],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-[#F8FAFC]">Barcha kurslar</h1>
            <p className="text-lg text-gray-500 dark:text-[#94A3B8]">
              HTML, CSS va JavaScript bo'yicha bosqichma-bosqich darslar bilan o'zbek tilida o'rganing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courseProgress.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden bg-gray-100 border border-gray-200 transition-all hover:border-[#22C55E] dark:bg-[#111111] dark:border-[#1E293B]"
              >
                <div className={cn("flex h-[140px] items-center justify-center bg-gradient-to-br", course.gradient)}>
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <span className="text-6xl">{course.icon}</span>
                  )}
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h2>
                    <p className="text-sm leading-6 text-gray-500 dark:text-[#94A3B8]">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Badge className="border border-[#22C55E] bg-transparent text-[#22C55E]">
                      {course.level}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-[#94A3B8]">{course.duration}</span>
                  </div>

                  <div className="space-y-2">
                    <Progress value={course.progressPercent} className="h-2 bg-gray-200 dark:bg-[#1E293B]" />
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-[#94A3B8]">
                      <span>{course.completedLessons}/{course.totalLessons} dars</span>
                      <span>{course.progressPercent}%</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#22C55E] text-black font-semibold hover:bg-[#16A34A]"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {course.completedLessons > 0 ? "Davom ettirish" : "Boshlash"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Courses;
