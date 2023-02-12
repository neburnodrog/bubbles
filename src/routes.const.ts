import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'bubbles',
    loadComponent: () =>
      import('./app/components/bubbles/bubbles.component').then(
        (comp) => comp.BubblesComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'bubbles',
  },
];
