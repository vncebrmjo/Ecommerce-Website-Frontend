import { Routes } from '@angular/router';

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
