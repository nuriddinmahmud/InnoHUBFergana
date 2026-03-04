const stats = [
  { number: "7+", label: "ta kurs" },
  { number: "100+", label: "ta mavzu" },
  { number: "O'zbek", label: "tilida" },
  { number: "Bepul", label: "to'liq bepul" },
];

const StatsSection = () => {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-[56px] font-bold text-primary leading-none mb-2 transition-all group-hover:glow-green">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
