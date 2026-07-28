import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { UserRolesEnum } from '../auth/enums/user-roles.enum';

export const ADMIN_ROUTES: Routes = [
    
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.ADMIN]
        },
        loadComponent: () => import('./admin.component').then(m => m.AdminDashboardComponent)
    }
];