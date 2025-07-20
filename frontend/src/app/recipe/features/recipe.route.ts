// recipe/features/recipe.route.ts
import { Routes } from '@angular/router';
import { authGuard } from '../../auth/guards/auth.guard';

export default [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./recipe-upload/features/recipe-upload.component'),
  },
  {
    path: 'recipe-upload',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./recipe-upload/features/recipe-upload.component'),
  },
  {
    path: '**',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./recipe-upload/features/recipe-upload.component'),
  },
] as Routes;
