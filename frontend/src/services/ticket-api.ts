/**
 * Ticket API Service
 * Handles ticket generation and selection
 */

import { apiClient } from "./api-client";
import { API_CONFIG } from "./config";
import type {
  GenerateTicketsResponse,
  SelectTicketRequest,
  SelectTicketResponse,
  ApiResult,
} from "./types";

/**
 * Ticket API Service
 */
export const ticketApi = {
  /**
   * Generate 3 ticket choices for a player
   * GET /api/rooms/{roomCode}/players/{playerId}/tickets
   */
  async generateTickets(
    roomCode: string,
    playerId: number,
  ): Promise<ApiResult<GenerateTicketsResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/players/${playerId}/tickets`;
    return apiClient.get<GenerateTicketsResponse>(endpoint);
  },

  /**
   * Select and confirm a ticket
   * POST /api/rooms/{roomCode}/players/{playerId}/ticket
   */
  async selectTicket(
    roomCode: string,
    playerId: number,
    request: SelectTicketRequest,
  ): Promise<ApiResult<SelectTicketResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/players/${playerId}/ticket`;
    return apiClient.post<SelectTicketResponse>(endpoint, request);
  },
};
