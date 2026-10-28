
// Usuario identificado

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

// Datos de Login

export interface LoginRequest {
  email: string;
  password: string;
}

// Respuesta de Login

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
