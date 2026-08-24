/**
 * API Configuration
 * Centralizes environment-based configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env["VITE_API_BASE_URL"] || "http://localhost:8080",
  ENDPOINTS: {
    ROOMS: "/api/rooms",
    WS: "/ws",
  },
} as const;
