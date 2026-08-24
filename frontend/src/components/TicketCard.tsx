import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TambolaTicket } from "@/components/TambolaTicket";
import type { TicketGrid } from "@/lib/tambola-data";

export function TicketCard({
  ticket,
  index,
  selected,
  onSelect,
}: {
  ticket: TicketGrid;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ animationDelay: `${index * 90}ms` }}
      className={cn(
        "animate-fade-up surface-card group relative w-full rounded-[28px] p-4 text-left transition-all duration-300 sm:p-5",
        selected
          ? "border-primary shadow-[var(--shadow-gold)] -translate-y-1"
          : "hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-display text-lg font-extrabold">
          Ticket {index + 1}
        </span>
        {selected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> Selected
          </span>
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            Tap to pick
          </span>
        )}
      </div>
      <div className="pointer-events-none">
        <TambolaTicket ticket={ticket} size="lg" />
      </div>
    </button>
  );
}
