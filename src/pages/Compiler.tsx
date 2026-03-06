import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { useTheme } from "@/components/ThemeProvider";

const Compiler = () => {
  const { theme } = useTheme();
  const [activeLang, setActiveLang] = useState("python");

  // Java o'rniga Dart qo'shildi
  const languages = [
    { name: "Python", id: "python" },
    { name: "JavaScript", id: "javascript" },
    { name: "HTML/CSS", id: "html" },
    { name: "C++", id: "cpp" },
    { name: "Dart", id: "dart" },
  ];

  const getIframeSrc = () => {
    const url = new URL(`https://onecompiler.com/embed/${activeLang}`);
    url.searchParams.set("listenToEvents", "true");
    url.searchParams.set("hideNew", "true");
    url.searchParams.set("hideNewFileOption", "true");
    url.searchParams.set("hideLanguageSelection", "true");
    // Mavzuni dinamik ravishda o'rnatish
    url.searchParams.set("theme", theme === "dark" ? "dark" : "light");
    return url.toString();
  };

  return (
    // Ekranning to'liq balandligini egallash uchun
    <div className="h-screen bg-background flex flex-col">
      <Navbar />

      {/* Til tanlash paneli */}
      <div className="h-14 bg-card border-b border-border flex items-center px-6 gap-6 flex-shrink-0">
        <div className="flex gap-1">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLang === lang.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={`${lang.name} tilini tanlash`}
            >
              <span className="flex items-center gap-2">
                {lang === "JavaScript" && (
                  <img src={jsLogo} alt="JavaScript" className="w-5 h-5 rounded-sm" />
                )}
                {lang === "Python" && (
                  <img src={pyLogo} alt="Python" className="w-5 h-5 rounded-sm" />
                )}
                {lang === "HTML/CSS" && (
                  <span className="flex items-center gap-1">
                    <img src={htmlLogo} alt="HTML" className="w-4 h-4 rounded-sm" />
                    <img src={cssLogo} alt="CSS" className="w-4 h-4 rounded-sm" />
                  </span>
                )}
                {lang === "C++" && (
                  <img src={cppLogo} alt="C++" className="w-5 h-5 rounded-sm" />
                )}
                <span>{lang}</span>
              </span>
            </button>
          ))}
        </div>
        <span className="flex-1 text-center text-muted-foreground text-sm">
          Inno HUB Kompilyator (OneCompiler yordamida)
        </span>
      </div>

      {/* Asosiy kompilyator oynasi */}
      <div className="flex-1 min-h-0">
        <iframe
          key={activeLang} // Til o'zgarganda "iframe"ni qayta yuklash uchun
          src={getIframeSrc()}
          title="OneCompiler"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};

export default Compiler;
