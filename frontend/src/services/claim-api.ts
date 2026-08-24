/**
 * Claim API Service
 * Handles Housie claim submission
 */

import { apiClient } from "./api-client";
import { API_CONFIG } from "./config";
import type { ClaimResponse, ApiResult } from "./types";

/**
 * Claim API Service
 */
export const claimApi = {
  /**
   * Submit a Housie claim
   * POST /api/rooms/{roomCode}/players/{playerId}/claim
   */
  async submitClaim(
    roomCode: string,
    playerId: number,
  ): Promise<ApiResult<ClaimResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/players/${playerId}/claim`;
    return apiClient.post<ClaimResponse>(endpoint);
  },
};
