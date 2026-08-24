import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-store";

interface CurrentNumberCardProps {
  onCallNumber?: () => void;
  calling?: boolean;
}

export function CurrentNumberCard({
  onCallNumber,
  calling,
}: CurrentNumberCardProps) {
  const called = useGame((s) => s.calledNumbers);
  const mode = useGame((s) => s.callMode);
  const isHost = useGame((s) => s.isHost);
  const paused = useGame((s) => s.paused);
  const finished = useGame((s) => s.finished);
  const current = called.at(-1);

  return (
    <section className="rounded-3xl border border-border/40 bg-accent/60 p-6 text-center dark:border-transparent dark:bg-primary">
      <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] uppercase">
        <span className="text-muted-foreground dark:text-primary-foreground/70">
          Current number
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground dark:text-primary-foreground/70">
          <span className="h-2 w-2 rounded-full bg-success" />
          {mode === "automatic" ? "Auto mode" : "Manual mode"}
        </span>
      </div>

      <div
        key={current ?? "none"}
        className="animate-pop-in mt-6 font-display text-[clamp(3.5rem,10vw,6rem)] leading-none font-extrabold tabular-nums text-gold"
      >
        {current ?? "—"}
      </div>

      {mode === "manual" && isHost ? (
        <button
          type="button"
          onClick={onCallNumber}
          disabled={paused || finished || called.length >= 90 || calling}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 font-display text-lg font-extrabold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-45 dark:bg-card dark:text-primary"
        >
          {calling ? (
            <>
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Calling...
            </>
          ) : (
            "Call Number"
          )}
        </button>
      ) : (
        <p className="mt-6 text-xs font-semibold text-muted-foreground dark:text-primary-foreground/70">
          {paused || finished
            ? "Calling paused"
            : mode === "manual"
              ? "Numbers are called by creator"
              : "Numbers are called automatically"}
        </p>
      )}
    </section>
  );
}

export function CalledNumbersCard() {
  const called = useGame((s) => s.calledNumbers);
  const recent = [...called].reverse().slice(0, 12);

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-5 text-card-foreground">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Called numbers
        </p>
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {called.length} / 90
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {recent.length === 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            No numbers yet.
          </p>
        )}
        {recent.map((n, i) => (
          <span
            key={n}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full text-xs font-bold tabular-nums",
              i === 0
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground",
            )}
          >
            {n}
          </span>
        ))}
      </div>
    </section>
  );
}

export function PlayersCard() {
  const players = useGame((s) => s.players);

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-5 text-card-foreground">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Players
        </p>
        <p className="text-xs font-semibold text-muted-foreground">
          {players.length}
        </p>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {players.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-display text-xs font-extrabold text-primary">
              {p.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 truncate text-sm font-bold text-card-foreground">
                {p.isYou ? p.name : p.name}
                {p.isHost && (
                  <Crown
                    className="h-3.5 w-3.5 text-gold"
                    fill="currentColor"
                  />
                )}
              </span>
              {p.isHost && (
                <span className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  Creator
                </span>
              )}
            </span>
            <span
              className={cn(
                "text-[10px] font-bold tracking-[0.14em] uppercase",
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
                  ? "Out"
                  : "Playing"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
