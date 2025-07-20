import { Routes } from '@angular/router';

export const routes: Routes = [
  //auth
  {
    path: 'auth',
    loadChildren: () => import('./auth/features/auth.routes'),
  },

  //panel
  {
    // canMatch: [authMatchGuard], // Use the match guard for lazy-loaded modules
    path: '',
    loadComponent: () =>
      import('./shared/ui/layout-panel/layout/layout.component'),
    loadChildren: () => import('./recipe/features/recipe.route'),
  },

  {
    path: '**',
    redirectTo: 'auth',
  },
];
