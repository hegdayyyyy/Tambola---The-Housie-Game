import { CheckCircle2, Hand, Megaphone, Ticket, Users } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const STEPS = [
  {
    n: "01",
    title: "Create or Join",
    body: "Create a room or enter your friend's room code.",
    Icon: Users,
  },
  {
    n: "02",
    title: "Pick Your Ticket",
    body: "Choose one of three randomly generated tickets.",
    Icon: Ticket,
  },
  {
    n: "03",
    title: "Call the Numbers",
    body: "The creator can manually call numbers or enable automatic calling.",
    Icon: Megaphone,
  },
  {
    n: "04",
    title: "Mark Your Ticket",
    body: "Watch the numbers and mark them manually on your ticket.",
    Icon: Hand,
  },
  {
    n: "05",
    title: "Claim Housie",
    body: "Think you've completed a winning pattern? Press Housie and let the system validate your claim.",
    Icon: CheckCircle2,
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const { ref, revealed } = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-revealed={revealed}
      style={{ transitionDelay: `${index * 80}ms` }}
      className="reveal-on-scroll surface-card group relative overflow-hidden p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
    >
      <span className="pointer-events-none absolute -top-4 right-3 font-display text-6xl font-extrabold text-accent transition-transform duration-500 group-hover:-translate-y-1">
        {step.n}
      </span>
      <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
        <step.Icon className="h-6 w-6" strokeWidth={2.2} />
      </span>
      <h3 className="relative mt-5 font-display text-xl font-extrabold">
        {step.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {step.body}
      </p>
    </li>
  );
}

export function HowToPlay() {
  return (
    <section
      id="how-to-play"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8"
    >
      <div className="text-center">
        <span className="inline-flex rounded-full bg-accent px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase">
          The Basics
        </span>
        <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          How to Play
        </h2>
        <p className="mt-3 text-base font-medium text-muted-foreground">
          Simple rules. Big excitement.
        </p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => (
          <StepCard key={s.n} step={s} index={i} />
        ))}
      </ul>
    </section>
  );
}
