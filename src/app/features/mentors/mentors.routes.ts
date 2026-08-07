import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { UserRolesEnum } from '../auth/enums/user-roles.enum';

export const MENTORS_ROUTES: Routes = [
    
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.MENTOR]
        },
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },

    {
        path: 'task-assignment/:id',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.MENTOR]
        },
        loadComponent: () => import('../task-assignment/task-assignment-detail/task-assignment-detail.component').then(m => m.TaskAssignmentDetailComponent)
    },

];