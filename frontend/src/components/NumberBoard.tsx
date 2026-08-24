import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-store";

export function NumberBoard() {
  const called = useGame((s) => s.calledNumbers);
  const latest = called.at(-1);
  const set = new Set(called);

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-extrabold">Number Board</h3>
        <p className="text-xs font-semibold text-muted-foreground">
          {called.length} of 90 called
        </p>
      </div>
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5 md:grid-cols-10">
        {Array.from({ length: 90 }, (_, i) => i + 1).map((n) => {
          const isCalled = set.has(n);
          const isLatest = n === latest;
          return (
            <span
              key={n}
              className={cn(
                "grid aspect-square place-items-center rounded-lg text-[11px] font-bold tabular-nums transition-all duration-300 sm:text-sm",
                isLatest
                  ? "animate-pop-in bg-gold text-gold-foreground shadow-[var(--shadow-gold)]"
                  : isCalled
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {n}
            </span>
          );
        })}
      </div>
    </section>
  );
}
