import { useGame } from "@/lib/game-store";

export function Toast() {
  const toast = useGame((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-5">
      <div className="animate-pop-in rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[var(--shadow-lift)]">
        {toast}
      </div>
    </div>
  );
}
