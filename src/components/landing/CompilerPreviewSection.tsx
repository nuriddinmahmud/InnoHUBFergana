import { Link } from "react-router-dom";

const CompilerPreviewSection = () => {
  return (
    <section className="w-full py-20 bg-card">
      <div className="container max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-12">
          <p className="section-label mb-3">ONLINE KOMPILYATOR</p>
          <h2 className="text-[40px] font-bold mb-3">Hoziroq sinab ko'ring — hech narsa o'rnatmasdan</h2>
          <p className="text-muted-foreground text-lg">Brauzerda JavaScript, Python, HTML va boshqa tillarda kod yozing</p>
        </div>

        {/* Editor preview */}
        <div className="max-w-5xl mx-auto rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Code panel */}
            <div className="bg-background p-0">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <span className="text-foreground text-sm font-medium">JavaScript ▼</span>
                <div className="ml-auto flex gap-2">
                  <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                    Ishga tushirish ▶
                  </button>
                  <button className="px-3 py-1.5 rounded-md bg-secondary text-muted-foreground text-xs">
                    Tozalash
                  </button>
                </div>
              </div>
              <div className="p-4 font-code text-sm leading-7">
                <div className="flex">
                  <span className="text-muted-foreground/50 mr-4 select-none">1</span>
                  <span>
                    <span className="text-purple-400">console</span>
                    <span className="text-foreground">.</span>
                    <span className="text-yellow-400">log</span>
                    <span className="text-foreground">(</span>
                    <span className="text-primary">"Salom, Inno HUB!"</span>
                    <span className="text-foreground">);</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground/50 mr-4 select-none">2</span>
                  <span className="text-muted-foreground/30">|</span>
                </div>
              </div>
            </div>

            {/* Output panel */}
            <div className="bg-background border-l border-border">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-muted-foreground text-sm">Natija</span>
              </div>
              <div className="p-4 font-code text-sm">
                <span className="text-primary">&gt; Salom, Inno HUB!</span>
                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse-glow" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/compiler" className="text-primary font-medium hover:underline">
            To'liq kompilyatorni ochish →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompilerPreviewSection;
