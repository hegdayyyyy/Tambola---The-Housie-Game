import { useSyncExternalStore } from "react";
import {
  BOT_NAMES,
  CALL_SEQUENCE,
  TICKET_SETS,
  ticketNumbers,
  type TicketGrid,
  type WinningMethod,
} from "./tambola-data";

export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  isYou: boolean;
  status: "active" | "disqualified" | "winner";
};

export type ClaimPhase =
  "idle" | "validating" | "valid" | "invalid" | "no_winner";

export type GameState = {
  playerName: string;
  isHost: boolean;
  roomCode: string;
  roomSize: number;
  winningMethod: WinningMethod;
  callMode: "manual" | "automatic";
  callSpeed: 3 | 5 | 7;
  ticketSetIndex: number;
  selectedTicketIndex: number | null;
  ticket: TicketGrid | null;
  players: Player[];
  calledNumbers: number[];
  marked: number[];
  started: boolean;
  paused: boolean;
  finished: boolean;
  claimPhase: ClaimPhase;
  claimant: string | null;
  toast: string | null;
  // Backend integration IDs
  playerId: number | null;
  roomId: number | null;
  gameId: number | null;
  ticketId: number | null;
  // Generated tickets from backend
  generatedTickets: TicketGrid[] | null;
};

const initialState: GameState = {
  playerName: "",
  isHost: true,
  roomCode: "ABC123",
  roomSize: 4,
  winningMethod: "Full House",
  callMode: "automatic",
  callSpeed: 5,
  ticketSetIndex: 0,
  selectedTicketIndex: null,
  ticket: null,
  players: [],
  calledNumbers: [],
  marked: [],
  started: false,
  paused: false,
  finished: false,
  claimPhase: "idle",
  claimant: null,
  toast: null,
  playerId: null,
  roomId: null,
  gameId: null,
  ticketId: null,
  generatedTickets: null,
};

let state: GameState = { ...initialState };
const listeners = new Set<() => void>();

// Load persisted state from localStorage
const STORAGE_KEY = "tambola-game-state";
function loadPersistedState(): GameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Only restore essential game state, not UI state like toast
      return {
        ...initialState,
        playerName: parsed.playerName || "",
        isHost: parsed.isHost || false,
        roomCode: parsed.roomCode || "",
        playerId: parsed.playerId || null,
        roomId: parsed.roomId || null,
        gameId: parsed.gameId || null,
        ticketId: parsed.ticketId || null,
        ticket: parsed.ticket || null,
        started: parsed.started || false,
        winningMethod: parsed.winningMethod || "Full House",
        callMode: parsed.callMode || "automatic",
        callSpeed: parsed.callSpeed || 5,
        roomSize: parsed.roomSize || 4,
      };
    }
  } catch (error) {
    console.error("Failed to load persisted state:", error);
  }
  return { ...initialState };
}

