import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './features/auth/services/auth.service';
import { UserRolesEnum } from './features/auth/enums/user-roles.enum';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'assignments',
        canActivate: [authGuard],
        loadChildren: () => import('./features/assignments/assignments.routes').then(m => m.ASSIGNMENTS_ROUTES)
    },
    {
        path: 'learning-tasks',
        canActivate: [authGuard],
        loadChildren: () => import('./features/learning-tasks/learning-task.routes').then(m => m.LEARNINGTASK_ROUTES)
    },
    {
        path: 'mentors',
        canActivate: [authGuard],
        loadChildren: () => import('./features/mentors/mentors.routes').then(m => m.MENTORS_ROUTES)
    },
    {
        path: 'submissions',
        canActivate: [authGuard],
        loadChildren: () => import('./features/submissions/submission.routes').then(m => m.SUBMISSIONS_ROUTES)
    },
    {
        path: 'trainees',
        canActivate: [authGuard],
        loadChildren: () => import('./features/trainees/trainees.routes').then(m => m.TRAINEES_ROUTES)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: () => {
            const authService = inject(AuthService);
            const router = inject(Router);

            if (!authService.isAuthenticated()) {
                return '/auth/login';
            }

            const user = authService.currentUser();
            return user?.role === UserRolesEnum.ADMIN ? '/admin' : '/trainees';
        }
    }
];