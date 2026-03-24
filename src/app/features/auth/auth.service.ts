import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  private readonly _token = signal<string | null>(null);

  login(username: string, password: string): boolean {
    // In a real application, we would make an HTTP request to your backend here.
    // For this example, we'll just check against hardcoded credentials.
    if (username === 'admin' && password === 'admin') {
      this._isLoggedIn.set(true);
      this._token.set('fake-jwt-token-abs123');
      return true;
    }
    return false;
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._token.set(null);
  }

  getToken(): string | null{
    return this._token();
  }
}
