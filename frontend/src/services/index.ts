/**
 * API Services Index
 * Centralized export of all API services
 */

export { API_CONFIG } from "./config";
export { apiClient } from "./api-client";
export { roomApi } from "./room-api";
export { ticketApi } from "./ticket-api";
export { gameApi } from "./game-api";
export { claimApi } from "./claim-api";
export { webSocketService, WebSocketService } from "./websocket-service";

// Export types
export type {
  // Request DTOs
  CreateRoomRequest,
  JoinRoomRequest,
  SelectTicketRequest,
  // Response DTOs
  CreateRoomResponse,
  JoinRoomResponse,
  RoomDetailsResponse,
  GenerateTicketsResponse,
  SelectTicketResponse,
  StartGameResponse,
  CallNumberResponse,
  ClaimResponse,
  PlayerInfo,
  // Enums
  BackendWinningMethod,
  BackendCallerMode,
  BackendRoomStatus,
  BackendGameStatus,
  BackendClaimResult,
  // Utility types
  ApiErrorResponse,
  ApiResult,
} from "./types";

// Export WebSocket event types
export type {
  WebSocketEventType,
  GameEvent,
  PlayerJoinedEvent,
  GameStartedEvent,
  NumberCalledEvent,
  GamePausedEvent,
  ClaimResultEvent,
  GameResumedEvent,
  GameCompletedEvent,
  AnyGameEvent,
} from "./websocket-service";

// Export mapping utilities
export {
  mapWinningMethodToBackend,
  mapWinningMethodFromBackend,
  mapCallModeToBackend,
  mapCallModeFromBackend,
} from "./types";
