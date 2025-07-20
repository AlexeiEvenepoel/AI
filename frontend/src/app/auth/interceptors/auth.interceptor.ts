// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../data-access/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Agregar token a las requests si existe
  const token = tokenService.getToken();
  if (token && tokenService.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Si el token es inválido (401), redirigir al login
      if (error.status === 401) {
        tokenService.removeToken();
        router.navigate(['/auth/sign-in']);
      }
      return throwError(() => error);
    })
  );
};
