import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const CELLS = [
  [null, null, null, null, 22, null],
  [7, null, 47, null, null, null],
  [81, null, null, null, "gold", null],
] as const;

export function HeroShowcase({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex w-full items-center justify-center px-2 py-6 sm:py-10">
      {/* orbit lines */}
      <div className="animate-fade-up pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[80vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border" />
      <div className="animate-fade-up pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[60vw] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border" />
      <div className="animate-fade-up pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[42vw] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border opacity-60" />

      {/* centered hero copy */}
      <div className="relative z-10 mx-auto max-w-3xl px-4">{children}</div>

      {/* Your ticket card */}
      <div className="animate-float-slow surface-card absolute left-2 top-[6%] z-20 hidden w-[200px] -rotate-6 p-3 text-left shadow-[var(--shadow-lift)] md:block lg:left-2 lg:top-[10%] lg:w-[230px] lg:p-4">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Your ticket
        </p>
        <p className="mt-1 font-display text-3xl font-extrabold">47</p>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {CELLS.flat().map((cell, i) => (
            <div
              key={i}
              className={
                cell === null
                  ? "aspect-square rounded-md bg-muted"
                  : "grid aspect-square place-items-center rounded-md bg-gold text-xs font-bold text-gold-foreground"
              }
            >
              {cell === "gold" ? "" : cell}
            </div>
          ))}
        </div>
      </div>

      {/* Now calling card */}
      <div className="animate-float-slower surface-card absolute right-2 bottom-[6%] z-20 hidden w-[150px] rotate-3 p-3.5 text-center shadow-[var(--shadow-lift)] md:block lg:right-2 lg:bottom-[10%] lg:w-[180px] lg:p-4">
        <p className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Now calling
        </p>
        <p className="mt-1.5 font-display text-4xl font-extrabold text-primary italic">
          47
        </p>
        <p className="mt-2 text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Forty seven
        </p>
      </div>

      {/* Play together pill */}
      <div className="absolute right-10 top-[6%] z-20 hidden items-center gap-1.5 rounded-xl bg-gold px-3 py-1.5 text-[9px] font-bold tracking-[0.15em] text-gold-foreground uppercase shadow-[var(--shadow-lift)] md:inline-flex lg:right-16 lg:top-[10%]">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
        Play together
      </div>
    </div>
  );
}
