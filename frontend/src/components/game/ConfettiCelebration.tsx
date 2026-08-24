import { useEffect, useRef, useState } from "react";

const COLORS = [
  "var(--primary)",
  "var(--gold)",
  "var(--secondary)",
  "var(--gold-soft)",
  "var(--primary)",
];

const DURATION_MS = 2800;
const COUNT = 70;

type Piece = {
  left: number;
  dx: number;
  dy: number;
  spin: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  round: boolean;
};

function buildPieces(): Piece[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const spread = 6 + ((i * 13) % 42);
    return {
      left: 50 + dir * ((i * 7) % 18),
      dx: dir * spread,
      dy: 55 + ((i * 11) % 45),
      spin: (dir === 1 ? 1 : -1) * (360 + ((i * 97) % 720)),
      delay: ((i * 3) % 9) / 20,
      duration: 1.6 + ((i * 7) % 11) / 10,
      size: 5 + ((i * 5) % 6),
      color: COLORS[i % COLORS.length] ?? "var(--gold)",
      round: i % 7 === 0,
    };
  });
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ConfettiCelebration({ active }: { active: boolean }) {
  const [runId, setRunId] = useState<number | null>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    if (active && !wasActive.current) {
      wasActive.current = true;
      if (prefersReducedMotion()) return;
      const id = Date.now();
      setRunId(id);
      const t = setTimeout(() => setRunId(null), DURATION_MS);
      return () => clearTimeout(t);
    }
    if (!active) wasActive.current = false;
    return;
  }, [active]);

  if (runId === null) return null;

  const pieces = buildPieces();

  return (
    <div
      key={runId}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className={
            p.round ? "absolute rounded-full" : "absolute rounded-[1px]"
          }
          style={
            {
              top: "18%",
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 1.8,
              background: p.color,
              opacity: 0,
              ["--dx"]: `${p.dx}vw`,
              ["--dy"]: `${p.dy}vh`,
              ["--spin"]: `${p.spin}deg`,
              animation: `confetti-drift ${p.duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay}s 1 forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
