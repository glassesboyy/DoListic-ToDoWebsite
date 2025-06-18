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

    // Tambahkan logging untuk debugging
    console.log("Mengirim request ke:", url);
    console.log("Request options:", options);

    try {
      const response = await fetch(url, {
        mode: "cors", // Pastikan mode CORS eksplisit
        credentials: "include", // Jika menggunakan cookies
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw {
          message: data.message || "Something went wrong",
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
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
}

// Token management
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

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

export default AuthAPI;
