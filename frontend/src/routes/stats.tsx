import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Stats for Nerds — How Tambola Works Under the Hood" },
      {
        name: "description",
        content:
          "A technical look at the Tambola game engine: ticket generation, server authority, real-time WebSocket events, claim validation and persistence.",
      },
      {
        property: "og:title",
        content: "Stats for Nerds — How Tambola Works Under the Hood",
      },
      {
        property: "og:description",
        content:
          "Ticket generation, server authority, STOMP events, claim validation and PostgreSQL persistence — the engineering behind Tambola.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatsPage,
});

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "game-engine", label: "Game Engine" },
  { id: "ticket-generation", label: "Ticket Generation" },
  { id: "server-authority", label: "Server Authority" },
  { id: "real-time", label: "Real-Time Gameplay" },
  { id: "winning", label: "Winning & Validation" },
  { id: "data", label: "Data & Persistence" },
  { id: "tech-stack", label: "Tech Stack" },
];

/* ---------------- primitives ---------------- */

function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p";
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <As
      ref={ref as never}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal-on-scroll", className)}
    >
      {children}
    </As>
  );
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-hairline py-14 sm:py-20"
    >
      <Reveal>
        <p className="font-mono text-[11px] tracking-[0.22em] text-ink-muted uppercase">
          {String(index).padStart(2, "0")} — {title}
        </p>
        <h2 className="mt-4 max-w-2xl font-sans text-3xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Prose({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <p className="max-w-2xl text-[15px] leading-[1.8] text-ink-muted">
        {children}
      </p>
    </Reveal>
  );
}

function KeyList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid max-w-3xl gap-x-10 gap-y-3 sm:grid-cols-2">
      {items.map((it, i) => (
        <Reveal as="li" key={it} delay={i * 50} className="flex gap-3">
          <span className="mt-[9px] h-px w-4 shrink-0 bg-ink/30" />
          <span className="font-mono text-[13px] leading-relaxed text-ink">
            {it}
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

/* ---------------- flow diagram ---------------- */

function FlowNode({
  children,
  strong,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border px-3.5 py-2 text-center font-mono text-[12px] tracking-tight",
        strong
          ? "border-ink bg-ink text-paper"
          : "border-hairline bg-card/60 text-ink dark:bg-transparent",
      )}
    >
      {children}
    </span>
  );
}

function VLine({ delay = 0 }: { delay?: number }) {
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      data-revealed={revealed}
      style={{ animationDelay: `${delay}ms` }}
      className="flow-line my-2 block h-8 w-px bg-ink/30"
      aria-hidden
    />
  );
}

function HLine() {
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      data-revealed={revealed}
      className="hidden h-px flex-1 origin-left scale-x-0 bg-ink/25 transition-transform duration-700 ease-out data-[revealed=true]:scale-x-100 sm:block"
      aria-hidden
    />
  );
}

