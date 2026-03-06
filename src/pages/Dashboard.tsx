import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import { Progress } from "@/components/ui/progress";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";

const Dashboard = () => {
  const { data: courses = [], isLoading } = useEnrolledCourses();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <h1 className="text-[32px] font-bold mb-2">
          Salom,{" "}
          {JSON.parse(localStorage.getItem("user") || "{}").name?.split(
            " ",
          )[0] || "Foydalanuvchi"}
          ! 👋
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Bugun nimani o'rganasiz?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-muted-foreground col-span-full">
              Yuklanmoqda...
            </p>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-xl p-6 card-hover"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{course.icon}</span>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                </div>
                <Progress
                  value={course.progress}
                  className="h-1.5 bg-border mb-3"
                />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[13px]">
                    {course.done} / {course.total} mavzu tugallandi
                  </span>
                  <span className="text-primary text-sm font-semibold">
                    {course.progress}%
                  </span>
                </div>
                <Link
                  to="/lesson"
                  className="text-primary text-sm          font-medium mt-4 block hover:underline"
                >
                  Davom ettirish →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
