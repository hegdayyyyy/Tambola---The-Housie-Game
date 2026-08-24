import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SetupShell({
  step,
  total,
  title,
  subtitle,
  onBack,
  children,
}: {
  step?: number;
  total?: number;
  title: string;
  subtitle?: string | undefined;
  onBack?: (() => void) | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-16 sm:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Home
              </Link>
            )}
            {total ? (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: total }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i < (step ?? 1) ? "w-7 bg-primary" : "w-3 bg-border",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="animate-fade-up surface-card p-5 sm:p-7">
            {step && total ? (
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Step {step} of {total}
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {subtitle}
              </p>
            )}
            <div className="mt-7">{children}</div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export function OptionCard({
  selected,
  onClick,
  title,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5",
        selected
          ? "border-primary bg-accent shadow-[var(--shadow-lift)]"
          : "border-border bg-card hover:border-primary/40",
      )}
    >
      <span className="block font-display text-lg font-extrabold">{title}</span>
      {hint && (
        <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
          {hint}
        </span>
      )}
    </button>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border-2 border-border bg-card px-5 py-4 font-display text-xl font-bold text-foreground outline-none transition-colors placeholder:font-sans placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground focus:border-primary"
    />
  );
}
