import {
  ApiError,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/types/auth";

const API_BASE_URL = "http://localhost:8080/api";

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
    return this.makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async verifyEmail(token: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`/auth/verify-email?token=${token}`, {
      method: "GET",
    });
  }

  // New: Request reset password (sends OTP to email)
  static async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Updated: Reset password with OTP
  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = TokenManager.getToken();
    if (!token) {
      throw {
        message: "No authentication token found",
        status: 401,
      } as ApiError;
    }

    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        Authorization: token,
        ...options.headers,
      },
    });
  }

  static async getProfile(): Promise<{
    status: string;
    message: string;
    data: User;
  }> {
    return this.makeAuthenticatedRequest<{
      status: string;
      message: string;
      data: User;
    }>("/user/profile", {
      method: "GET",
    });
  }

  static async updateProfile(data: {
    name: string;
    username: string;
    email: string;
  }): Promise<{
    status: string;
    message: string;
  }> {
    return this.makeAuthenticatedRequest<{
      status: string;
      message: string;
    }>("/user/update-profile", {
      method: "PUT",
      body: JSON.stringify(data),
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

    // Untuk development/testing dengan temporary token
    if (token.startsWith("temp_token_")) {
      return true;
    }

    try {
      // Validasi JWT token format dan expiry
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    // Untuk development/testing dengan temporary token
    if (token.startsWith("temp_token_")) {
      return {
        id: "temp_user",
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
        emailVerified: true,
      };
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));

      return {
        id: payload.id?.toString() || payload.sub?.toString() || "",
        name: payload.name || "",
        username: payload.username || "",
        email: payload.email || "",
        emailVerified: payload.email_verified || true,
      };
    } catch (error) {
      console.error("Error extracting user from token:", error);
      return null;
    }
  },
};

export default AuthAPI;
