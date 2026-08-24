import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoomInfoBar } from "@/components/RoomInfoBar";
import { PlayerList } from "@/components/PlayerList";
import { TambolaTicket } from "@/components/TambolaTicket";
import { Toast } from "@/components/Toast";
import { actions, useGame, notify, store } from "@/lib/game-store";
import {
  roomApi,
  gameApi,
  webSocketService,
  type AnyGameEvent,
} from "@/services";

export const Route = createFileRoute("/lobby")({
  head: () => ({
    meta: [
      { title: "Game Lobby — Tambola" },
      {
        name: "description",
        content:
          "Wait for your friends to join, review the room settings and start the game.",
      },
      { property: "og:title", content: "Tambola Game Lobby" },
      {
        property: "og:description",
        content: "Room settings, player list and the start button.",
      },
    ],
  }),
  component: LobbyPage,
});

function LobbyPage() {
  const navigate = useNavigate();
  const ticket = useGame((s) => s.ticket);
  const players = useGame((s) => s.players);
  const isHost = useGame((s) => s.isHost);
  const roomCode = useGame((s) => s.roomCode);
  const playerId = useGame((s) => s.playerId);
  const playerName = useGame((s) => s.playerName);
  const started = useGame((s) => s.started);

  const [loading, setLoading] = useState(false);
  const [fetchingRoom, setFetchingRoom] = useState(true);
  const canStart = players.length >= 2;

  useEffect(() => {
    if (!ticket || !roomCode || !playerId) {
      navigate({ to: "/" });
      return;
    }

    // Fetch room details to get current player list
    const fetchRoomDetails = async () => {
      try {
        const result = await roomApi.getRoomDetails(roomCode);
        if (result.data) {
          // Build player list from backend
          const backendPlayers = result.data.players.map((p) => ({
            id: String(p.playerId),
            name: p.playerName,
            isHost: p.isCreator,
            isYou: p.playerId === playerId,
            status: p.isDisqualified
              ? ("disqualified" as const)
              : ("active" as const),
          }));

          // Update players in store using the actions
          actions.setPlayers(backendPlayers);
        }
      } catch (err) {
        notify(
          err instanceof Error ? err.message : "Failed to fetch room details",
        );
      } finally {
        setFetchingRoom(false);
      }
    };

    fetchRoomDetails();

    // Connect to WebSocket
    webSocketService.connect(
      roomCode,
      handleWebSocketEvent,
      () => console.log("WebSocket connected"),
      () => console.log("WebSocket disconnected"),
    );

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, [ticket, roomCode, playerId, navigate]);

  // Auto-navigate to game when game starts
  useEffect(() => {
    if (started) {
      navigate({ to: "/game" });
    }
  }, [started, navigate]);

  const handleWebSocketEvent = (event: AnyGameEvent) => {
    switch (event.type) {
      case "PLAYER_JOINED":
        actions.handlePlayerJoined(event.playerId, event.playerName);
        break;
      case "GAME_STARTED":
        actions.handleGameStarted(event.gameId);
        // Navigation handled by useEffect above
        break;
      default:
        // Ignore other events in lobby
        break;
    }
  };

  const handleStartGame = async () => {
    if (!roomCode || !playerId) {
      notify("Missing room or player information");
      return;
    }

    setLoading(true);
    try {
      const result = await gameApi.startGame(roomCode, playerId);

      if (result.error) {
        // Provide friendly error message for minimum players
        if (
          result.error.toLowerCase().includes("player") ||
          result.error.toLowerCase().includes("minimum") ||
          result.status === 400
        ) {
          notify("At least 2 players are required to start the game.");
        } else {
          notify(result.error);
        }
        setLoading(false);
        return;
      }

      if (result.data) {
        actions.setGameId(result.data.gameId);
        actions.handleGameStarted(result.data.gameId);
        // WebSocket will broadcast to others, navigation handled by useEffect
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to start game");
      setLoading(false);
    }
  };

  if (!ticket || fetchingRoom) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative">
          <Header />
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-lg font-semibold">Loading lobby...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="relative">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          <div className="animate-fade-up">
            <RoomInfoBar />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="surface-card animate-fade-up p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-extrabold">
                    Waiting for players...
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground">
                    The game begins as soon as the host starts it.
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                  Your Ticket
                </p>
                <TambolaTicket ticket={ticket} />
              </div>

              <div className="mt-7">
                {isHost ? (
                  <>
                    <button
                      type="button"
                      disabled={!canStart || loading}
                      onClick={handleStartGame}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-display text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 sm:w-auto sm:px-10"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" fill="currentColor" /> Start
                          Game
                        </>
                      )}
                    </button>
                    {!canStart && !loading && (
                      <p className="mt-3 text-sm font-semibold text-destructive">
                        Minimum 2 players required to start
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-2xl bg-accent px-5 py-4 text-center text-sm font-bold text-primary">
                    Waiting for host to start...
                  </div>
                )}
              </div>
            </section>

            <div className="animate-fade-up [animation-delay:100ms]">
              <PlayerList />
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <Toast />
    </div>
  );
}
