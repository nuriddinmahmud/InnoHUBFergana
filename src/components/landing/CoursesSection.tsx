import { Link } from "react-router-dom";
import htmlLogo from "@/images/html.png";
import cssLogo from "@/images/css.png";
import jsLogo from "@/images/logojs.png";
import tsLogo from "@/images/tslogo.png";

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const CoursesSection = () => {
  const courses: Course[] = [
    {
      id: '1',
      title: "Web dasturlash",
      description: "Zamonaviy veb-saytlar yaratish uchun HTML, CSS va JavaScriptni o'rganing",
      icon: '🌐',
      level: 'Beginner',
    },
    {
      id: '2',
      title: "React asoslari",
      description: "React komponentlari, hook'lari va holat boshqaruvini o'zlashtiring",
      icon: '⚛️',
      level: 'Intermediate',
    },
    {
      id: '3',
      title: "Kengaytirilgan TypeScript",
      description: "TypeScript tiplariga, generiklarga va ilg'or uslublarga chuqur sho'ng'ing",
      icon: '📘',
      level: 'Advanced',
    },
  ];

  const levelColors: Record<string, string> = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800',
  };

  const levelLabels: Record<string, string> = {
    'Beginner': "Boshlang'ich",
    'Intermediate': "O'rta",
    'Advanced': "Yuqori",
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Tanlangan kurslar</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kurslarimiz orasidan o'zingizga mosini tanlang
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-card rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-8 border border-border"
            >
              <div className="mb-6 inline-flex items-center justify-center p-4 bg-muted rounded-lg">
                {course.title === "Web dasturlash" && (
                  <span className="flex items-center gap-2">
                    <img src={htmlLogo} alt="HTML" className="w-7 h-7 rounded" />
                    <img src={cssLogo} alt="CSS" className="w-7 h-7 rounded" />
                  </span>
                )}
                {course.title === "React asoslari" && (
                  <img src={jsLogo} alt="React" className="w-9 h-9 rounded" />
                )}
                {course.title === "Kengaytirilgan TypeScript" && (
                  <img src={tsLogo} alt="TypeScript" className="w-9 h-9 rounded" />
                )}
                {!["Web dasturlash", "React asoslari", "Kengaytirilgan TypeScript"].includes(
                  course.title,
                ) && <span className="text-3xl">{course.icon}</span>}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{course.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${levelColors[course.level]}`}>
                  {levelLabels[course.level]}
                </span>
                <Link
                  to="/courses"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
