import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useCourses } from "@/hooks/useCourses";
import htmlLogo from "@/images/html.png";
import cssLogo from "@/images/css.png";
import jsLogo from "@/images/logojs.png";
import tsLogo from "@/images/tslogo.png";

const Courses = () => {
  const { data: courses = [], isLoading } = useCourses();

  const levelColors: Record<string, string> = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Barcha kurslar
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sifatli IT ta&apos;limni o&apos;zbek tilida o&apos;rganing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <p className="text-muted-foreground col-span-full text-center py-12">Yuklanmoqda...</p>
            ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8"
              >
                <div className="mb-6 inline-flex items-center justify-center p-4 bg-muted rounded-lg">
                  {course.title === "Web Development" && (
                    <span className="flex items-center gap-2">
                      <img src={htmlLogo} alt="HTML" className="w-7 h-7 rounded" />
                      <img src={cssLogo} alt="CSS" className="w-7 h-7 rounded" />
                    </span>
                  )}
                  {course.title === "React Fundamentals" && (
                    <img src={jsLogo} alt="React" className="w-9 h-9 rounded" />
                  )}
                  {course.title === "Advanced TypeScript" && (
                    <img src={tsLogo} alt="TypeScript" className="w-9 h-9 rounded" />
                  )}
                  {!["Web Development", "React Fundamentals", "Advanced TypeScript"].includes(
                    course.title,
                  ) && <span className="text-3xl">{course.icon}</span>}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${levelColors[course.level]}`}
                  >
                    {course.level}
                  </span>
                  <Link
                    to="/lesson"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    Boshlash →
                  </Link>
                </div>
              </div>
            )))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Courses;
