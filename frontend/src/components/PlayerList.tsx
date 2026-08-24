import { Crown, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-store";

export function PlayerList({ compact = false }: { compact?: boolean }) {
  const players = useGame((s) => s.players);

  return (
    <section className={cn("surface-card p-5", compact && "p-4")}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-extrabold">Players</h3>
        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary">
          {players.length}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {players.map((p) => (
          <li
            key={p.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-300",
              p.status === "winner" && "border-gold bg-gold-soft",
              p.status === "disqualified" &&
                "border-destructive/30 bg-destructive/5",
              p.status === "active" && "border-border bg-card",
            )}
          >
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold",
                p.status === "winner"
                  ? "bg-gold text-gold-foreground"
                  : p.status === "disqualified"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-accent text-primary",
              )}
            >
              {p.status === "winner" ? (
                <Trophy className="h-4 w-4" />
              ) : (
                p.name.charAt(0).toUpperCase()
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-sm font-semibold">
                  {p.isYou ? `You — ${p.name}` : p.name}
                </span>
                {p.isHost && (
                  <Crown
                    className="h-3.5 w-3.5 shrink-0 text-gold"
                    fill="currentColor"
                  />
                )}
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  p.status === "winner"
                    ? "text-gold-foreground"
                    : p.status === "disqualified"
                      ? "text-destructive"
                      : "text-success",
                )}
              >
                {p.status === "winner"
                  ? "Winner"
                  : p.status === "disqualified"
                    ? "Disqualified"
                    : "In game"}
              </span>
            </span>
            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full",
                p.status === "winner"
                  ? "bg-gold"
                  : p.status === "disqualified"
                    ? "bg-destructive"
                    : "bg-success",
              )}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
