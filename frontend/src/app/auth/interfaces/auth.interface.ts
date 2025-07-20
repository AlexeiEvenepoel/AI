// interfaces/auth.interface.ts
export interface AuthRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface ApiError {
  message: string;
}
