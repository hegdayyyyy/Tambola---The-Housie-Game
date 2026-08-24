import { cn } from "@/lib/utils";
import type { TicketGrid } from "@/lib/tambola-data";

type Props = {
  ticket: TicketGrid;
  /** Playable mode: cells are clickable and can be marked. */
  marked?: number[];
  called?: number[];
  onToggle?: (n: number) => void;
  size?: "sm" | "lg";
  disabled?: boolean;
};

export function TambolaTicket({
  ticket,
  marked = [],
  called = [],
  onToggle,
  size = "sm",
  disabled,
}: Props) {
  const interactive = Boolean(onToggle);
  return (
    <div className="rounded-xl border border-border bg-gold-soft/50 p-1 sm:p-1.5">
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
        {ticket.flatMap((row, r) =>
          row.map((n, c) => {
            const empty = n === 0;
            const isMarked = !empty && marked.includes(n);
            const isCalled = !empty && called.includes(n);
            const Cell = interactive ? "button" : "span";
            return (
              <Cell
                key={`${r}-${c}`}
                {...(interactive
                  ? {
                      type: "button" as const,
                      disabled: empty || disabled,
                      onClick: () => !empty && onToggle?.(n),
                    }
                  : {})}
                className={cn(
                  "relative grid aspect-square w-full place-items-center rounded-md font-semibold tabular-nums transition-all duration-200 select-none",
                  size === "lg"
                    ? "text-xs sm:text-sm md:text-base"
                    : "text-[11px] sm:text-sm",
                  empty
                    ? "bg-muted/60"
                    : "border border-border bg-card text-foreground shadow-[0_1px_0_oklch(0.24_0.03_300/0.06)]",
                  !empty &&
                    isCalled &&
                    !isMarked &&
                    "border-secondary/50 bg-accent text-primary",
                  isMarked &&
                    "mark-animate border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-lift)]",
                  interactive &&
                    !empty &&
                    !disabled &&
                    "cursor-pointer hover:-translate-y-0.5",
                )}
              >
                {!empty && n}
                {isMarked && (
                  <span className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-gold" />
                )}
              </Cell>
            );
          }),
        )}
      </div>
    </div>
  );
}
