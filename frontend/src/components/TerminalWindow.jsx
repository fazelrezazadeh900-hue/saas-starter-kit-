import { useEffect, useState } from "react";

const LINES = [
  { prompt: "$", text: "git clone github.com/you/ignite-kit.git", delay: 18 },
  { prompt: "$", text: "docker compose up --build", delay: 18 },
  { prompt: "→", text: "auth service ready", isOutput: true, color: "text-gold" },
  { prompt: "→", text: "billing (stripe + crypto) ready", isOutput: true, color: "text-ember" },
  { prompt: "→", text: "listening on :8000", isOutput: true, color: "text-violet" },
];

export default function TerminalWindow() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lineIndex >= LINES.length) {
      setDone(true);
      return;
    }
    const current = LINES[lineIndex];

    if (charIndex < current.text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), current.delay);
      return () => clearTimeout(t);
    }
    const pause = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, 400);
    return () => clearTimeout(pause);
  }, [lineIndex, charIndex]);

  return (
    <div className="relative w-full max-w-xl rounded-2xl border border-line bg-surface/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-surface-2/60">
        <span className="w-3 h-3 rounded-full bg-ember/70" />
        <span className="w-3 h-3 rounded-full bg-gold/70" />
        <span className="w-3 h-3 rounded-full bg-violet/70" />
        <span className="ml-3 text-xs font-mono text-muted">quickstart.sh</span>
      </div>

      {/* Body */}
      <div className="px-5 py-6 font-mono text-sm leading-relaxed min-h-[220px]">
        {LINES.slice(0, lineIndex).map((line, i) => (
          <div key={i} className={line.isOutput ? line.color : "text-ink"}>
            <span className="text-muted mr-2">{line.prompt}</span>
            {line.text}
          </div>
        ))}
        {lineIndex < LINES.length && (
          <div className={LINES[lineIndex].isOutput ? LINES[lineIndex].color : "text-ink"}>
            <span className="text-muted mr-2">{LINES[lineIndex].prompt}</span>
            {LINES[lineIndex].text.slice(0, charIndex)}
            <span className="inline-block w-2 h-4 bg-gold ml-0.5 align-middle animate-caret-blink" />
          </div>
        )}
        {done && (
          <div className="mt-3 text-muted">
            <span className="text-gold mr-2">$</span>
            <span className="inline-block w-2 h-4 bg-gold align-middle animate-caret-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
