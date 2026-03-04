import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const matrixWords = [
  "const", "function", "return", "if", "else",
  "for", "let", "var", "import", "export",
  "class", "async", "await", "try", "catch",
  "new", "this", "=>", "{}", "[]"
];

const HeroSection = () => {
  // Random qiymatlarni faqat bir marta generatsiya qilamiz
  const matrixItems = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      text: matrixWords[i],
      left: `${i * 5 + Math.random() * 3}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
  }, []);

  return (
    <section className="relative w-full min-h-[900px] flex items-center justify-center matrix-bg overflow-hidden">
      
      {/* Matrix-style background characters */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04] pointer-events-none select-none">
        {matrixItems.map((item) => (
          <div
            key={item.id}
            className="absolute font-code text-primary text-xs leading-none animate-pulse"
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Green glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/40 mb-8">
          <span className="text-primary text-[13px] font-medium">
            O'zbek tilida dasturlash platformasi
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[64px] leading-[1.1] font-bold tracking-tight mb-6">
          Dasturlashni{" "}
          <span className="text-primary glow-green">o'zbek tilida</span>{" "}
          o'rganing
        </h1>

        {/* Subtext */}
        <p className="text-muted-foreground text-xl max-w-[600px] mx-auto mb-10 leading-relaxed">
          Inno HUB orqali HTML dan tortib React gacha video darsliklar va interaktiv kod muharriri bilan bepul o'rgan.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button variant="hero" asChild>
            <Link to="/register">Hozir boshlash →</Link>
          </Button>
          <Button variant="hero-outline" asChild>
            <Link to="/courses">Kurslarni ko'rish</Link>
          </Button>
        </div>

        {/* Bottom text */}
        <p className="text-muted-foreground text-sm">
          100% bepul • O'zbek tilida • Sertifikat bilan
        </p>
      </div>
    </section>
  );
};

export default HeroSection;