import { useState } from "react";
import { Check, Copy, Moon, Sun, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";

export function GameTopBar({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const code = useGame((s) => s.roomCode);
  const method = useGame((s) => s.winningMethod);
  const mode = useGame((s) => s.callMode);
  const speed = useGame((s) => s.callSpeed);
  const players = useGame((s) => s.players);
  const size = useGame((s) => s.roomSize);
  const [copied, setCopied] = useState(false);

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-8 gap-y-4 border-b border-border/40 px-5 py-5 sm:px-8">
      <Link to="/" className="shrink-0">
        <p className="font-display text-xl font-extrabold tracking-[0.18em] text-foreground">
          TAMBOLA
        </p>
        <p className="text-[11px] font-medium text-muted-foreground">
          The Indian Housie
        </p>
      </Link>

      <div className="flex min-w-0 items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Room code
        </span>
        <span className="font-display text-lg font-extrabold tracking-[0.12em] text-foreground">
          {code}
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/10 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-primary dark:bg-transparent"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Winning method
          </p>
          <p className="text-sm font-semibold text-foreground">{method}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Caller
          </p>
          <p className="text-sm font-semibold text-foreground">
            {mode === "automatic" ? `Auto · ${speed} sec` : "Manual"}
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-muted-foreground" />
          {players.length} / {size}
        </p>
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-[11px] font-bold tracking-[0.16em] text-foreground uppercase transition-colors hover:bg-accent hover:text-primary"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 text-gold" /> Light
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-primary" /> Dark
            </>
          )}
        </button>
      </div>
    </header>
  );
}
