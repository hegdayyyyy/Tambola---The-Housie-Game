/**
 * Game API Service
 * Handles game lifecycle: start, call numbers, game state
 */

import { apiClient } from "./api-client";
import { API_CONFIG } from "./config";
import type { StartGameResponse, CallNumberResponse, ApiResult } from "./types";

/**
 * Game API Service
 */
export const gameApi = {
  /**
   * Start the game (creator/host only)
   * POST /api/rooms/{roomCode}/start?playerId={playerId}
   */
  async startGame(
    roomCode: string,
    playerId: number,
  ): Promise<ApiResult<StartGameResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/start`;
    return apiClient.post<StartGameResponse>(endpoint, undefined, { playerId });
  },

  /**
   * Manually call next number (creator/host only, manual mode)
   * POST /api/rooms/{roomCode}/call?playerId={playerId}
   */
  async callNumber(
    roomCode: string,
    playerId: number,
  ): Promise<ApiResult<CallNumberResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/call`;
    return apiClient.post<CallNumberResponse>(endpoint, undefined, {
      playerId,
    });
  },

  /**
   * Resume game after invalid claim
   * POST /api/rooms/{roomCode}/resume-game
   */
  async resumeGame(roomCode: string): Promise<ApiResult<void>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/resume-game`;
    return apiClient.post<void>(endpoint);
  },
};