// Save essential state to localStorage
function persistState(state: GameState) {
  try {
    const stateToPersist = {
      playerName: state.playerName,
      isHost: state.isHost,
      roomCode: state.roomCode,
      playerId: state.playerId,
      roomId: state.roomId,
      gameId: state.gameId,
      ticketId: state.ticketId,
      ticket: state.ticket,
      started: state.started,
      winningMethod: state.winningMethod,
      callMode: state.callMode,
      callSpeed: state.callSpeed,
      roomSize: state.roomSize,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  } catch (error) {
    console.error("Failed to persist state:", error);
  }
}

// Initialize with persisted state
state = loadPersistedState();

function set(patch: Partial<GameState>) {
  state = { ...state, ...patch };
  persistState(state); // Persist on every state change
  listeners.forEach((l) => l());
}

export const store = {
  getState: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useGame<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function notify(message: string) {
  set({ toast: message });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => set({ toast: null }), 2600);
}

/* ---------------- setup actions ---------------- */

export const actions = {
  reset() {
    // Reset all state to initial values
    state = { ...initialState };
    // Clear persisted state
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear persisted state:", error);
    }
    listeners.forEach((l) => l());
  },
  setName(playerName: string) {
    set({ playerName });
  },
  setHost(isHost: boolean) {
    set({ isHost });
  },
  setRoomCode(roomCode: string) {
    set({ roomCode });
  },
  setRoomSize(roomSize: number) {
    set({ roomSize });
  },
  setWinningMethod(winningMethod: WinningMethod) {
    set({ winningMethod });
  },
  setCallMode(callMode: "manual" | "automatic") {
    set({ callMode });
  },
  setCallSpeed(callSpeed: 3 | 5 | 7) {
    set({ callSpeed });
  },
  setPlayerId(playerId: number) {
    set({ playerId });
  },
  setRoomId(roomId: number) {
    set({ roomId });
  },
  setGameId(gameId: number) {
    set({ gameId });
  },
  setTicketId(ticketId: number) {
    set({ ticketId });
  },
  setTicket(ticket: TicketGrid) {
    set({ ticket });
  },
  resetGameState() {
    set({ started: false, finished: false, paused: false });
  },
  setGeneratedTickets(tickets: TicketGrid[]) {
    set({ generatedTickets: tickets, selectedTicketIndex: null });
  },
  setPlayers(players: Player[]) {
    set({ players });
  },
  rotateTickets() {
    set({
      ticketSetIndex: (state.ticketSetIndex + 1) % TICKET_SETS.length,
      selectedTicketIndex: null,
    });
  },
  selectTicket(index: number) {
    set({ selectedTicketIndex: index });
  },
  /** Confirms ticket + seeds the lobby roster. */
  enterLobby() {
    const idx = state.selectedTicketIndex ?? 0;
    const ticket = TICKET_SETS[state.ticketSetIndex]![idx]!;
    const you: Player = {
      id: "you",
      name: state.playerName || "You",
      isHost: state.isHost,
      isYou: true,
      status: "active",
    };
    const bots: Player[] = state.isHost
      ? BOT_NAMES.slice(0, Math.min(2, state.roomSize - 1)).map((name, i) => ({
          id: `bot-${i}`,
          name,
          isHost: false,
          isYou: false,
          status: "active" as const,
        }))
      : [
          {
            id: "host",
            name: "Rohan",
            isHost: true,
            isYou: false,
            status: "active" as const,
          },
          {
            id: "bot-1",
            name: "Priya",
            isHost: false,
            isYou: false,
            status: "active" as const,
          },
        ];
    set({ ticket, players: state.isHost ? [you, ...bots] : [...bots, you] });
  },
  addPlayer() {
    const used = new Set(state.players.map((p) => p.name));
    const next = BOT_NAMES.find((n) => !used.has(n));
    if (!next || state.players.length >= state.roomSize) {
      notify("Room is full");
      return;
    }
    set({
      players: [
        ...state.players,
        {
          id: `bot-${state.players.length}`,
          name: next,
          isHost: false,
          isYou: false,
          status: "active",
        },
      ],
    });
    notify(`${next} joined the room`);
  },

  /* ---------------- game actions ---------------- */

  startGame() {
    set({ started: true });
    // Backend handles automatic calling via scheduler
    // Frontend only receives NUMBER_CALLED events via WebSocket
  },
  toggleMark(n: number) {
    if (state.finished) return;
    set({
      marked: state.marked.includes(n)
        ? state.marked.filter((m) => m !== n)
        : [...state.marked, n],
    });
  },
  claimHousie(byName?: string) {
    if (state.claimPhase !== "idle" || state.finished) return;
    const claimant = byName ?? state.playerName ?? "You";
    set({ claimPhase: "validating", claimant, paused: true });
    // Backend validates the claim - frontend receives result via WebSocket
  },
  dismissInvalid() {
    set({ claimPhase: "idle", claimant: null, paused: false });
    notify("Game resumed");
    // Call backend to resume the game
    // This will be done via API call in the component
  },

  /* ---------------- WebSocket event handlers ---------------- */

  handlePlayerJoined(playerId: number, playerName: string) {
    const existingPlayer = state.players.find((p) => p.id === String(playerId));
    if (existingPlayer) return; // Already in list

    const newPlayer: Player = {
      id: String(playerId),
      name: playerName,
      isHost: false,
      isYou: false,
      status: "active",
    };

    set({ players: [...state.players, newPlayer] });
    notify(`${playerName} joined the room`);
  },

  handleGameStarted(gameId: number) {
    set({ gameId, started: true });
    // Backend handles number calling - frontend receives via WebSocket
  },

  handleNumberCalled(number: number) {
    if (state.calledNumbers.includes(number)) return; // Already called
    set({ calledNumbers: [...state.calledNumbers, number] });
  },

  handleGamePaused(playerName?: string) {
    set({
      paused: true,
      claimPhase: "validating",
      claimant: playerName || "A player",
    });
    // Backend pauses automatic calling
  },

  handleClaimResult(
    playerId: number,
    playerName: string,
    claimResult: "VALID" | "INVALID",
    winnerId?: number,
    winnerName?: string,
  ) {
    if (claimResult === "VALID") {
      set({
        claimPhase: "valid",
        finished: true,
        paused: true,
        claimant: winnerName || playerName,
        players: state.players.map((p) =>
          p.id === String(winnerId || playerId)
            ? { ...p, status: "winner" }
            : p,
        ),
      });
      // Backend stops automatic calling
    } else {
      // Mark player as disqualified
      const updatedPlayers = state.players.map((p) =>
        p.id === String(playerId) ? { ...p, status: "disqualified" } : p,
      );

      // Check if all remaining active players are disqualified
      const activePlayers = updatedPlayers.filter((p) => p.status === "active");

      if (activePlayers.length === 0) {
        // All players disqualified - no winner scenario
        set({
          claimPhase: "no_winner" as const,
          finished: true,
          paused: true,
          claimant: null,
          players: updatedPlayers as Player[],
        });
      } else {
        // Some players still active - resume game
        set({
          claimPhase: "invalid" as const,
          claimant: playerName,
          players: updatedPlayers as Player[],
        });
        // Keep invalid state visible - player must click "Continue Game" to dismiss
      }
    }
  },

  handleGameCompletedNoWinner() {
    // Triggered when all players are disqualified and game ends with no winner
    set({
      claimPhase: "no_winner",
      finished: true,
      paused: true,
      claimant: null,
    });
  },

  handleGameResumed() {
    set({
      paused: false,
      claimPhase: "idle",
      claimant: null,
    });
    // Backend resumes automatic calling if in auto mode
  },

  handleGameCompleted(winnerId?: number, winnerName?: string) {
    set({
      finished: true,
      paused: true,
      claimPhase: "valid",
      players: state.players.map((p) =>
        p.id === String(winnerId) ? { ...p, status: "winner" } : p,
      ),
    });
    // Backend stops game
  },
};

/* ---------------- REMOVED: Frontend auto caller ---------------- */
/* Backend is now authoritative for number calling in automatic mode */
/* Frontend receives NUMBER_CALLED events via WebSocket */
