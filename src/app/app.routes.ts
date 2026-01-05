import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { OwnerGuard } from './core/guards/owner.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/store/pages/store-landing/store-landing.component').then(
        (m) => m.StoreLandingComponent
      ),
  },
  { path: 'login', loadComponent: () => import('./core/pages/login/login.component').then((c) => c.LoginComponent) },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadChildren: () => import('./features/clientes/clientes.module').then((m) => m.ClientesModule),
  },
  {
    path: 'ordens',
    canActivate: [authGuard],
    loadChildren: () => import('./features/ordens/ordens.module').then((m) => m.OrdensModule),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, OwnerGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
  },
  {
    path: 'relatorios',
    canActivate: [authGuard],
    loadChildren: () => import('./features/relatorios/relatorios.module').then((m) => m.RelatoriosModule),
  },
  { path: '**', redirectTo: 'clientes' },
];
