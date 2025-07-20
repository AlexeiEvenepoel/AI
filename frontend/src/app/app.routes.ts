// app.routes.ts
import { Routes } from '@angular/router';
import { authMatchGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Redirigir la ruta raíz al login si no está autenticado
  {
    path: '',
    redirectTo: '/auth/sign-in',
    pathMatch: 'full',
  },

  // Rutas de autenticación (accesibles solo para usuarios no autenticados)
  {
    path: 'auth',
    loadChildren: () => import('./auth/features/auth.routes'),
  },

  // Panel principal (protegido para usuarios autenticados)
  {
    path: 'dashboard',
    canMatch: [authMatchGuard], // Proteger el módulo completo
    loadComponent: () =>
      import('./shared/ui/layout-panel/layout/layout.component'),
    loadChildren: () => import('./recipe/features/recipe.route'),
  },

  // Redirigir cualquier ruta no encontrada al login
  {
    path: '**',
    redirectTo: '/auth/sign-in',
  },
];
