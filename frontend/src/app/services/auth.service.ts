// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';  // <-- important

interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  role: string; // 'user' or 'admin'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiBaseUrl;   // <-- use env, not localhost
  private tokenKey = 'token';
  private refreshTokenKey = 'refresh_token';
  private roleKey = 'role';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentRole: string | null = null;

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  register(username: string, password: string, role: string = 'user'): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, role }).pipe(
      tap(() => this.checkLoginStatus()),
      catchError(err => { console.error('Registration error:', err); throw err; })
    );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (!response.access_token) throw new Error('No token received from server');
        localStorage.setItem(this.tokenKey, response.access_token);
        localStorage.setItem(this.refreshTokenKey, response.refresh_token);
        localStorage.setItem(this.roleKey, response.role);
        this.currentRole = response.role;
        this.checkLoginStatus();
      }),
      catchError(err => { console.error('Login error:', err); throw err; })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.roleKey);
    this.isLoggedInSubject.next(false);
    this.currentRole = null;
  }

  isLoggedIn(): Observable<boolean> { return this.isLoggedInSubject.asObservable(); }
  isAdmin(): boolean { return this.getRole() === 'admin'; }
  getRole(): string | null { return this.currentRole || localStorage.getItem(this.roleKey); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }

  private checkLoginStatus(): void {
    const token = localStorage.getItem(this.tokenKey);
    this.currentRole = localStorage.getItem(this.roleKey);
    this.isLoggedInSubject.next(!!token);
  }

  private getHttpOptions() {
    const token = this.getToken();
    return {
      headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders()
    };
  }
}
