import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';

@Component({
    selector: 'app-admin-not-found',
    standalone: true,
    imports: [ButtonComponent, AdminLayoutComponent],
    templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
    private router = inject(Router);

    goBack(): void {
        this.router.navigate(['/admin']);
    }
}