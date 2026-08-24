import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Crown, Target, XCircle } from "lucide-react";
import { GameTopBar } from "@/components/game/GameTopBar";
import { GameTicket } from "@/components/game/GameTicket";
import { TheBoard } from "@/components/game/TheBoard";
import {
  CalledNumbersCard,
  CurrentNumberCard,
  PlayersCard,
} from "@/components/game/SidePanels";
import { ClaimModal } from "@/components/ClaimModal";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { actions, useGame, notify } from "@/lib/game-store";
import {
  webSocketService,
  gameApi,
  claimApi,
  type AnyGameEvent,
} from "@/services";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Live Game — Tambola" },
      {
        name: "description",
        content:
          "Numbers rolling, tickets marking, Housie claims validating — the live Tambola table.",
      },
      { property: "og:title", content: "Tambola Live Game" },
      {
        property: "og:description",
        content: "Mark your ticket and claim Housie before anyone else.",
      },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  const navigate = useNavigate();
  const ticket = useGame((s) => s.ticket);
  const marked = useGame((s) => s.marked);
  const called = useGame((s) => s.calledNumbers);
  const paused = useGame((s) => s.paused);
  const finished = useGame((s) => s.finished);
  const started = useGame((s) => s.started);
  const mode = useGame((s) => s.callMode);
  const name = useGame((s) => s.playerName);
  const roomCode = useGame((s) => s.roomCode);
  const playerId = useGame((s) => s.playerId);
  const isHost = useGame((s) => s.isHost);
  const players = useGame((s) => s.players);

  // Check if current player is disqualified
  const currentPlayer = players.find((p) => p.isYou);
  const isDisqualified = currentPlayer?.status === "disqualified";

  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [claiming, setClaiming] = useState(false);
  const [callingNumber, setCallingNumber] = useState(false);

  // Re-enable call button when a new number is received via WebSocket
  useEffect(() => {
    if (callingNumber && called.length > 0) {
      // Number was just called and received via WebSocket
      setCallingNumber(false);
    }
  }, [called.length, callingNumber]);

  useEffect(() => {
    if (!ticket || !roomCode) {
      navigate({ to: "/" });
      return;
    }

    // Connect to WebSocket if not already connected
    if (
      !webSocketService.isConnected() ||
      webSocketService.getRoomCode() !== roomCode
    ) {
      webSocketService.connect(
        roomCode,
        handleWebSocketEvent,
        () => console.log("Game WebSocket connected"),
        () => console.log("Game WebSocket disconnected"),
      );
    }

    // Backend handles all number calling (manual and automatic)
    // Frontend only receives NUMBER_CALLED events via WebSocket
  }, [ticket, roomCode, navigate]);

  const handleWebSocketEvent = (event: AnyGameEvent) => {
    switch (event.type) {
      case "NUMBER_CALLED":
        actions.handleNumberCalled(event.number);
        break;
      case "GAME_PAUSED":
        actions.handleGamePaused(event.playerName);
        break;
      case "CLAIM_RESULT":
        actions.handleClaimResult(
          event.playerId,
          event.playerName,
          event.claimResult,
          event.winnerId,
          event.winnerName,
        );
        break;
      case "GAME_RESUMED":
        actions.handleGameResumed();
        break;
      case "GAME_COMPLETED":
        // Check if this is a no-winner scenario (no winnerId means all players disqualified)
        if (event.winnerId === undefined || event.winnerId === null) {
          actions.handleGameCompletedNoWinner();
        } else {
          actions.handleGameCompleted(event.winnerId, event.winnerName);
        }
        break;
      default:
        // Ignore other events
        break;
    }
  };

  const handleClaimHousie = async () => {
    if (
      !roomCode ||
      !playerId ||
      claiming ||
      paused ||
      finished ||
      isDisqualified
    ) {
      return;
    }

    setClaiming(true);

    // Immediately show validation modal with player name
    actions.claimHousie(name || "You");

    try {
      const result = await claimApi.submitClaim(roomCode, playerId);

      if (result.error) {
        notify(result.error);
        // Reset claim state on API error
        actions.dismissInvalid();
        setClaiming(false);
        return;
      }

      // WebSocket will handle the rest via GAME_PAUSED and CLAIM_RESULT events
      // The validation modal will stay visible until WebSocket events arrive
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to submit claim");
      // Reset claim state on network error
      actions.dismissInvalid();
      setClaiming(false);
    } finally {
      // Keep claiming button disabled until WebSocket event arrives
      setTimeout(() => setClaiming(false), 2000);
    }
  };

  const handleCallNumber = async () => {
    if (
      !roomCode ||
      !playerId ||
      !isHost ||
      mode !== "manual" ||
      callingNumber
    ) {
      return;
    }

    setCallingNumber(true);
    try {
      const result = await gameApi.callNumber(roomCode, playerId);

      if (result.error) {
        notify(result.error);
        setCallingNumber(false);
        return;
      }

      // WebSocket will broadcast NUMBER_CALLED event
      // Keep button disabled until WebSocket updates the number
      // Button will re-enable automatically when state updates
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to call number");
      setCallingNumber(false);
    }
  };

  if (!ticket) return null;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <GameTopBar
          theme={theme}
          onToggleTheme={() =>
            setTheme((t) => (t === "dark" ? "light" : "dark"))
          }
        />

        <main className="mx-auto w-full max-w-7xl px-5 pt-8 pb-16 sm:px-8">
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
            <div className="flex flex-col gap-4 lg:col-start-1 lg:row-span-2">
              <CurrentNumberCard
                onCallNumber={handleCallNumber}
                calling={callingNumber}
              />
              <CalledNumbersCard />
              <PlayersCard />
            </div>

            <section className="relative rounded-3xl border border-border/60 bg-card p-5 text-card-foreground sm:p-7 lg:col-start-2 lg:row-start-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  My ticket
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-success uppercase">
                  <span className="h-2 w-2 rounded-full bg-success" /> Tap to
                  mark
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-card-foreground">
                {name || "You"}
              </h2>

              <div className="mt-5">
                <GameTicket
                  ticket={ticket}
                  marked={marked}
                  disabled={finished}
                  onToggle={actions.toggleMark}
                />
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Target className="h-4 w-4" />
                {marked.length} marked · {called.length} numbers called
              </p>

              <button
                type="button"
                disabled={paused || finished || claiming || isDisqualified}
                onClick={handleClaimHousie}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 font-display text-xl font-extrabold tracking-wide text-gold-foreground shadow-[var(--shadow-gold)] transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {isDisqualified ? (
                  <>
                    <XCircle className="h-5 w-5" /> DISQUALIFIED
                  </>
                ) : claiming ? (
                  <>
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Crown className="h-5 w-5" /> HOUSIE!
                  </>
                )}
              </button>
            </section>

            <div className="lg:col-start-2 lg:row-start-2">
              <TheBoard />
            </div>
          </div>
        </main>

        <Footer />

        <ClaimModal />
        <Toast />
      </div>
    </div>
  );
}
