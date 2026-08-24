import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useGame } from "@/lib/game-store";

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

export function RoomInfoBar() {
  const code = useGame((s) => s.roomCode);
  const method = useGame((s) => s.winningMethod);
  const mode = useGame((s) => s.callMode);
  const speed = useGame((s) => s.callSpeed);
  const players = useGame((s) => s.players);
  const size = useGame((s) => s.roomSize);
  const [copied, setCopied] = useState(false);

  return (
    <div className="surface-card grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 sm:p-5">
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Room Code
        </p>
        <div className="mt-0.5 flex min-w-0 items-center gap-2">
          <span className="truncate font-display text-lg font-extrabold tracking-wider text-primary">
            {code}
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label="Copy room code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      <Cell label="Winning Method" value={method} />
      <Cell
        label="Call Mode"
        value={mode === "automatic" ? `Automatic · Every ${speed}s` : "Manual"}
      />
      <Cell label="Players" value={`${players.length} / ${size} Players`} />
    </div>
  );
}
