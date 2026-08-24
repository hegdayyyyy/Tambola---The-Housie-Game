/**
 * API Type Definitions
 * Maps to backend DTOs and domain models
 */

import type { WinningMethod } from "@/lib/tambola-data";

// ============================================================================
// BACKEND ENUMS
// ============================================================================

export type BackendWinningMethod =
  "EARLY_FIVE" | "TOP_LINE" | "MIDDLE_LINE" | "BOTTOM_LINE" | "FULL_HOUSE";

export type BackendCallerMode = "MANUAL" | "AUTOMATIC";

export type BackendRoomStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";

export type BackendGameStatus =
  "NOT_STARTED" | "IN_PROGRESS" | "PAUSED" | "COMPLETED";

export type BackendClaimResult = "VALID" | "INVALID";

// ============================================================================
// REQUEST DTOs
// ============================================================================

export interface CreateRoomRequest {
  playerName: string;
  maxPlayers: number;
  winningMethod: BackendWinningMethod;
  callerMode: BackendCallerMode;
  callingSpeed: number;
}

export interface JoinRoomRequest {
  playerName: string;
}

export interface SelectTicketRequest {
  ticketData: number[][];
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================

export interface CreateRoomResponse {
  roomId: number;
  roomCode: string;
  maxPlayers: number;
  winningMethod: BackendWinningMethod;
  callerMode: BackendCallerMode;
  callingSpeed: number;
  status: BackendRoomStatus;
  playerId: number;
  playerName: string;
}

export interface JoinRoomResponse {
  roomId: number;
  roomCode: string;
  playerId: number;
  playerName: string;
  maxPlayers: number;
  currentPlayerCount: number;
  status: BackendRoomStatus;
  winningMethod: BackendWinningMethod;
  callerMode: BackendCallerMode;
  callingSpeed: number;
}

export interface PlayerInfo {
  playerId: number;
  playerName: string;
  isCreator: boolean;
  isDisqualified: boolean;
  ticketData: number[][] | null;
}

export interface RoomDetailsResponse {
  roomCode: string;
  maxPlayers: number;
  winningMethod: BackendWinningMethod;
  callerMode: BackendCallerMode;
  callingSpeed: number;
  roomStatus: BackendRoomStatus;
  gameStatus: BackendGameStatus;
  players: PlayerInfo[];
}

export interface GenerateTicketsResponse {
  tickets: number[][][]; // Array of 3 tickets
}

export interface SelectTicketResponse {
  ticketId: number;
  playerId: number;
  ticketData: number[][];
}

export interface StartGameResponse {
  gameId: number;
  roomCode: string;
  gameStatus: BackendGameStatus;
  roomStatus: BackendRoomStatus;
  startedAt: string;
}

export interface CallNumberResponse {
  gameId: number;
  number: number;
  sequenceNumber: number;
  calledAt: string;
  gameStatus: BackendGameStatus;
}

export interface ClaimResponse {
  gameId: number;
  roomCode: string;
  playerId: number;
  playerName: string;
  claimResult: BackendClaimResult;
  gameStatus: BackendGameStatus;
  disqualified: boolean | null;
  winnerId: number | null;
  winnerName: string | null;
}

// ============================================================================
// ERROR RESPONSE
// ============================================================================

export interface ApiErrorResponse {
  message: string;
  timestamp?: string;
  status?: number;
  error?: string;
  path?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ApiResult<T> {
  data?: T;
  error?: string;
  status: number;
}

// ============================================================================
// ENUM MAPPING UTILITIES
// ============================================================================

/**
 * Maps frontend WinningMethod display names to backend enum values
 */
export function mapWinningMethodToBackend(
  method: WinningMethod,
): BackendWinningMethod {
  const mapping: Record<WinningMethod, BackendWinningMethod> = {
    "Early Five": "EARLY_FIVE",
    "Top Line": "TOP_LINE",
    "Middle Line": "MIDDLE_LINE",
    "Bottom Line": "BOTTOM_LINE",
    "Full House": "FULL_HOUSE",
  };
  return mapping[method];
}

/**
 * Maps backend enum values to frontend WinningMethod display names
 */
export function mapWinningMethodFromBackend(
  method: BackendWinningMethod,
): WinningMethod {
  const mapping: Record<BackendWinningMethod, WinningMethod> = {
    EARLY_FIVE: "Early Five",
    TOP_LINE: "Top Line",
    MIDDLE_LINE: "Middle Line",
    BOTTOM_LINE: "Bottom Line",
    FULL_HOUSE: "Full House",
  };
  return mapping[method];
}

/**
 * Maps frontend call mode to backend enum
 */
export function mapCallModeToBackend(
  mode: "manual" | "automatic",
): BackendCallerMode {
  return mode === "manual" ? "MANUAL" : "AUTOMATIC";
}

/**
 * Maps backend call mode to frontend
 */
export function mapCallModeFromBackend(
  mode: BackendCallerMode,
): "manual" | "automatic" {
  return mode === "MANUAL" ? "manual" : "automatic";
}
