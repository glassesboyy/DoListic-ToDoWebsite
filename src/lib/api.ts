import { ApiError } from "@/types/auth";
import { TokenManager } from "./auth";
import { API_BASE_URL } from "./env";

class ApiClient {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = TokenManager.getToken();

    let headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Jika body adalah FormData, hapus Content-Type agar browser yang set
    if (options.body instanceof FormData) {
      headers = { ...(options.headers as Record<string, string>) };
      // Hapus Content-Type jika ada
      delete headers["Content-Type"];
    }

    // Tambahkan Authorization header jika ada token Bearer
    if (token) {
      headers.Authorization = token;
    }

    try {
      const response = await fetch(url, {
        mode: "cors",
        headers,
        ...options,
      });

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          status: "success",
          message: text || "Request completed successfully",
        } as unknown as T;
      }

      if (!response.ok) {
        // Jika 401 unauthorized, redirect ke login
        if (response.status === 401) {
          TokenManager.removeToken();
          window.location.href = "/auth/login";
        }

        throw {
          message: data.message || `HTTP Error ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      if (error instanceof TypeError) {
        throw {
          message: "Network error. Please check your connection.",
          status: 0,
        } as ApiError;
      }

      throw error;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "GET" });
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    // Jika data adalah FormData, jangan JSON.stringify dan biarkan Content-Type diatur browser
    if (data instanceof FormData) {
      return this.makeRequest<T>(endpoint, {
        method: "POST",
        body: data,
      });
    }
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    // Jika data adalah FormData, jangan JSON.stringify dan biarkan Content-Type diatur browser
    if (data instanceof FormData) {
      return this.makeRequest<T>(endpoint, {
        method: "PUT",
        body: data,
      });
    }
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export default ApiClient;
