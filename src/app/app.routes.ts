import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    }, 

    {
        path: 'auth',
        loadChildren: () => import("./features/auth/auth.routes").then(r => r.AUTH_ROUTES)
    },

    {
        path: 'trainees',
        loadChildren: () => import('./features/trainees/trainees.routes').then(r => r.TRAINEES_ROUTES)
    },

    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES)
    },

    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized').then(c => c.Unauthorized)
    },

    {
        path: '**',
        redirectTo: 'auth'
    }

];