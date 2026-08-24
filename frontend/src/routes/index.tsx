import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, PartyPopper } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HowToPlay } from "@/components/HowToPlay";
import { WinningMethods } from "@/components/WinningMethods";
import { HeroShowcase } from "@/components/HeroShowcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tambola — The Indian Housie Online" },
      {
        name: "description",
        content:
          "Play Tambola online with friends. Create a room, pick your ticket and let the numbers roll — no accounts, no downloads.",
      },
      { property: "og:title", content: "Tambola — The Indian Housie Online" },
      {
        property: "og:description",
        content: "Bring your friends. Pick your tickets. Let the numbers roll.",
      },
    ],
  }),
  component: Home,
});

function RoomCard({
  title,
  description,
  cta,
  to,
  Icon,
  tone,
  delay,
}: {
  title: string;
  description: string;
  cta: string;
  to: string;
  Icon: typeof PartyPopper;
  tone: "primary" | "gold";
  delay: number;
}) {
  return (
    <Link
      to={to}
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-up surface-card group relative flex flex-col overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] sm:p-5"
    >
      <span
        className={
          tone === "primary"
            ? "grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105"
            : "grid h-11 w-11 place-items-center rounded-xl bg-gold text-gold-foreground transition-transform duration-300 group-hover:scale-105"
        }
      >
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </span>
      <h2 className="mt-3 font-display text-xl font-extrabold sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {description}
      </p>
      <span
        className={
          tone === "primary"
            ? "mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-300 group-hover:translate-x-1 sm:text-sm"
            : "mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background shadow-[var(--shadow-lift)] transition-transform duration-300 group-hover:translate-x-1 sm:text-sm"
        }
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      {/* Full-page hero section */}
      <section className="relative overflow-hidden">
        <div className="dotted-field pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="animate-float-slow pointer-events-none absolute -left-24 top-40 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
        <div className="animate-float-slower pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative flex flex-col">
          <Header />

          <main className="mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8">
            <HeroShowcase>
              <section className="text-center">
                <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase shadow-[var(--shadow-soft)]">
                  Game night, upgraded
                </span>
                <h1 className="animate-fade-up mt-5 font-display text-[clamp(3rem,12vw,8rem)] leading-[0.95] font-extrabold [animation-delay:80ms]">
                  TAMBOLA
                </h1>
                <p className="animate-fade-up mt-1 font-display text-[clamp(1.25rem,3.5vw,2rem)] font-bold text-primary [animation-delay:140ms]">
                  The Indian Housie
                </p>
                <p className="animate-fade-up mx-auto mt-4 max-w-xl text-sm font-medium text-muted-foreground sm:text-base [animation-delay:200ms]">
                  Bring your friends. Pick your tickets. Let the numbers roll.
                </p>
              </section>
            </HeroShowcase>
          </main>
        </div>
      </section>

      {/* Room cards section */}
      <section className="relative mx-auto w-full max-w-7xl px-5 py-4 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <RoomCard
            title="Create Room"
            description="Start a game, choose your winning method and invite your friends."
            cta="Create Room"
            to="/create"
            Icon={PartyPopper}
            tone="primary"
            delay={260}
          />
          <RoomCard
            title="Join Room"
            description="Enter a room code and jump straight into the game."
            cta="Join Room"
            to="/join"
            Icon={KeyRound}
            tone="gold"
            delay={340}
          />
        </div>
      </section>

      <HowToPlay />
      <WinningMethods />
      <Footer />
    </div>
  );
}
