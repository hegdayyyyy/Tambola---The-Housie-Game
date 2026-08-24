import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TicketSelection } from "@/components/TicketSelection";
import { actions, useGame, notify, store } from "@/lib/game-store";
import { ticketApi } from "@/services";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Choose Your Ticket — Tambola" },
      {
        name: "description",
        content:
          "Pick one of three Tambola tickets before you enter the room. Pick your lucky one!",
      },
      { property: "og:title", content: "Choose Your Tambola Ticket" },
      {
        property: "og:description",
        content: "Three tickets, one choice. Pick your lucky ticket!",
      },
    ],
  }),
  component: TicketSelectionPage,
});

function TicketSelectionPage() {
  const navigate = useNavigate();
  const name = useGame((s) => s.playerName);
  const roomCode = useGame((s) => s.roomCode);
  const playerId = useGame((s) => s.playerId);
  const [loading, setLoading] = useState(false);
  const [fetchingTickets, setFetchingTickets] = useState(false);

  useEffect(() => {
    if (!name || !roomCode || !playerId) {
      navigate({ to: "/" });
      return;
    }

    // Fetch tickets from backend on mount
    const fetchTickets = async () => {
      setFetchingTickets(true);
      try {
        const result = await ticketApi.generateTickets(roomCode, playerId);

        if (result.error) {
          notify(result.error);
          setFetchingTickets(false);
          return;
        }

        if (result.data?.tickets) {
          // Store generated tickets in game state
          actions.setGeneratedTickets(result.data.tickets);
        }
      } catch (err) {
        notify(
          err instanceof Error ? err.message : "Failed to generate tickets",
        );
      } finally {
        setFetchingTickets(false);
      }
    };

    fetchTickets();
  }, [name, roomCode, playerId, navigate]);

  const handleConfirm = async () => {
    if (!roomCode || !playerId) {
      notify("Missing room or player information");
      return;
    }

    const selectedIndex = store.getState().selectedTicketIndex;
    const generatedTickets = store.getState().generatedTickets;

    if (selectedIndex === null || !generatedTickets) {
      notify("Please select a ticket");
      return;
    }

    const selectedTicket = generatedTickets[selectedIndex];
    if (!selectedTicket) {
      notify("Invalid ticket selection");
      return;
    }

    setLoading(true);
    try {
      // Send selected ticket to backend
      const result = await ticketApi.selectTicket(roomCode, playerId, {
        ticketData: selectedTicket,
      });

      if (result.error) {
        notify(result.error);
        setLoading(false);
        return;
      }

      if (result.data) {
        // Store ticket ID and ticket data using proper store actions
        actions.setTicketId(result.data.ticketId);
        actions.setTicket(result.data.ticketData);
        actions.resetGameState();

        notify("Ticket selected!");

        // Navigate to lobby
        navigate({ to: "/lobby" });
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to select ticket");
      setLoading(false);
    }
  };

  if (fetchingTickets) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="hero-glow pointer-events-none fixed inset-0" />
        <div className="relative">
          <Header />
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-lg font-semibold">
                Generating your tickets...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="hero-glow pointer-events-none fixed inset-0" />
      <div className="relative">
        <Header />
        <TicketSelection onConfirm={handleConfirm} loading={loading} />
      </div>
    </div>
  );
}
