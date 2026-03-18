import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { useTheme } from "next-themes";
import pyLogo from "@/images/pylogo.png";
import jsLogo from "@/images/logojs.png";
import htmlLogo from "@/images/html.png";
import cssLogo from "@/images/css.png";
import cppLogo from "@/images/c++.png";
import appLogo from "@/images/logo.png";

const Compiler = () => {
  const { resolvedTheme } = useTheme();
  const [activeLang, setActiveLang] = useState("python");

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
    url.searchParams.set("theme", resolvedTheme === "dark" ? "dark" : "light");
    return url.toString();
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />

      {/* Til tanlash paneli */}
      <div className="h-14 bg-card border-b border-border flex items-center px-6 gap-4 flex-shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeLang === lang.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                {lang.id === "python" && (
                  <img src={pyLogo} alt="Python" className="w-5 h-5 rounded-sm" />
                )}
                {lang.id === "javascript" && (
                  <img src={jsLogo} alt="JavaScript" className="w-5 h-5 rounded-sm" />
                )}
                {lang.id === "html" && (
                  <span className="flex items-center gap-1">
                    <img src={htmlLogo} alt="HTML" className="w-4 h-4 rounded-sm" />
                    <img src={cssLogo} alt="CSS" className="w-4 h-4 rounded-sm" />
                  </span>
                )}
                {lang.id === "cpp" && (
                  <img src={cppLogo} alt="C++" className="w-5 h-5 rounded-sm" />
                )}
                {lang.id === "dart" && (
                  <img src={appLogo} alt="Dart" className="w-5 h-5 rounded-sm" />
                )}
                <span>{lang.name}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="hidden md:block h-4 w-[1px] bg-border mx-2" />

        <span className="hidden sm:block flex-1 text-right text-muted-foreground text-xs italic">
          Inno HUB IDE v1.0
        </span>
      </div>

      {/* Asosiy kompilyator oynasi */}
      <div className="flex-1 relative bg-[#1e1e1e]">
        <iframe
          key={activeLang + resolvedTheme} // Mavzu o'zgarganda ham iframe yangilanishi uchun
          src={getIframeSrc()}
          title="InnoHUB Code Editor"
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
};

export default Compiler;
