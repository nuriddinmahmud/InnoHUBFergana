import { Play, Code, Globe, Award } from "lucide-react";

const features = [
  {
    icon: Play,
    title: "Video Darsliklar",
    desc: "Har bir mavzuda YouTube video, o'zbek yoki ingliz subtitle bilan",
  },
  {
    icon: Code,
    title: "Sinab Ko'r",
    desc: "Brauzerda to'g'ridan-to'g'ri kod yozib, natijasini ko'ring",
  },
  {
    icon: Globe,
    title: "O'zbek tilida",
    desc: "Barcha darsliklar va interfeys to'liq o'zbek tilida",
  },
  {
    icon: Award,
    title: "Sertifikat",
    desc: "Kursni tugatgach PDF sertifikat yuklab oling",
  },
];

const WhySection = () => {
  return (
    <section className="w-full py-20 bg-card">
      <div className="container max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">NIMA UCHUN INNO HUB?</p>
          <h2 className="text-[40px] font-bold">O'rganish uchun eng yaxshi joy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1360px] mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-border bg-secondary card-hover text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
