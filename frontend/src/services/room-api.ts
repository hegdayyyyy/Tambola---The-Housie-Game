/**
 * Room API Service
 * Handles room creation, joining, and room information
 */

import { apiClient } from "./api-client";
import { API_CONFIG } from "./config";
import type {
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  RoomDetailsResponse,
  ApiResult,
} from "./types";

/**
 * Room API Service
 */
export const roomApi = {
  /**
   * Create a new Tambola room
   * POST /api/rooms
   */
  async createRoom(
    request: CreateRoomRequest,
  ): Promise<ApiResult<CreateRoomResponse>> {
    return apiClient.post<CreateRoomResponse>(
      API_CONFIG.ENDPOINTS.ROOMS,
      request,
    );
  },

  /**
   * Join an existing room
   * POST /api/rooms/{roomCode}/join
   */
  async joinRoom(
    roomCode: string,
    request: JoinRoomRequest,
  ): Promise<ApiResult<JoinRoomResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}/join`;
    return apiClient.post<JoinRoomResponse>(endpoint, request);
  },

  /**
   * Get room details including players
   * GET /api/rooms/{roomCode}
   */
  async getRoomDetails(
    roomCode: string,
  ): Promise<ApiResult<RoomDetailsResponse>> {
    const endpoint = `${API_CONFIG.ENDPOINTS.ROOMS}/${roomCode}`;
    return apiClient.get<RoomDetailsResponse>(endpoint);
  },
};
