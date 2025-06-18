export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  username: string;
  new_password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: string; // Token comes in data field
  token?: string; // Fallback
  user?: User;
}

export interface ApiError {
  message: string;
  status: number;
}
