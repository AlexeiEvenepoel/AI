// guards/no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth.service';

// Guard para evitar que usuarios autenticados accedan a páginas de login/registro
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirigir al panel principal si ya está autenticado
  router.navigate(['']);
  return false;
};
