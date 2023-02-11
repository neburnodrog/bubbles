import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'bubbles',
    pathMatch: 'full',
  },
  {
    path: 'bubbles',
    loadComponent: () =>
      import('./app/components/bubbles/bubbles.component').then(
        (comp) => comp.BubblesComponent
      ),
  },
  {
    path: 'sounds',
    loadComponent: () =>
      import('./app/components/sound-input/sound-input.component').then(
        (comp) => comp.SoundInputComponent
      ),
  },
];
