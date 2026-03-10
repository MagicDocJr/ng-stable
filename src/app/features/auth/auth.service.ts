import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  login(username: string, password: string): boolean {
    // In a real application, we would make an HTTP request to your backend here.
    // For this example, we'll just check against hardcoded credentials.
    if (username === 'admin' && password === 'admin') {
      this._isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this._isLoggedIn.set(false);
  }
}
