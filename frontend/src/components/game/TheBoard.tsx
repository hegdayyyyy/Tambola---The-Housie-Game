import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-store";

export function TheBoard() {
  const called = useGame((s) => s.calledNumbers);
  const latest = called.at(-1);
  const set = new Set(called);

  // Create 9 columns: 1-10, 11-20, 21-30, ... 81-90
  const columns = Array.from({ length: 9 }, (_, colIndex) => {
    return Array.from({ length: 10 }, (_, rowIndex) => colIndex * 10 + rowIndex + 1);
  });

  const renderNumber = (n: number) => {
    const isCalled = set.has(n);
    const isLatest = n === latest;
    return (
      <span
        key={n}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-md text-xs font-bold tabular-nums transition-all duration-300 sm:text-sm",
          isLatest
            ? "animate-pop-in bg-primary text-primary-foreground"
            : isCalled
              ? "bg-accent text-primary"
              : "bg-muted/70 text-muted-foreground",
        )}
      >
        {n}
      </span>
    );
  };

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-5 text-card-foreground sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          The board
        </p>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[4px] bg-primary" /> Latest
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[4px] bg-accent" /> Called
          </span>
        </div>
      </div>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-card-foreground">
        Numbers Called
      </h2>

      {/* 9 Columns layout: 1-10, 11-20, 21-30, ... 81-90 */}
      <div className="mt-5 grid grid-cols-9 gap-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-1.5">
            {column.map((n) => renderNumber(n))}
          </div>
        ))}
      </div>
    </section>
  );
}
