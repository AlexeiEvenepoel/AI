import { Routes } from '@angular/router';
export default [
  {
    path: '',
    loadComponent: () =>
      import('./recipe-upload/features/recipe-upload.component'),
  },
  {
    path: 'recipe-upload',
    loadComponent: () =>
      import('./recipe-upload/features/recipe-upload.component'),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./recipe-upload/features/recipe-upload.component'),
  },
] as Routes;
