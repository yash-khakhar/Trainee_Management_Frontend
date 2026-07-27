import { Routes } from '@angular/router';

export const TRAINEES_ROUTES: Routes = [
    
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    }
];