import { cn } from "@/lib/utils";

export function NumberHistory({ called }: { called: number[] }) {
  const recent = [...called].reverse().slice(0, 14);
  return (
    <div>
      <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Number History
      </p>
      {recent.length === 0 ? (
        <p className="rounded-xl bg-muted px-3 py-2.5 text-xs font-medium text-muted-foreground">
          No numbers called yet.
        </p>
      ) : (
        <div className="no-scrollbar flex flex-wrap gap-1.5">
          {recent.map((n, i) => (
            <span
              key={n}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-xl text-sm font-bold tabular-nums transition-colors",
                i === 0
                  ? "animate-pop-in bg-gold text-gold-foreground shadow-[var(--shadow-gold)]"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
