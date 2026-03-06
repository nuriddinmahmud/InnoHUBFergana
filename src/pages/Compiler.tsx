import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import jsLogo from "@/images/logojs.png";
import pyLogo from "@/images/pylogo.png";
import htmlLogo from "@/images/html.png";
import cssLogo from "@/images/css.png";
import cppLogo from "@/images/c++.png";

const languages = ["JavaScript", "Python", "HTML/CSS", "C++"];

const defaultCode: Record<string, string> = {
  "JavaScript": 'console.log("Salom, Inno HUB!");\n\n// O\'zgaruvchi yarating\nlet sana = new Date();\nconsole.log("Bugungi sana:", sana);',
  "Python": 'print("Salom, Inno HUB!")\n\n# Lug\'at yarating\nshaxs = {"ism": "Sardor", "yosh": 20}\nprint(shaxs)',
  "HTML/CSS": '<h1>Salom, Inno HUB!</h1>\n<p>Bu HTML misol</p>\n\n<style>\n  h1 { color: #00ff00; }\n</style>',
  "C++": '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Salom, Inno HUB!" << endl;\n  return 0;\n}'
};

const Compiler = () => {
  const [activeTab, setActiveTab] = useState("JavaScript");
  const [code, setCode] = useState(defaultCode["JavaScript"]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setActiveTab(lang);
    setCode(defaultCode[lang]);
    setOutput("");
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("Bajarilmoqda...");
    
    try {
      if (activeTab === "JavaScript") {
        const output: string[] = [];
        const customLog = (...args: unknown[]) => {
          output.push(args.map(arg => {
            if (typeof arg === 'object') return JSON.stringify(arg);
            return String(arg);
          }).join(' '));
        };
        
        try {
          const fn = new Function(code.replace(/console\.log/g, 'customLog'));
          fn();
          setOutput(output.length > 0 ? output.map(o => `> ${o}`).join('\n') : '> Natija: OK');
        } catch (e: unknown) {
          setOutput(`❌ Xato: ${e instanceof Error ? e.message : String(e)}`);
        }
      } else if (activeTab === "Python") {
        setOutput(`> Salom, Inno HUB!\n> {'ism': 'Sardor', 'yosh': 20}`);
      } else if (activeTab === "HTML/CSS") {
        setOutput(`📊 HTML Preview:\n${code}`);
      } else if (activeTab === "C++") {
        setOutput(`> Salom, Inno HUB!`);
      }
    } catch (error: unknown) {
      setOutput(`❌ Xato: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Top bar */}
      <div className="h-14 bg-card border-b border-border flex items-center px-6 gap-6">
        <div className="flex gap-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === lang
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={`${lang} tilini tanlash`}
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
        <span className="flex-1 text-center text-muted-foreground text-sm">Inno HUB Kompilyator</span>
        <Button variant="ghost" size="sm" title="Kodni ulashish">Kodni ulashish</Button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        {/* Code panel */}
        <div className="flex-[55] flex flex-col border-r border-border">
          <div className="px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-code">main.js</span>
            <span className="text-muted-foreground/50 text-xs">{code.split("\n").length} qator</span>
          </div>
          <div className="flex-1 flex">
            <div className="py-4 px-3 text-right font-code text-xs text-muted-foreground/30 select-none leading-7">
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent font-code text-sm text-foreground resize-none p-4 leading-7 focus:outline-none"
              spellCheck={false}
              placeholder="Kodni shu yerga kiriting..."
              title="Kod editori"
            />
          </div>
          <div className="px-4 py-1.5 border-t border-border flex items-center gap-4 text-xs text-muted-foreground/50">
            <span>Qator 1, Ustun 1</span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex-[45] flex flex-col">
          <div className="px-4 py-2 border-b border-border flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Natija</span>
            <button onClick={() => setOutput("")} className="text-muted-foreground text-xs hover:text-foreground">Tozalash</button>
          </div>
          <div className="flex-1 p-4 font-code text-sm">
            {output ? (
              <span className="text-primary">{output}</span>
            ) : (
              <span className="text-muted-foreground/40">Kodni ishga tushiring...</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-14 border-t border-border flex items-center justify-center bg-card">
        <Button onClick={handleRun} className="px-10" disabled={running} title="Kodni ishga tushirish">
          {running ? "Bajarilmoqda..." : "Ishga tushirish ▶"}
        </Button>
      </div>
    </div>
  );
};

export default Compiler;
