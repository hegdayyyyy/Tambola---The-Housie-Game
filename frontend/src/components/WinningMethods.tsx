import { useReveal } from "@/hooks/use-reveal";

type Pattern = boolean[][];

const EMPTY: Pattern = [
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
];

function row(i: number): Pattern {
  return EMPTY.map((r, ri) => r.map(() => ri === i));
}

const EARLY_FIVE: Pattern = [
  [true, false, true, false, false],
  [false, true, false, false, true],
  [true, false, false, false, false],
];

const FULL_HOUSE: Pattern = [
  [true, true, true, true, true],
  [true, true, true, true, true],
  [true, true, true, true, true],
];

const METHODS = [
  {
    title: "Early Five",
    body: "The first player to mark any five numbers on their ticket.",
    pattern: EARLY_FIVE,
  },
  {
    title: "Top Line",
    body: "Mark every number in the first row of your ticket.",
    pattern: row(0),
  },
  {
    title: "Middle Line",
    body: "Mark every number in the second row of your ticket.",
    pattern: row(1),
  },
  {
    title: "Bottom Line",
    body: "Mark every number in the third row of your ticket.",
    pattern: row(2),
  },
  {
    title: "Full House",
    body: "Mark all fifteen numbers on your ticket. The biggest prize of the night.",
    pattern: FULL_HOUSE,
  },
];

function MiniTicket({ pattern }: { pattern: Pattern }) {
  return (
    <div className="grid w-fit grid-cols-5 gap-1">
      {pattern.flat().map((on, i) => (
        <span
          key={i}
          className={
            on
              ? "h-4 w-6 rounded-[4px] bg-gold sm:h-5 sm:w-7"
              : "h-4 w-6 rounded-[4px] bg-muted sm:h-5 sm:w-7"
          }
        />
      ))}
    </div>
  );
}

function MethodCard({
  method,
  index,
}: {
  method: (typeof METHODS)[number];
  index: number;
}) {
  const { ref, revealed } = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-revealed={revealed}
      style={{ transitionDelay: `${index * 80}ms` }}
      className="reveal-on-scroll surface-card flex flex-col gap-4 p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
    >
      <MiniTicket pattern={method.pattern} />
      <div>
        <h3 className="font-display text-xl font-extrabold">{method.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {method.body}
        </p>
      </div>
    </li>
  );
}

export function WinningMethods() {
  return (
    <section
      id="winning-methods"
      className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-20 sm:px-8"
    >
      <div className="text-center">
        <span className="inline-flex rounded-full bg-gold px-4 py-1.5 text-xs font-bold tracking-widest text-gold-foreground uppercase">
          Five ways to win
        </span>
        <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
          Winning Methods
        </h2>
        <p className="mt-3 text-base font-medium text-muted-foreground">
          Call Housie the moment your pattern is complete.
        </p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {METHODS.map((m, i) => (
          <MethodCard key={m.title} method={m} index={i} />
        ))}
      </ul>
    </section>
  );
}
