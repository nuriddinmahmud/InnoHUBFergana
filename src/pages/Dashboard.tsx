import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const enrolledCoursesQuery = useEnrolledCourses(true);
  const enrolledCourses = enrolledCoursesQuery.data ?? [];

  const stats = [
    { label: "Kurslar", value: String(enrolledCourses.length), icon: BookOpen },
    {
      label: "Tugatilgan darslar",
      value: String(enrolledCourses.reduce((total, course) => total + course.completedTopicsCount, 0)),
      icon: CheckCircle2,
    },
    {
      label: "O'rtacha progress",
      value: enrolledCourses.length
        ? `${Math.round(enrolledCourses.reduce((total, course) => total + course.progressPercent, 0) / enrolledCourses.length)}%`
        : "0%",
      icon: Clock3,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-[#F8FAFC]">
              Xush kelibsiz, {user?.name ?? "do'stim"}!
            </h1>
            <p className="text-base text-gray-500 dark:text-[#94A3B8]">Siz enrolled bo&apos;lgan kurslar shu yerda.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
                <CardContent className="flex items-center gap-4 p-6">
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

          {enrolledCoursesQuery.isLoading ? (
            <Card className="border border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
              <CardContent className="p-10 text-center text-sm text-gray-500 dark:text-[#94A3B8]">
                Mening kurslarim yuklanmoqda...
              </CardContent>
            </Card>
          ) : enrolledCoursesQuery.isError ? (
            <Card className="border border-red-500/40 bg-red-500/10">
              <CardContent className="p-10 text-center text-sm text-red-500">
                Enrollment ma&apos;lumotlarini yuklab bo&apos;lmadi.
              </CardContent>
            </Card>
          ) : enrolledCourses.length === 0 ? (
            <Card className="border border-dashed border-gray-200 bg-gray-50 dark:border-[#1E293B] dark:bg-[#111111]">
              <CardContent className="space-y-4 p-10 text-center">
                <p className="text-sm text-gray-500 dark:text-[#94A3B8]">Siz hali hech bir kursga enroll bo&apos;lmagansiz.</p>
                <Button className="bg-[#22C55E] text-black hover:bg-[#16A34A]" onClick={() => navigate("/courses")}>
                  Kurslarni ko&apos;rish
                </Button>
              </CardContent>
            </Card>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-[#F8FAFC]">Mening kurslarim</h2>
                <Badge className="border border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]">
                  {enrolledCourses.length} ta
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden border border-gray-200 bg-gray-50 transition-all hover:border-[#22C55E] dark:border-[#1E293B] dark:bg-[#111111]"
                  >
                    <div className={cn("flex h-[120px] items-center justify-center bg-gradient-to-br", course.gradient)}>
                      {course.image ? (
                        <img src={course.image} alt={course.title} className="h-20 w-20 object-contain drop-shadow-lg" />
                      ) : (
                        <span className="text-5xl drop-shadow-lg">{course.icon ?? "📘"}</span>
                      )}
                    </div>

                    <CardContent className="space-y-4 p-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-[#F8FAFC]">{course.title}</h3>
                        <p className="text-sm leading-6 text-gray-500 dark:text-[#94A3B8]">{course.description}</p>
                      </div>

                      <div className="space-y-2">
                        <Progress value={course.progressPercent} className="h-2 bg-gray-200 dark:bg-[#1E293B]" />
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-[#94A3B8]">
                          <span>{course.completedTopicsCount}/{course.totalLessons} dars</span>
                          <span>{course.progressPercent}%</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
                        onClick={() =>
                          navigate(course.lastTopicId ? `/course/${course.id}/lesson/${course.lastTopicId}` : `/course/${course.id}`)
                        }
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Davom ettirish
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