function EngineFlow() {
  const chain = [
    "Player",
    "Frontend",
    "Spring Boot Backend",
    "Game Engine",
    "PostgreSQL",
  ];
  return (
    <div className="mt-2 border border-hairline p-6 sm:p-10">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        {chain.map((c, i) => (
          <div
            key={c}
            className="flex w-full items-center gap-4 sm:w-auto sm:flex-1 sm:last:flex-none"
          >
            <FlowNode strong={i === 3}>{c}</FlowNode>
            {i < chain.length - 1 && <HLine />}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center sm:items-start sm:pl-[28%]">
        <VLine />
        <FlowNode>WebSocket</FlowNode>
        <VLine delay={120} />
        <FlowNode>All Players</FlowNode>
      </div>
    </div>
  );
}

/* ---------------- animated sample ticket ---------------- */

const SAMPLE: number[][] = [
  [5, 0, 23, 0, 47, 0, 62, 73, 0],
  [0, 14, 0, 35, 0, 55, 0, 79, 81],
  [8, 0, 29, 0, 52, 0, 68, 0, 90],
];

function SampleTicket() {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="mt-8 max-w-2xl border border-hairline p-4 sm:p-6">
      <p className="font-mono text-[11px] tracking-[0.2em] text-ink-muted uppercase">
        3 × 9 · 15 numbers · 5 per row
      </p>
      <div className="mt-4 grid grid-cols-9 gap-1 sm:gap-1.5">
        {SAMPLE.flatMap((row, r) =>
          row.map((n, c) => (
            <span
              key={`${r}-${c}`}
              data-revealed={revealed}
              style={{ animationDelay: `${(r * 9 + c) * 35}ms` }}
              className={cn(
                "cell-in grid aspect-square place-items-center border font-mono text-[11px] tabular-nums sm:text-sm",
                n === 0
                  ? "border-hairline/60 text-ink-muted/40"
                  : "border-hairline bg-card/60 text-ink dark:bg-transparent",
              )}
            >
              {n === 0 ? "0" : n}
            </span>
          )),
        )}
      </div>
      <div className="mt-4 grid grid-cols-9 gap-1 font-mono text-[9px] text-ink-muted sm:gap-1.5 sm:text-[10px]">
        {[
          "1–9",
          "10–19",
          "20–29",
          "30–39",
          "40–49",
          "50–59",
          "60–69",
          "70–79",
          "80–90",
        ].map((r) => (
          <span key={r} className="text-center">
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- claim flow ---------------- */

const CLAIM_STEPS = [
  "Housie pressed",
  "Claim sent to backend",
  "Game pauses",
  "Backend validates ticket",
];

function ClaimFlow() {
  return (
    <div className="mt-2 max-w-xl border border-hairline p-6 sm:p-10">
      <div className="flex flex-col items-start">
        {CLAIM_STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-start">
            <FlowNode strong={i === 0}>{s}</FlowNode>
            <VLine delay={i * 80} />
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <span className="border border-ink px-3.5 py-2 font-mono text-[12px] text-ink">
            VALID → Winner
          </span>
          <span className="border border-dashed border-ink/40 px-3.5 py-2 font-mono text-[12px] text-ink-muted">
            INVALID → Disqualified
          </span>
        </div>
        <VLine delay={360} />
        <FlowNode>Game resumes or ends</FlowNode>
      </div>
    </div>
  );
}

/* ---------------- sidebar ---------------- */

function useActiveSection() {
  const [active, setActive] = useState(SECTIONS[0]!.id);
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function StatsPage() {
  const active = useActiveSection();

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* mobile top nav */}
      <div className="sticky top-0 z-30 border-b border-hairline bg-paper/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <Link
            to="/"
            className="font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase transition-colors hover:text-ink"
          >
            ← Back to home
          </Link>
          <span className="font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase">
            /stats
          </span>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "shrink-0 border px-3 py-1.5 font-mono text-[11px] whitespace-nowrap transition-colors",
                active === s.id
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline text-ink-muted hover:text-ink",
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-12 px-5 sm:px-8 lg:gap-16">
        {/* desktop sidebar */}
        <aside className="hidden w-[230px] shrink-0 lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-between py-14">
            <div>
              <Link
                to="/"
                className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase transition-colors hover:text-ink"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Back to home
              </Link>

              <nav className="mt-12 flex flex-col gap-0.5">
                {SECTIONS.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-center gap-3 py-1.5 font-mono text-[12px] transition-colors"
                  >
                    <span
                      className={cn(
                        "text-[10px] tabular-nums transition-colors",
                        active === s.id ? "text-ink" : "text-ink-muted/50",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "h-px bg-ink transition-all duration-300",
                        active === s.id
                          ? "w-5 opacity-100"
                          : "w-2 opacity-30 group-hover:w-4",
                      )}
                    />
                    <span
                      className={cn(
                        "transition-colors",
                        active === s.id
                          ? "text-ink"
                          : "text-ink-muted group-hover:text-ink",
                      )}
                    >
                      {s.label}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            <p className="font-mono text-[10px] leading-relaxed tracking-[0.14em] text-ink-muted/70 uppercase">
              Tambola
              <br />
              Engineering notes
            </p>
          </div>
        </aside>

        {/* main */}
        <main className="min-w-0 flex-1 pb-24 lg:pb-32">
          <header className="pt-12 pb-4 sm:pt-20 lg:pt-24">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.24em] text-ink-muted uppercase">
                Technical notes
              </p>
              <h1 className="mt-6 font-sans text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-ink">
                Stats for
                <br />
                Nerds
              </h1>
              <p className="mt-7 max-w-xl font-mono text-sm leading-relaxed text-ink-muted">
                How Tambola actually works under the hood.
              </p>
            </Reveal>
          </header>

          <Section id="overview" index={1} title="Overview">
            <Prose>
              The frontend is only the interface. It renders tickets, animates
              numbers and collects taps — nothing more. Every decision that
              matters happens elsewhere.
            </Prose>
            <Prose delay={80}>
              The backend is the heart of the game. It owns game state, calls
              the numbers, generates and validates tickets, resolves claims and
              determines winners. If the browser closed mid-game, the game would
              carry on without it.
            </Prose>
          </Section>

          <Section id="game-engine" index={2} title="Game Engine">
            <Reveal>
              <EngineFlow />
            </Reveal>
            <Prose delay={100}>
              Players never decide whether a number was called or whether a
              claim is valid. Actions travel inward to the engine; results
              travel outward over WebSocket to every connected player at once.
            </Prose>
          </Section>

          <Section id="ticket-generation" index={3} title="Ticket Generation">
            <Prose>
              Every player receives three generated ticket choices before
              entering the game lobby. They pick one; the selection is persisted
              server-side and becomes the only ticket that can ever win for
              them.
            </Prose>
            <KeyList
              items={[
                "3 × 9 Tambola ticket grid",
                "15 numbers per ticket",
                "5 numbers per row",
                "Column-specific number ranges",
                "Backtracking finds valid placements",
                "Empty cells represented as 0",
                "Returned to the client as a matrix",
                "Selected ticket persisted on the server",
              ]}
            />
            <SampleTicket />
          </Section>

          <Section id="server-authority" index={4} title="Server Authority">
            <Reveal>
              <div className="border-y-2 border-ink py-10 sm:py-14">
                <p className="max-w-3xl text-[clamp(1.6rem,4.5vw,2.75rem)] leading-[1.15] font-semibold tracking-tight text-ink">
                  The browser displays the game.
                  <br />
                  The server decides the game.
                </p>
              </div>
            </Reveal>
            <KeyList
              items={[
                "Server generates called numbers",
                "Numbers can never repeat",
                "Server tracks the full call sequence",
                "Server controls game state",
                "Server validates every Housie claim",
                "A client cannot declare itself a winner",
              ]}
            />
          </Section>

          <Section id="real-time" index={5} title="Real-Time Gameplay">
            <Prose>
              REST APIs handle deliberate player actions — creating and joining
              rooms, starting games, claiming Housie. Each is a request with a
              definite answer.
            </Prose>
            <Prose delay={80}>
              WebSocket over STOMP handles everything that happens on its own
              schedule. The server broadcasts events; clients only react.
            </Prose>
            <div className="mt-8 grid max-w-3xl grid-cols-1 border-t border-l border-hairline sm:grid-cols-2 lg:grid-cols-3">
              {[
                "PLAYER_JOINED",
                "GAME_STARTED",
                "NUMBER_CALLED",
                "GAME_PAUSED",
                "CLAIM_RESULT",
                "GAME_RESUMED",
                "GAME_COMPLETED",
              ].map((e, i) => (
                <Reveal
                  key={e}
                  delay={i * 45}
                  className="border-r border-b border-hairline px-4 py-4 font-mono text-[12px] tracking-tight text-ink"
                >
                  {e}
                </Reveal>
              ))}
            </div>
          </Section>

          <Section id="winning" index={6} title="Winning & Validation">
            <Reveal>
              <ClaimFlow />
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-10 font-mono text-[11px] tracking-[0.2em] text-ink-muted uppercase">
                Current winning methods
              </p>
              <ol className="mt-4 max-w-md">
                {[
                  "Early Five",
                  "Top Line",
                  "Middle Line",
                  "Bottom Line",
                  "Full House",
                ].map((m, i) => (
                  <li
                    key={m}
                    className="flex items-baseline gap-4 border-b border-hairline py-3 last:border-b-0"
                  >
                    <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] text-ink">{m}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Section>

          <Section id="data" index={7} title="Data & Persistence">
            <Prose>
              PostgreSQL stores everything required to keep a game alive across
              reconnects and restarts. Ticket matrices are stored as JSONB.
            </Prose>
            <KeyList
              items={[
                "Rooms",
                "Players",
                "Tickets",
                "Games",
                "Called numbers",
                "Claims",
              ]}
            />
          </Section>

          <Section id="tech-stack" index={8} title="Tech Stack">
            <dl className="max-w-3xl">
              {[
                ["Frontend", "React"],
                ["Backend", "Java + Spring Boot"],
                ["Database", "PostgreSQL"],
                ["ORM", "Hibernate / Spring Data JPA"],
                ["Real-time", "WebSocket + STOMP"],
                ["Architecture", "REST APIs + event-driven real-time updates"],
              ].map(([k, v], i) => (
                <Reveal
                  key={k}
                  delay={i * 50}
                  className="grid grid-cols-1 gap-1 border-b border-hairline py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase">
                    {k}
                  </dt>
                  <dd className="font-mono text-[13px] text-ink">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </Section>

          <section className="border-t border-hairline py-20 sm:py-28">
            <Reveal>
              <p className="max-w-4xl text-[clamp(2rem,6.5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-ink">
                Pretty interface.
                <br />
                Serious backend.
              </p>
              <p className="mt-8 max-w-xl font-mono text-[13px] leading-relaxed text-ink-muted">
                Every number, every claim and every winner is decided by the
                game engine — not by the browser.
              </p>
              <Link
                to="/"
                className="group mt-12 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-[12px] tracking-[0.16em] text-ink uppercase"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Back to home
              </Link>
            </Reveal>
          </section>
        </main>
      </div>
    </div>
  );
}
