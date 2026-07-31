import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        loadComponent: () => import('./admin.component').then(c => c.AdminDashboardComponent)
    },

    {
        path: 'create-user',
        loadComponent: () => import('./add-user/add-user.component').then(c => c.AddUserComponent)
    },

    {
        path: 'trainees',
        children: [
            {
                path: '',
                loadComponent: () => import('./trainees/trainee-list/view-trainee-list.component').then(c => c.ViewTraineesListComponent)
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./trainees/trainee-details/trainee-details.component').then(c => c.TraineeDetailComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('./edit-user/edit-user.component').then(c => c.EditUserComponent)
                    }
                ],
                
            }
        ]
    },

    {
        path: '**',
        loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)
    }

];