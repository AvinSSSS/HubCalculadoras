import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/calculator/calculator.page').then((m) => m.CalculatorPage),
  },
  { path: 'calculadoras', redirectTo: '', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '',
  },
];
