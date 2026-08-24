import { ArrowRight, RefreshCw } from "lucide-react";
import { TICKET_SETS } from "@/lib/tambola-data";
import { actions, useGame, notify } from "@/lib/game-store";
import { TicketCard } from "./TicketCard";
import { ticketApi } from "@/services";

export function TicketSelection({
  onConfirm,
  loading,
}: {
  onConfirm: () => void;
  loading?: boolean;
}) {
  const setIndex = useGame((s) => s.ticketSetIndex);
  const selected = useGame((s) => s.selectedTicketIndex);
  const generatedTickets = useGame((s) => s.generatedTickets);
  const roomCode = useGame((s) => s.roomCode);
  const playerId = useGame((s) => s.playerId);

  // Use backend-generated tickets if available, otherwise fall back to hardcoded sets
  const tickets = generatedTickets || TICKET_SETS[setIndex]!;

  const handleGetNewTickets = async () => {
    if (!roomCode || !playerId) {
      // Fallback to demo mode (rotate hardcoded tickets)
      actions.rotateTickets();
      return;
    }

    // Fetch new tickets from backend
    try {
      const result = await ticketApi.generateTickets(roomCode, playerId);

      if (result.error) {
        notify(result.error);
        return;
      }

      if (result.data?.tickets) {
        actions.setGeneratedTickets(result.data.tickets);
        notify("New tickets generated!");
      }
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Failed to generate new tickets",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          Choose Your Ticket
        </h1>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Pick your lucky ticket!
        </p>
      </div>

      <div
        key={generatedTickets ? "backend" : setIndex}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {tickets.map((t, i) => (
          <TicketCard
            key={i}
            ticket={t}
            index={i}
            selected={selected === i}
            onSelect={() => actions.selectTicket(i)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleGetNewTickets}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <RefreshCw className="h-4 w-4" /> Get New Tickets
        </button>
        <button
          type="button"
          disabled={selected === null || loading}
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving Ticket...
            </>
          ) : (
            <>
              Select Ticket &amp; Enter Room <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
