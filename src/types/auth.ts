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
  email?: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp_code: string;
  new_password: string;
  password_confirm: string;
}

export interface UpdateProfileRequest {
  name: string;
  username: string;
  email: string;
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

export interface ProfileResponse {
  status: string;
  message: string;
  data: User;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
}
