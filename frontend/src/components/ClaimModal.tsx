import { useNavigate } from "@tanstack/react-router";
import { Loader2, Trophy, XCircle, AlertCircle } from "lucide-react";
import { actions, useGame, notify, store } from "@/lib/game-store";
import { ConfettiCelebration } from "./game/ConfettiCelebration";
import { gameApi } from "@/services";
import { useEffect } from "react";

function Backdrop({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-black/50 px-5 backdrop-blur-sm ${className}`}
    >
      <div className="animate-pop-in w-full max-w-md rounded-[2rem] border border-gray-300 bg-white p-8 text-center shadow-[var(--shadow-lift)]">
        {children}
      </div>
    </div>
  );
}

export function ClaimModal() {
  const phase = useGame((s) => s.claimPhase);
  const claimant = useGame((s) => s.claimant);
  const method = useGame((s) => s.winningMethod);
  const roomCode = useGame((s) => s.roomCode);
  const navigate = useNavigate();

  // Auto-resume after 3 seconds when invalid - must be called at top level
  useEffect(() => {
    if (phase === "invalid") {
      const timer = setTimeout(() => {
        handleContinueGame();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, roomCode]);

  if (phase === "idle") return null;

  const handleContinueGame = async () => {
    // Call backend to resume the game
    try {
      const result = await gameApi.resumeGame(roomCode);
      if (result.error) {
        notify(result.error);
      }
      // Frontend state will be updated via WebSocket GAME_RESUMED event
      // If WebSocket doesn't arrive, manually dismiss after a short delay
      setTimeout(() => {
        if (store.getState().claimPhase === "invalid") {
          actions.dismissInvalid();
        }
      }, 500);
    } catch (err) {
      console.error("Failed to resume game:", err);
      notify("Failed to resume game. Please try again.");
      // Manually dismiss anyway to avoid stuck modal
      actions.dismissInvalid();
    }
  };

  if (phase === "validating") {
    return (
      <Backdrop>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-100 animate-pulse">
          <div className="relative grid h-10 w-10 place-items-center">
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-yellow-500 border-t-blue-600" />
            <span className="h-4 w-4 rounded-full bg-yellow-500" />
          </div>
        </div>
        <h2 className="mt-6 font-display text-2xl font-extrabold text-gray-900">
          {claimant} claimed Housie!
        </h2>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Validating ticket...
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-1/3 animate-[shimmer_1.4s_linear_infinite] rounded-full bg-[linear-gradient(90deg,#2563eb,#fbbf24,#2563eb)] bg-[length:200%_100%]" />
        </div>
        <p className="mt-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-[11px] font-bold tracking-widest text-blue-600 uppercase">
          ⏸ Game Paused
        </p>
      </Backdrop>
    );
  }

  if (phase === "invalid") {
    return (
      <Backdrop>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-100 text-red-600">
          <XCircle className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-extrabold text-red-600">
          Invalid Claim!
        </h2>
        <p className="mt-3 text-base font-semibold text-gray-900">
          {claimant} has been disqualified.
        </p>
        <p className="mt-2 text-sm font-medium text-gray-700">
          Your ticket didn't match the winning criteria.
        </p>
        <div className="mt-6 rounded-xl bg-gray-100 px-4 py-3 border border-gray-300">
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            ↻ Resuming game in 3 seconds...
          </p>
        </div>
        <button
          type="button"
          onClick={handleContinueGame}
          className="mt-7 w-full rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:translate-y-0"
        >
          Continue Game
        </button>
      </Backdrop>
    );
  }

  if (phase === "no_winner") {
    return (
      <Backdrop>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gray-200 text-gray-600">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-extrabold text-gray-900">
          No Winner!
        </h2>
        <p className="mt-3 text-base font-semibold text-gray-700">
          All players have been disqualified.
        </p>
        <p className="mt-2 text-sm font-medium text-gray-600">
          No valid Housie claim was made.
        </p>
        <div className="mt-6 rounded-xl bg-amber-100 px-4 py-3 border border-amber-300">
          <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            🎰 Better luck next time!
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            actions.reset();
            navigate({ to: "/" });
          }}
          className="mt-7 w-full rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:translate-y-0"
        >
          Back to Home
        </button>
      </Backdrop>
    );
  }

  return (
    <>
      <Backdrop>
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-yellow-400 text-yellow-900">
          <Trophy className="h-12 w-12" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-extrabold text-yellow-600">
          🎉 HOUSIE! 🎉
        </h2>

        <p className="mt-4 text-xl font-bold text-gray-900">
          {claimant} Wins!
        </p>
        <p className="mt-2 text-base font-semibold text-gray-700">
          {method} Housie Claimed
        </p>
        <p className="mt-4 text-sm font-medium text-gray-600">
          Congratulations! 🏆
        </p>
        <button
          type="button"
          onClick={() => {
            actions.reset();
            navigate({ to: "/" });
          }}
          className="mt-8 w-full rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-bold text-gray-900 shadow-lg transition-all hover:bg-yellow-500 active:translate-y-0"
        >
          Back to Home
        </button>
      </Backdrop>
    </>
  );
}
