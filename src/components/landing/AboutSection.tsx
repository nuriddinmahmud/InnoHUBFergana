import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code, FileCode, Braces } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="w-full py-20 bg-background">
      <div className="container max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <p className="section-label mb-3">BIZ HAQIMIZDA</p>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              O'zbek dasturchilarining yangi uyiga xush kelibsiz
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Inno HUB — O'zbekistondagi dasturlashni o'rganmoqchi bo'lgan har bir shaxs uchun yaratilgan bepul platforma. Bizning maqsadimiz — sifatli IT ta'limni hamma uchun ochiq qilish.
            </p>
            <Button asChild>
              <Link to="/courses">Kurslarni ko'rish →</Link>
            </Button>
          </div>

          {/* Right - decorative */}
          <div className="relative h-[400px] rounded-2xl bg-card border border-border overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="relative flex gap-4 items-center opacity-60">
              <Code className="w-16 h-16 text-primary animate-float" style={{ animationDelay: "0s" }} />
              <FileCode className="w-20 h-20 text-primary animate-float" style={{ animationDelay: "1s" }} />
              <Braces className="w-16 h-16 text-primary animate-float" style={{ animationDelay: "2s" }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 font-code text-primary/10 text-xs leading-5 overflow-hidden px-4">
              {`const app = express();\napp.get('/', (req, res) => {\n  res.json({ message: "Salom!" });\n});\nimport React from 'react';\nfunction App() {\n  return <h1>Inno HUB</h1>;\n}`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
