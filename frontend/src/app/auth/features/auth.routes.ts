// features/auth.routes.ts
import { Routes } from '@angular/router';
import { noAuthGuard } from '../guards/no-auth.guard';

export default [
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in/sign-in.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
] as Routes;
