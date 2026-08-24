import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer
      id="about"
      className="relative overflow-hidden border-t border-border bg-card"
    >
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-5 py-8 text-center sm:px-8">
        {/* Tagline */}
        <div className="max-w-2xl">
          <p className="font-display text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
            <span className="text-black">Pretty interface.</span>{" "}
            <span className="text-black">Serious backend.</span>
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Every number, every claim and every winner is decided by the game
            engine — not by the browser.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-semibold">
          <a
            href="/#how-to-play"
            className="text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            How to Play
          </a>
          <span className="hidden text-border sm:inline" aria-hidden>
            ·
          </span>
          <Link
            to="/create"
            className="text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Create Room
          </Link>
          <span className="hidden text-border sm:inline" aria-hidden>
            ·
          </span>
          <Link
            to="/join"
            className="text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Join Room
          </Link>
          <span className="hidden text-border sm:inline" aria-hidden>
            ·
          </span>
          <Link
            to="/stats"
            className="text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Stats for nerds
          </Link>
        </nav>
      </div>
    </footer>
  );
}
