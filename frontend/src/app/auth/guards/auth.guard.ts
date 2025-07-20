import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { TokenService } from '../data-access/token.service';

// For route activation
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verify token exists and is not expired
  if (tokenService.hasToken() && !tokenService.isTokenExpired()) {
    return true;
  }

  // If no token or expired, redirect to login
  router.navigate(['/auth/sign-in'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};

// For module loading (canMatch)
export const authMatchGuard: CanMatchFn = (route, segments) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verify token exists and is not expired
  if (tokenService.hasToken() && !tokenService.isTokenExpired()) {
    return true;
  }

  // If no token or expired, redirect to login
  router.navigate(['/auth/sign-in']);
  return false;
};
