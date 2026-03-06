import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const matrixWords = [
  "const","function","return","if","else","for","let","var","import","export",
  "class","async","await","try","catch","new","this","=>","{}","[]",
  "console.log","map","filter","reduce","React","useState","useEffect",
  "hook","module","interface","type","any","string","number","boolean",
  "null","undefined","API","DOM","npm","yarn","vite","next","node",
  "express","package.json",
];

const HeroSection = () => {

  const matrixItems = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `a-${i}`,
      text: matrixWords[i % matrixWords.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${1 + Math.random() * 3}s`,
      rotate: `${Math.random() * 360}deg`,
      opacity: 0.05 + Math.random() * 0.1,
      size: Math.random() < 0.3 ? "text-sm" : "text-xs",
    }));
  }, []);

  const matrixItems2 = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `b-${i}`,
      text: matrixWords[(i + 5) % matrixWords.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${4 + Math.random() * 4}s`,
      rotate: `${Math.random() * 360}deg`,
      opacity: 0.02 + Math.random() * 0.05,
      size: "text-base",
    }));
  }, []);

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[900px] flex items-center justify-center overflow-hidden">

      {/* Matrix words */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[...matrixItems, ...matrixItems2].map((item) => (
          <div
            key={item.id}
            className={`absolute font-mono text-green-500 ${item.size} animate-pulse`}
            style={{
              left: item.left,
              top: item.top,
              opacity: item.opacity,
              animationDelay: item.delay,
              animationDuration: item.duration,
              transform: `rotate(${item.rotate})`,
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">

        <div className="inline-flex px-4 py-2 rounded-full border border-green-500/40 mb-8">
          <span className="text-green-500 text-sm font-medium">
            O'zbek tilida dasturlash platformasi
          </span>
        </div>

        <h1 className="text-4xl sm:text-[64px] leading-[1.1] font-bold mb-6">
          Dasturlashni{" "}
          <span className="text-green-500">
            o'zbek tilida
          </span>{" "}
          o'rganing
        </h1>

        <p className="text-gray-400 text-base sm:text-xl max-w-[600px] mx-auto mb-10">
          Inno HUB orqali HTML dan tortib React gacha video darsliklar va
          interaktiv kod muharriri bilan bepul o'rganing.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button asChild>
            <Link to="/register">Hozir boshlash →</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/courses">Kurslarni ko'rish</Link>
          </Button>
        </div>

        <p className="text-gray-400 text-sm">
          100% bepul • O'zbek tilida • Sertifikat bilan
        </p>

      </div>
    </section>
  );
};

export default HeroSection;