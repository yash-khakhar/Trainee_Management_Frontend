import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UserRolesEnum } from './features/auth/enums/user-roles.enum';
import { TraineeLayoutComponent } from './features/trainees/trainee-layout/trainee-layout.component';
import { MentorLayoutComponent } from './features/mentors/mentor-layout/mentor-layout.component';

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
        component: TraineeLayoutComponent,
        loadChildren: () => import('./features/trainees/trainees.routes').then(r => r.TRAINEES_ROUTES)
    },

    {
        path: 'mentors',
        component: MentorLayoutComponent,
        loadChildren: () => import('./features/mentors/mentors.routes').then(r => r.MENTORS_ROUTES)
    },

    {
        path: 'admin',
        canActivate: [authGuard],
        data: {
            roles: [UserRolesEnum.ADMIN]
        },
        loadChildren: () => import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES)
    },

    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized').then(c => c.Unauthorized)
    },

    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent)
    }

];