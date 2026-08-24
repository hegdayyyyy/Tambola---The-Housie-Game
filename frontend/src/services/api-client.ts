/**
 * Base API Client
 * Handles HTTP requests, error handling, and response parsing
 */

import { API_CONFIG } from "./config";
import type { ApiErrorResponse, ApiResult } from "./types";

/**
 * HTTP Methods
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Request options
 */
interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number> | undefined;
}

/**
 * Base API Client class
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number>,
  ): string {
    const url = `${this.baseUrl}${endpoint}`;
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    return `${url}?${searchParams.toString()}`;
  }

  /**
   * Parse error response from backend
   */
  private async parseError(response: Response): Promise<string> {
    try {
      const errorData: ApiErrorResponse = await response.json();
      return errorData.message || `Server error: ${response.status}`;
    } catch {
      return `Server error: ${response.status} ${response.statusText}`;
    }
  }

  /**
   * Generic request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResult<T>> {
    const { method = "GET", body, headers = {}, params } = options;

    const url = this.buildUrl(endpoint, params);

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Handle non-OK responses
      if (!response.ok) {
        const errorMessage = await this.parseError(response);
        return {
          error: errorMessage,
          status: response.status,
        };
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {
          data: undefined as unknown as T,
          status: response.status,
        };
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {
          data: undefined as unknown as T,
          status: response.status,
        };
      }

      // Parse JSON response
      const data: T = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      // Network errors, timeout, etc.
      const message =
        error instanceof Error
          ? error.message
          : "Network error. Please check your connection.";
      return {
        error: message,
        status: 0,
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number>,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: "POST", body, params });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number>,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: "PUT", body, params });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: "DELETE", params });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number>,
  ): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body, params });
  }
}

/**
 * Singleton API client instance
 */
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
