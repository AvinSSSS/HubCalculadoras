import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'calculadoras',
    loadComponent: () => import('./pages/calculator/calculator.page').then((m) => m.CalculatorPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
