import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter, of, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isInitialized) {
    return authService.isInitialized$.pipe(
      filter(initialized => initialized),
      take(1),
      switchMap(() => {
        console.log('Guard resuming after init — isLoggedIn:', authService.isLoggedIn());
        if (authService.isLoggedIn()) {
          return of(true);
        }
        return of(router.createUrlTree(['/login']));
      })
    );
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
