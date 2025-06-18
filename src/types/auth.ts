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
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
