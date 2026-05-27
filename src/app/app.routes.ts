import { Routes } from '@angular/router';
import { authGuard, requireRoles } from './core/guards/auth.guard';

export const routes: Routes = [
    {
    path: 'landing-page',
    loadComponent: () => 
      import('./pages/landing-page/landing-page')
        .then(m => m.LandingPage ),
    title: 'Landing Page'
    },
    {
    path: 'login',
    loadComponent: () => 
      import('./pages/login/login')
        .then(m => m.Login ),
    title: 'Login'
    },

    {
    path: 'user-management',
    loadComponent: () =>
      import('./pages/user-management/user-management').then(
        (m) => m.UserManagement
      ),
    title: 'User Management',
    canActivate: [requireRoles(['Admin', 'SuperAdmin'])],
  },

    {
    path: 'forbidden',
    loadComponent: () => 
      import('./pages/forbidden/forbidden')
        .then(m => m.Forbidden),
    title: 'Forbidden'
    },

    {
    path: '',
    redirectTo: '/landing-page',
    pathMatch: 'full'
    }
];
