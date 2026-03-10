import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>NG-STABLE</h1>
        <p>Login to start betting</p>

        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <div class="form-field">
          <label for="username">Username</label>
          <input type="text" id="username" #user (keyup.enter)="onLogin(user.value, pass.value)" />
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            #pass
            (keyup.enter)="onLogin(user.value, pass.value)"
          />
        </div>

        <button class="btn-login" (click)="onLogin(user.value, pass.value)">Login</button>
        <p class="hint">Use <strong>admin / admin</strong></p>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f4f6f8;
      }
      .login-card {
        background: white;
        padding: 2.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 380px;
        text-align: center;
      }
      h1 {
        margin: 0 0 0.5rem;
        color: #0056b3;
      }
      .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-weight: bold;
      }
      .form-field {
        text-align: left;
        margin-bottom: 1.25rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 0.9rem;
      }
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .btn-login {
        width: 100%;
        padding: 0.75rem;
        background: #0056b3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1rem;
        margin-top: 1rem;
      }
      .btn-login:hover {
        background: #004494;
      }
      .hint {
        margin-top: 1.5rem;
        color: #888;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal<string>('');

  onLogin(username: string, password: string): void {
    if (this.authService.login(username, password)) {
      this.router.navigate(['/']);
    } else {
      this.error.set('Invalid username or password');
    }
  }
}
