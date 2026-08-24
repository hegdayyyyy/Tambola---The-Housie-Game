import { cn } from "@/lib/utils";
import type { TicketGrid } from "@/lib/tambola-data";

export function GameTicket({
  ticket,
  marked,
  disabled,
  onToggle,
}: {
  ticket: TicketGrid;
  marked: number[];
  disabled?: boolean;
  onToggle: (n: number) => void;
}) {
  return (
    <div className="rounded-3xl bg-muted/60 p-2.5 sm:p-3">
      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
        {ticket.flatMap((row, r) =>
          row.map((n, c) => {
            const empty = n === 0;
            const isMarked = !empty && marked.includes(n);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={empty || disabled}
                onClick={() => !empty && onToggle(n)}
                className={cn(
                  "grid aspect-square w-full place-items-center rounded-xl text-base font-bold tabular-nums transition-all duration-200 select-none sm:text-xl",
                  empty
                    ? "bg-muted/70 text-muted-foreground/60"
                    : isMarked
                      ? "mark-animate bg-gold text-gold-foreground shadow-[var(--shadow-lift)]"
                      : "bg-card text-primary shadow-[0_1px_2px_oklch(0.24_0.03_300/0.08)] hover:-translate-y-0.5",
                )}
              >
                {empty ? 0 : n}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
