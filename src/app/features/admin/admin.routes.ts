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
        loadComponent: () => import('../auth/add-user/add-user.component').then(c => c.AddUserComponent)
    },

    {
        path: 'trainees',
        children: [
            {
                path: '',
                loadComponent: () => import('../trainees/trainee-list/view-trainee-list.component').then(c => c.ViewTraineesListComponent)
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../trainees/trainee-details/trainee-details.component').then(c => c.TraineeDetailComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('../trainees/edit-trainee/edit-trainee.component').then(c => c.EditUserComponent)
                    }
                ],
                
            }
        ]
    },

    {
        path: 'mentors',
        children: [
            {
                path: '',
                loadComponent: () => import('../mentors/mentor-list/view-mentor-list.component').then(c => c.ViewMentorsListComponent)
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../mentors/mentor-details/mentor-details.component').then(c => c.MentorDetailComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('../mentors/edit-mentor/edit-mentor.component').then(c => c.EditMentorComponent)
                    }
                ],
                
            }
        ]
    },

    {
        path: 'learning-tasks',
        children: [
            {
                path: '',
                loadComponent: () => import('../learning-tasks/learning-tasks-list/learning-tasks-list.component').then(c => c.LearningTaskListComponent)
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../mentors/mentor-details/mentor-details.component').then(c => c.MentorDetailComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('../mentors/edit-mentor/edit-mentor.component').then(c => c.EditMentorComponent)
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