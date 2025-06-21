import {
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/types/auth";

const API_BASE_URL = "http://localhost:8080/api/auth";

class AuthAPI {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("Mengirim request ke:", url);
    console.log("Request options:", options);

    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      console.log("Response status:", response.status);

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        return {
          status: "success",
          message: text || "Request completed successfully",
        } as unknown as T;
      }

      console.log("Response data:", data);

      if (!response.ok) {
        throw {
          message: data.message || `HTTP Error ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      console.error("Request error:", error);

      if (error instanceof TypeError) {
        throw {
          message: "Network error. Please check your connection.",
          status: 0,
        } as ApiError;
      }

      throw error;
    }
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async verifyEmail(token: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`/verify-email?token=${token}`, {
      method: "GET",
    });
  }

  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/reset-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = TokenManager.getToken();
    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  }
}

export const TokenManager = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (token.startsWith("temp_token_")) {
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    if (token.startsWith("temp_token_")) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id?.toString() || "",
        name: payload.name || "",
        username: payload.username || "",
        email: payload.email || "",
        emailVerified: true, // Karena user sudah bisa login, berarti email sudah verified
      };
    } catch {
      return null;
    }
  },
};

export default AuthAPI;
