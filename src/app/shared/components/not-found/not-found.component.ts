import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserRolesEnum } from '../../../features/auth/enums/user-roles.enum';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [ButtonComponent],
    templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

    private authService = inject(AuthService);
    private router = inject(Router);

    goBack(): void {

        const user = this.authService.currentUser;

        if (!user) {
            this.router.navigate(['auth']);
            return;
        }

        if (user.role === UserRolesEnum.ADMIN) {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/trainees']);
        }
    }

}