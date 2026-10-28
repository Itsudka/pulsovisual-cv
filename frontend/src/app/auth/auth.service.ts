import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

import {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // DEPENDENCIAS

  private readonly http = inject(HttpClient);

  // CONFIGURACION

  private readonly apiUrl =
    `${environment.apiUrl}/auth`;

  // ESTADO

  readonly currentUser = signal<AuthUser | null>(
    this.loadStoredUser(),
  );

  // LOGIN

  login(loginRequest: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      loginRequest,
    );
  }

  // GUARDAR SESION

  saveSession(loginResponse: LoginResponse): void {
    localStorage.setItem(
      'accessToken',
      loginResponse.accessToken,
    );

    localStorage.setItem(
      'user',
      JSON.stringify(loginResponse.user),
    );

    this.currentUser.set(
      loginResponse.user,
    );
  }

  // OBTENER TOKEN

  getToken(): string | null {
    return localStorage.getItem(
      'accessToken',
    );
  }

  // VERIFICAR AUTENTICACION

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // CERRAR SESION

  logout(): void {
    localStorage.removeItem(
      'accessToken',
    );

    localStorage.removeItem(
      'user',
    );

    this.currentUser.set(null);
  }

  // CARGAR USUARIO GUARDADO

  private loadStoredUser(): AuthUser | null {
    const storedUser =
      localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser,
      ) as AuthUser;
    } catch {
      return null;
    }
  }
}
