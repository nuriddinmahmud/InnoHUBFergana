import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Circle, Copy } from "lucide-react";

const topics = [
  { name: "Kirish", done: true },
  { name: "O'zgaruvchilar", done: true },
  { name: "Ma'lumot turlari", done: true },
  { name: "Massivlar", done: false, active: true },
  { name: "Funksiyalar", done: false },
  { name: "Ob'ektlar", done: false },
];

const codeExample = `let mevalar = ["olma", "nok", "banan"];

// Birinchi elementni chiqaramiz
console.log(mevalar[0]); // "olma"

// Yangi meva qo'shamiz
mevalar.push("anor");

// Umumiy uzunlikni chiqaramiz
console.log(mevalar.length); // 4

// Barcha mevalarni konsolga chiqaramiz
for (let i = 0; i < mevalar.length; i++) {
  console.log(mevalar[i]);
}`;

const Lesson = () => {
  const [copied, setCopied] = useState(false);
  const [exampleCode, setExampleCode] = useState(codeExample);
  const [exampleOutput, setExampleOutput] = useState("> olma\n> 4\n> olma\n> nok\n> banan\n> anor");
  const [currentTopic, setCurrentTopic] = useState(3); // Massivlar
  const [completionStatus, setCompletionStatus] = useState<Record<number, boolean>>(
    { 0: true, 1: true, 2: true, 3: false, 4: false, 5: false }
  );

  const handleCopy = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(codeExample).catch(() => undefined);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runExample = () => {
    const logs: string[] = [];
    const customLog = (...args: unknown[]) => {
      logs.push(
        args
          .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
          .join(" "),
      );
    };

    try {
      const fn = new Function("customLog", exampleCode.replace(/console\.log/g, "customLog"));
      fn(customLog);
      setExampleOutput(logs.length ? logs.map((line) => `> ${line}`).join("\n") : "> Natija: OK");
    } catch (error) {
      setExampleOutput(
        `❌ Xato: ${
          error instanceof Error ? error.message : typeof error === "string" ? error : String(error)
        }`,
      );
    }
  };

  const markAsComplete = () => {
    const newStatus = { ...completionStatus, [currentTopic]: true };
    setCompletionStatus(newStatus);
  };

  const goToPrevious = () => {
    if (currentTopic > 0) {
      setCurrentTopic(currentTopic - 1);
    }
  };

  const goToNext = () => {
    if (currentTopic < topics.length - 1) {
      setCurrentTopic(currentTopic + 1);
    }
  };

  const completedCount = Object.values(completionStatus).filter(Boolean).length;
  const progress = Math.round((completedCount / topics.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-[280px] bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary font-bold">
            <ArrowLeft className="w-4 h-4" />
            JavaScript
          </Link>
        </div>
        <nav className="flex-1 py-2">
          {topics.map((topic, i) => (
            <div
              key={i}
              onClick={() => setCurrentTopic(i)}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors cursor-pointer ${
                currentTopic === i
                  ? "bg-secondary border-l-[3px] border-l-primary text-foreground font-medium"
                  : completionStatus[i]
                  ? "text-muted-foreground"
                  : "text-muted-foreground"
              }`}
              title={`${topic.name} mavzusiga o'tish`}
            >
              {completionStatus[i] ? (
                <Check className="w-4 h-4 text-primary shrink-0" />
              ) : currentTopic === i ? (
                <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className={completionStatus[i] ? "line-through" : ""}>{topic.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-10 py-8 max-w-[860px]">
          {/* Breadcrumb */}
          <p className="text-muted-foreground text-[13px] mb-6">
            <Link to="/courses" className="hover:text-primary">Kurslar</Link> &gt;{" "}
            <Link to="/dashboard" className="hover:text-primary">JavaScript</Link> &gt;{" "}
            {topics[currentTopic].name}
          </p>

          <h1 className="text-4xl font-bold mb-2">{topics[currentTopic].name}</h1>
          <div className="h-1 w-16 bg-primary rounded-full mb-8" />

          {/* Video placeholder */}
          <div className="relative w-full aspect-video bg-card border border-border rounded-xl flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-l-primary border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-8">
            O'zbek subtitl
          </div>

          {/* Content */}
          <h2 className="text-[22px] font-semibold mb-4">Massiv nima?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Massiv — bu bir nechta qiymatlarni bitta o'zgaruvchida saqlash imkonini beruvchi ma'lumot tuzilmasi.
            JavaScript-da massivlar juda keng qo'llaniladi va ular bilan ishlash juda oson.
          </p>

          {/* Code block */}
          <div className="relative bg-background rounded-xl border border-border mb-8">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <span className="text-muted-foreground text-xs font-code">JavaScript</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary text-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Nusxalandi!" : "Nusxa olish"}
              </button>
            </div>
            <pre className="p-4 font-code text-sm leading-7 overflow-x-auto">
              <code>{codeExample}</code>
            </pre>
          </div>

          {/* Try it editor */}
          <div className="mb-8">
            <p className="text-primary font-semibold mb-3">Sinab ko'ring</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="bg-background p-4 border-r border-border">
                  <textarea
                    value={exampleCode}
                    onChange={(e) => setExampleCode(e.target.value)}
                    className="w-full h-32 bg-transparent font-code text-sm text-foreground resize-none focus:outline-none placeholder:text-muted-foreground/40"
                    placeholder="// Kod yozing..."
                  />
                </div>
                <div className="bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-xs">Natija</p>
                    <Button size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={runExample}>
                      Ishga tushirish
                    </Button>
                  </div>
                  <pre className="font-code text-sm text-primary whitespace-pre-wrap">
                    {exampleOutput}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border px-10 py-4 flex items-center justify-between bg-card">
          <button 
            onClick={goToPrevious}
            disabled={currentTopic === 0}
            className="text-muted-foreground text-sm hover:text-foreground flex items-center gap-1 disabled:opacity-50"
            title="Oldingi mavzuga o'tish"
          >
            <ArrowLeft className="w-4 h-4" /> Oldingi mavzu
          </button>
          <Button 
            size="sm" 
            onClick={markAsComplete}
            disabled={completionStatus[currentTopic]}
            title="Mavzuni tugallangan deb belgilash"
          >
            {completionStatus[currentTopic] ? "✓ Tugallandi" : "✓ Tugallash"}
          </Button>
          <button 
            onClick={goToNext}
            disabled={currentTopic === topics.length - 1}
            className="text-muted-foreground text-sm hover:text-foreground flex items-center gap-1 disabled:opacity-50"
            title="Keyingi mavzuga o'tish"
          >
            Keyingi mavzu <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Right sidebar - progress */}
      <aside className="w-[300px] border-l border-border p-8 shrink-0 hidden xl:block">
        <div className="text-center">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.64} 264`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary">
              {progress}%
            </span>
          </div>
          <h4 className="font-semibold mb-1">JavaScript kursi</h4>
          <p className="text-muted-foreground text-sm">{completedCount}/{topics.length} mavzu</p>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default Lesson;
