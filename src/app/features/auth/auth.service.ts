import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';
  private readonly _accessToken = signal<string | null>(null);
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  private readonly _refreshInProgress$ = new BehaviorSubject<boolean>(false);
  private readonly _isInitialized$ = new BehaviorSubject<boolean>(false);

  markInitialized(): void {
    this._isInitialized$.next(true);
  }

  get isInitialized$(): Observable<boolean> {
    return this._isInitialized$.asObservable();
  }

  get isInitialized(): boolean {
    return this._isInitialized$.value;
  }
  getToken(): string | null {
    return this._accessToken();
  }

  get refresInProgress$(): Observable<boolean> {
    return this._refreshInProgress$.asObservable();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this._accessToken.set(response.accessToken);
          this._isLoggedIn.set(true);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
        }),
      );
  }

  get isRefreshing(): boolean {
    return this._refreshInProgress$.value;
  }

  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    this._refreshInProgress$.next(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this._accessToken.set(response.accessToken);
        this._isLoggedIn.set(true);
        this._refreshInProgress$.next(false);
      }),
    );
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._accessToken.set(null);
    this._refreshInProgress$.next(false);
    localStorage.removeItem('refreshToken');
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
  }
}
