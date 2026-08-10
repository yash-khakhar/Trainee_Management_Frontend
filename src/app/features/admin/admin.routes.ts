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
        loadComponent: () => import('../auth/components/add-user/add-user.component').then(c => c.AddUserComponent)
    },

    {
        path: 'trainees',
        children: [
            {
                path: '',
                loadComponent: () => import('../trainees/components/trainee-list/view-trainee-list.component').then(c => c.ViewTraineesListComponent)
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../trainees/components/trainee-details/trainee-details.component').then(c => c.TraineeDetailComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('../trainees/components/edit-trainee/edit-trainee.component').then(c => c.EditUserComponent)
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
                loadComponent: () => import('../mentors/components/mentor-list/view-mentor-list.component').then(c => c.ViewMentorsListComponent)
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../mentors/components/mentor-details/mentor-details.component').then(c => c.MentorDetailComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('../mentors/components/edit-mentor/edit-mentor.component').then(c => c.EditMentorComponent)
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
                loadComponent: () => import('../learning-tasks/components/learning-tasks-list/learning-tasks-list.component').then(c => c.LearningTaskListComponent)
            },
            {
                path: 'add',
                loadComponent: () => import('../learning-tasks/components/add-learning-task/add-learning-task.component').then(c => c.LearningTaskCreateComponent)
            },
            {
                path: ':id',
                children: [
                    
                    {
                        path: 'edit',
                        loadComponent: () => import('../learning-tasks/components/edit-learning-task/edit-learning-task.component').then(c => c.LearningTaskEditComponent)
                    }
                ],
                
            },
        ]
    },

    {
        path: 'task-assignment',
        children: [
            {
                path: '',
                loadComponent: () => import('../task-assignment/components/view-task-assignment/view-task-assignment.component').then(c => c.ViewTaskAssignmentsComponent)

            },
            {
                path: 'add',
                loadComponent: () => import('../task-assignment/components/add-task-assignment/add-task-assignment.component').then(c => c.AddTaskAssignmentComponent)
            }
        ]
    },

    {
        path: '**',
        loadComponent: () => import('./components/not-found/not-found.component').then(c => c.NotFoundComponent)
    }

];