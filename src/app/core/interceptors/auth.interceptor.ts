import {HttpInterceptor, HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!authService){
    return next(req);
  }

  const authenticatedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`)
  })
  return next(authenticatedReq);
}
