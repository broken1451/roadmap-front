import { Routes } from '@angular/router';
import { authGuard } from './private/guards/auth.guard';

export const routes: Routes = [

    {
        path: 'public',
        title: 'Public',
        loadComponent: () => import('./public/public.component').then(m => m.PublicComponent),
        children: [
            {
                path: 'login',
                title: 'Login',
                loadComponent: () => import('./public/login/login.component').then(m => m.LoginComponent),
            },
            {
                path: 'register',
                title: 'Register',
                loadComponent: () => import('./public/register/register.component').then(m => m.RegisterComponent),
            },
            {
                path: 'forgot-password',
                title: 'Forgot Password',
                loadComponent: () => import('./public/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
            },
            {
                path: '**',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'private',
        title: 'Private',
        canActivate: [authGuard],
        loadComponent: () => import('./private/private.component').then(m => m.PrivateComponent),
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./private/dashboard/dashboard.component').then(m => m.DashboardComponent),
            }
        ]
    },

    // {
    //     path: 'todo',
    // },
    {
        path: '**',
        redirectTo: 'public',
        pathMatch: 'full'
    }
];
