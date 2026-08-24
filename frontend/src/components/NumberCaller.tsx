import { useEffect, useState } from "react";
import { Megaphone, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-store";
import { NumberHistory } from "./NumberHistory";

interface NumberCallerProps {
  onCallNumber?: () => void;
  calling?: boolean;
}

export function NumberCaller({ onCallNumber, calling }: NumberCallerProps) {
  const called = useGame((s) => s.calledNumbers);
  const isHost = useGame((s) => s.isHost);
  const mode = useGame((s) => s.callMode);
  const speed = useGame((s) => s.callSpeed);
  const paused = useGame((s) => s.paused);
  const finished = useGame((s) => s.finished);
  const current = called.at(-1);

  const [countdown, setCountdown] = useState<number>(speed);
  useEffect(() => {
    if (mode !== "automatic" || paused || finished) return;
    setCountdown(speed);
    const t = setInterval(
      () => setCountdown((c) => (c <= 1 ? speed : c - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [mode, speed, paused, finished, called.length]);

  return (
    <section className="surface-card flex h-full flex-col gap-5 p-5 sm:p-6">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-center text-primary-foreground">
        <div className="dotted-field pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative">
          <div
            key={current ?? "none"}
            className="animate-pop-in font-sans text-[clamp(4rem,14vw,7rem)] leading-none font-extrabold tabular-nums text-gold"
          >
            {current ?? "—"}
          </div>
          <p className="mt-2 text-xs font-bold tracking-[0.3em] uppercase opacity-80">
            Current Number
          </p>
        </div>
      </div>

      <NumberHistory called={called} />

      <div className="mt-auto">
        {mode === "manual" ? (
          isHost ? (
            <button
              type="button"
              onClick={onCallNumber}
              disabled={paused || finished || called.length >= 90 || calling}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 font-display text-lg font-extrabold text-gold-foreground shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 disabled:opacity-45 disabled:hover:translate-y-0"
            >
              {calling ? (
                <>
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Calling...
                </>
              ) : (
                <>
                  <Megaphone className="h-5 w-5" /> CALL NUMBER
                </>
              )}
            </button>
          ) : (
            <p className="rounded-2xl bg-muted px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">
              The host is calling the numbers.
            </p>
          )
        ) : (
          <div className="rounded-2xl border border-border bg-accent/60 px-4 py-3.5 text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-bold tracking-wide text-primary uppercase">
              <Timer
                className={cn(
                  "h-4 w-4",
                  !paused &&
                    !finished &&
                    "animate-spin [animation-duration:3s]",
                )}
              />
              Auto Calling
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {paused || finished ? "Paused" : `Next number in ${countdown}s`}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
                style={{
                  width:
                    paused || finished
                      ? "0%"
                      : `${((speed - countdown + 1) / speed) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
