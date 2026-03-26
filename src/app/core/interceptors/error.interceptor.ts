import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        // case where we are the first request with expired accesstoken
        if (!authService.isRefreshing) {
          return authService.refreshAccessToken().pipe(
            switchMap(() => {
              //refresh succeeded, so we'll retry original request
              return next(req);
            }),
            catchError((refreshError) => {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
          );
        }

        //Case 2: a refresh is already in progress and request should join queue
        return authService.refresInProgress$.pipe(
          filter((inProgress) => !inProgress),
          take(1),
          switchMap(() => next(req)),
        );

        router.navigate(['/login']);
      }

      if (error.status >= 500) {
        console.error('something went wrong on the server', error.message);
      }

      if (error.status === 0) {
        console.error('network error');
      }

      return throwError(() => error);
    }),
  );
};
