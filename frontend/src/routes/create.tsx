import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  OptionCard,
  PrimaryButton,
  SetupShell,
  TextField,
} from "@/components/SetupShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WINNING_METHODS, type WinningMethod } from "@/lib/tambola-data";
import { actions, useGame, notify } from "@/lib/game-store";
import {
  roomApi,
  mapWinningMethodToBackend,
  mapCallModeToBackend,
} from "@/services";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Tambola Room — Tambola" },
      {
        name: "description",
        content:
          "Set up your Tambola room in one screen: name, room size, winning method and calling mode.",
      },
      { property: "og:title", content: "Create a Tambola Room" },
      {
        property: "og:description",
        content:
          "Choose room size, winning method and calling mode, then pick your ticket.",
      },
    ],
  }),
  component: CreateRoomPage,
});

function CreateRoomPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(useGame((s) => s.playerName));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomSize = useGame((s) => s.roomSize);
  const method = useGame((s) => s.winningMethod);
  const mode = useGame((s) => s.callMode);
  const speed = useGame((s) => s.callSpeed);

  const canSubmit = name.trim().length >= 2 && !loading;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      // Call backend API to create room
      const result = await roomApi.createRoom({
        playerName: name.trim(),
        maxPlayers: roomSize,
        winningMethod: mapWinningMethodToBackend(method),
        callerMode: mapCallModeToBackend(mode),
        callingSpeed: speed,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (!result.data) {
        setError("Failed to create room. Please try again.");
        setLoading(false);
        return;
      }

      // Store backend response in game state
      actions.setName(result.data.playerName);
      actions.setHost(true);
      actions.setRoomCode(result.data.roomCode);
      actions.setPlayerId(result.data.playerId);
      actions.setRoomId(result.data.roomId);

      // Success notification
      notify(`Room ${result.data.roomCode} created!`);

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
    <SetupShell title="Create your room">
      <div className="flex flex-col gap-6">
        {/* Name */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Your name
            </p>
          </div>
          <TextField
            autoFocus
            placeholder="Rohan"
            value={name}
            maxLength={16}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            This is how your friends will see you in the room.
          </p>
        </section>

        {/* Room Size */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Room size
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[2, 3, 4].map((n) => (
              <OptionCard
                key={n}
                selected={roomSize === n}
                onClick={() => !loading && actions.setRoomSize(n)}
                title={`${n}`}
              />
            ))}
          </div>
        </section>

        {/* Winning Method */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Winning method
            </p>
          </div>
          <Select
            value={method}
            onValueChange={(v) =>
              !loading && actions.setWinningMethod(v as WinningMethod)
            }
            disabled={loading}
          >
            <SelectTrigger className="h-12 w-full rounded-2xl border-2 border-border bg-card px-5 text-lg font-bold">
              <SelectValue placeholder="Select a winning method" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {WINNING_METHODS.map((m) => (
                <SelectItem
                  key={m.id}
                  value={m.id}
                  className="py-3 text-base font-bold data-[state=checked]:text-primary"
                >
                  <span>{m.id}</span>
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    — {m.description}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Calling Mode */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              4
            </span>
            <p className="text-sm font-bold tracking-[0.18em] text-primary uppercase">
              Calling mode
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              selected={mode === "manual"}
              onClick={() => !loading && actions.setCallMode("manual")}
              title="Manual"
              hint="You call each number yourself."
            />
            <OptionCard
              selected={mode === "automatic"}
              onClick={() => !loading && actions.setCallMode("automatic")}
              title="Automatic"
              hint="Numbers roll on a timer."
            />
          </div>

          {mode === "automatic" ? (
            <div>
              <p className="mb-2 mt-2 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Calling speed
              </p>
              <div className="grid grid-cols-3 gap-3">
                {([3, 5, 7] as const).map((s) => (
                  <OptionCard
                    key={s}
                    selected={speed === s}
                    onClick={() => !loading && actions.setCallSpeed(s)}
                    title={`${s} seconds`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-1 rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-primary">
              The creator will call each number manually.
            </p>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div className="rounded-2xl bg-destructive/10 px-4 py-3.5 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        <PrimaryButton disabled={!canSubmit} onClick={handleSubmit}>
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating Room...
            </>
          ) : (
            <>
              Continue to Ticket Selection <ArrowRight className="h-4 w-4" />
            </>
          )}
        </PrimaryButton>
      </div>
    </SetupShell>
  );
}
