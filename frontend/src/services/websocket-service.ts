/**
 * WebSocket Service
 * Handles STOMP/SockJS connection to backend for real-time game events
 */

import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_CONFIG } from "./config";

/**
 * WebSocket Event Types from Backend
 */
export type WebSocketEventType =
  | "PLAYER_JOINED"
  | "GAME_STARTED"
  | "NUMBER_CALLED"
  | "GAME_PAUSED"
  | "CLAIM_RESULT"
  | "GAME_RESUMED"
  | "GAME_COMPLETED";

/**
 * Base Event Structure
 */
export interface GameEvent {
  type: WebSocketEventType;
  roomCode: string;
}

/**
 * Player Joined Event
 */
export interface PlayerJoinedEvent extends GameEvent {
  type: "PLAYER_JOINED";
  playerId: number;
  playerName: string;
  currentPlayerCount: number;
}

/**
 * Game Started Event
 */
export interface GameStartedEvent extends GameEvent {
  type: "GAME_STARTED";
  gameId: number;
  gameStatus: string;
  startedAt: string;
}

/**
 * Number Called Event
 */
export interface NumberCalledEvent extends GameEvent {
  type: "NUMBER_CALLED";
  gameId: number;
  number: number;
  sequenceNumber: number;
  calledAt: string;
}

/**
 * Game Paused Event
 */
export interface GamePausedEvent extends GameEvent {
  type: "GAME_PAUSED";
  gameId: number;
  playerId?: number;
  playerName?: string;
}

/**
 * Claim Result Event
 */
export interface ClaimResultEvent extends GameEvent {
  type: "CLAIM_RESULT";
  gameId: number;
  playerId: number;
  playerName: string;
  claimResult: "VALID" | "INVALID";
  winnerId?: number;
  winnerName?: string;
}

/**
 * Game Resumed Event
 */
export interface GameResumedEvent extends GameEvent {
  type: "GAME_RESUMED";
  gameId: number;
}

/**
 * Game Completed Event
 */
export interface GameCompletedEvent extends GameEvent {
  type: "GAME_COMPLETED";
  gameId: number;
  gameStatus: string;
  winnerId?: number;
  winnerName?: string;
  claimResult?: "VALID" | "INVALID";
}

/**
 * Union type for all events
 */
export type AnyGameEvent =
  | PlayerJoinedEvent
  | GameStartedEvent
  | NumberCalledEvent
  | GamePausedEvent
  | ClaimResultEvent
  | GameResumedEvent
  | GameCompletedEvent;

/**
 * WebSocket Service Class
 */
export class WebSocketService {
  private client: Client | null = null;
  private roomCode: string | null = null;
  private messageHandler: ((event: AnyGameEvent) => void) | null = null;
  private connected: boolean = false;

  /**
   * Connect to WebSocket and subscribe to room topic
   */
  connect(
    roomCode: string,
    onMessage: (event: AnyGameEvent) => void,
    onConnect?: () => void,
    onDisconnect?: () => void,
  ): void {
    this.roomCode = roomCode;
    this.messageHandler = onMessage;

    const wsUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.WS;
    console.log(`Connecting to WebSocket URL: ${wsUrl}`);

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as any,

      onConnect: () => {
        console.log(`WebSocket connected to room: ${roomCode}`);
        this.connected = true;

        // Subscribe to room-specific topic
        this.client?.subscribe(
          `/topic/rooms/${roomCode}`,
          (message: IMessage) => {
            try {
              const event: AnyGameEvent = JSON.parse(message.body);
              console.log("WebSocket event received:", event);
              if (this.messageHandler) {
                this.messageHandler(event);
              }
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          },
        );

        if (onConnect) onConnect();
      },

      onDisconnect: () => {
        console.log("WebSocket disconnected");
        this.connected = false;
        if (onDisconnect) onDisconnect();
      },

      onStompError: (frame: any) => {
        console.error("STOMP error:", frame);
      },

      // Reconnect settings
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.activate();
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.client && this.client.active) {
      this.client.deactivate();
      console.log("WebSocket client deactivated");
    }
    this.connected = false;
    this.roomCode = null;
    this.messageHandler = null;
    this.client = null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get current room code
   */
  getRoomCode(): string | null {
    return this.roomCode;
  }
}

/**
 * Singleton instance
 */
export const webSocketService = new WebSocketService();
