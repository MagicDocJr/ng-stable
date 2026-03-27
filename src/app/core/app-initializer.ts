import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../features/auth/auth.service';
import { catchError, of } from 'rxjs';

export const initializeAuth = () => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  // localStorage doesn't exist on the server during SSR —
  // only attempt session restoration in the browser
  if (!isPlatformBrowser(platformId)) {
    return of(null);
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return of(null);
  }

  return authService.refreshAccessToken().pipe(
    catchError(() => {
      localStorage.removeItem('refreshToken');
      return of(null);
    })
  );
};
