import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PrimaryButton, SetupShell, TextField } from "@/components/SetupShell";
import { actions, useGame, notify } from "@/lib/game-store";
import {
  roomApi,
  mapWinningMethodFromBackend,
  mapCallModeFromBackend,
} from "@/services";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join a Tambola Room — Tambola" },
      {
        name: "description",
        content:
          "Enter your friend's room code, pick a ticket and jump straight into the game.",
      },
      { property: "og:title", content: "Join a Tambola Room" },
      {
        property: "og:description",
        content:
          "Enter a room code, choose your ticket and play Housie with friends.",
      },
    ],
  }),
  component: JoinRoomPage,
});

function JoinRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(useGame((s) => s.playerName));
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length >= 2 && code.length >= 6 && !loading;

  const handleJoinRoom = async () => {
    setError(null);
    setLoading(true);

    try {
      // Call backend API to join room
      const result = await roomApi.joinRoom(code.toUpperCase(), {
        playerName: name.trim(),
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (!result.data) {
        setError("Failed to join room. Please try again.");
        setLoading(false);
        return;
      }

      // Store backend response in game state
      actions.setName(result.data.playerName);
      actions.setHost(false); // Joiner is not the host
      actions.setRoomCode(result.data.roomCode);
      actions.setPlayerId(result.data.playerId);
      actions.setRoomId(result.data.roomId);

      // Store room configuration from backend
      actions.setRoomSize(result.data.maxPlayers);
      actions.setWinningMethod(
        mapWinningMethodFromBackend(result.data.winningMethod),
      );
      actions.setCallMode(mapCallModeFromBackend(result.data.callerMode));
      actions.setCallSpeed(result.data.callingSpeed as 3 | 5 | 7);

      // Success notification
      notify(`Joined room ${result.data.roomCode}!`);

      // Navigate to ticket selection
      navigate({ to: "/tickets" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setLoading(false);
    }
  };

  return (
    <SetupShell
      title="Join a Room"
      subtitle="Enter your name and the room code to jump straight into the game."
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Your name
          </label>
          <TextField
            autoFocus
            placeholder="Rohan"
            value={name}
            maxLength={16}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Room code
          </label>
          <TextField
            placeholder="ABC123"
            value={code}
            maxLength={6}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            disabled={loading}
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
        <PrimaryButton disabled={!canSubmit} onClick={handleJoinRoom}>
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Joining Room...
            </>
          ) : (
            <>
              Join Room <ArrowRight className="h-4 w-4" />
            </>
          )}
        </PrimaryButton>
      </div>
    </SetupShell>
  );
}
