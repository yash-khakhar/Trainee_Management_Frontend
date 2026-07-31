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
        loadComponent: () => import('./admin.component').then(c => c.AdminDashboardComponent)
    },

    {
        path: 'create-user',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.ADMIN]
        },
        loadComponent: () => import('./add-user/add-user.component').then(c => c.AddUserComponent)
    },

    {
        path: 'trainees-list',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.ADMIN]
        },
        loadComponent: () => import('./trainees/trainee-list/view-trainee-list.component').then(c => c.ViewTraineesListComponent)
    },

    {
        path: 'trainees/:id',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.ADMIN]
        },
        children: [
            {
                path: '',
                loadComponent: () => import('./trainees/trainee-details/trainee-details.component').then(c => c.TraineeDetailComponent)
            },
            {
                path: 'edit',
                loadComponent: () => import('./edit-user/edit-user.component').then(c => c.EditUserComponent)
            }
        ]
    }
];