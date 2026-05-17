import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = inject(ApiService);

  private readonly API = 'http://localhost:8080/api/auth';
  private readonly ACCESS_KEY = 'accessToken';
  private readonly REFRESH_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, payload).pipe(
      tap(res => this.storeTokens(res))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, payload).pipe(
      tap(res => {
        if (res?.accessToken) this.storeTokens(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // Backwards-compatible alias used around the app
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  // Return true when the user has admin privileges
  isAdmin(): boolean {
    const u = this.user();
    if (!u) return false;
    if (u.role === 'ADMIN') return true;
    if (u.isAdmin === true) return true;
    if (Array.isArray(u.roles) && u.roles.includes('ADMIN')) return true;
    return false;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  // Persist a minimal user object for UI usage
  setUser(u: any): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(u || null));
    } catch {
      // ignore
    }
  }

  user(): any {
    try {
      const v = localStorage.getItem(this.USER_KEY);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  }

  // Fetch user profile from API and cache it
  fetchUser(): Observable<any> {
    return this.api.me().pipe(tap(u => this.setUser(u)));
  }

  isPremium(): boolean {
    return this.user()?.plan === 'PREMIUM';
  }

  private storeTokens(res: AuthResponse): void {
    localStorage.setItem(this.ACCESS_KEY, res.accessToken);
    localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
  }
}
