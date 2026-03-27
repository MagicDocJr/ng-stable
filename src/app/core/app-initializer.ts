import { inject } from '@angular/core';
import { AuthService } from '../features/auth/auth.service';
import { catchError, finalize, of } from 'rxjs';

export const initializeAuth = () => {
  const authService = inject(AuthService);
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    authService.markInitialized();
    return of(null);
  }

  return authService.refreshAccessToken().pipe(
    catchError(() => {
      localStorage.removeItem('refreshToken');
      return of(null);
    }),
    finalize(() => authService.markInitialized())
  );
};
