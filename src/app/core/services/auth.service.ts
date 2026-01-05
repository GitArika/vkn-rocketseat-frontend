import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: string;
  nome: string;
  email: string;
  perfil: 'RECEPCAO' | 'TECNICO' | 'GERENTE' | 'DONO';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  currentUser = signal<LoginResponse | null>(null);
  isAuthenticated = signal(false);

  constructor() {
    this.loadStoredAuth();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setAuth(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setAuth(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response));
    this.currentUser.set(response);
    this.isAuthenticated.set(true);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as LoginResponse;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  hasRole(role: 'RECEPCAO' | 'TECNICO' | 'GERENTE' | 'DONO'): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return user.perfil === role || user.perfil === 'GERENTE';
  }
}

