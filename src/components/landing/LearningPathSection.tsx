import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const webPath = ["HTML", "CSS", "JavaScript", "Node.js", "React"];
const progPath = ["Python", "C++"];

const PathStep = ({ name, index }: { name: string; index: number }) => (
  <div className="relative flex items-center gap-2">
    <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-primary bg-card">
      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
        {index + 1}
      </span>
      <span className="text-foreground font-semibold">{name}</span>
    </div>
  </div>
);

const LearningPathSection = () => {
  return (
    <section className="w-full py-20 bg-background">
      <div className="container max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">O'QUV YO'LI</p>
          <h2 className="text-[40px] font-bold">Qayerdan boshlash kerak?</h2>
        </div>

        {/* Web Path */}
        <div className="mb-10">
          <p className="text-primary font-semibold mb-4 text-center">Web yo'li</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {webPath.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <PathStep name={step} index={i} />
                {i < webPath.length - 1 && <ArrowRight className="w-5 h-5 text-primary" />}
              </div>
            ))}
          </div>
        </div>

        {/* Prog Path */}
        <div className="mb-12">
          <p className="text-primary font-semibold mb-4 text-center">Dasturlash yo'li</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {progPath.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <PathStep name={step} index={i} />
                {i < progPath.length - 1 && <ArrowRight className="w-5 h-5 text-primary" />}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button asChild>
            <Link to="/register">Hozir boshlash</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;
