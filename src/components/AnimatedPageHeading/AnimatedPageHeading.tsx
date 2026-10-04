import { Sparkles } from "lucide-react";

interface AnimatedPageHeadingProps {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  compactTitle?: boolean;
}

export default function AnimatedPageHeading({ eyebrow, title, accent, subtitle, compactTitle = false }: AnimatedPageHeadingProps) {
  const words = title.split(" ");

  return (
    <header className="mb-11 max-w-2xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm backdrop-blur">
        <Sparkles size={16} />
        {eyebrow}
      </span>

      <h1 className={`mt-6 origin-left -rotate-[0.5deg] ${compactTitle ? "text-5xl sm:text-6xl" : "text-6xl sm:text-7xl"} font-black leading-[.95] tracking-[-.055em] text-slate-950 [perspective:900px]`}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="mr-[.2em] inline-block origin-bottom">
            {word === accent ? (
              <span className="bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-600 bg-[length:200%_auto] bg-clip-text text-transparent">
                {word}
              </span>
            ) : word}
          </span>
        ))}
      </h1>

      <div className="mt-5 h-1 w-24 overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" />
      </div>

      <p className="mt-4 inline-block text-base leading-7 text-slate-600">{subtitle}</p>
    </header>
  );
}
