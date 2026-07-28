import { Component, inject } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";

import { AuthService } from "../../../features/auth/services/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [AsyncPipe, RouterLink]
})
export class HeaderComponent{

    private router = inject(Router)
    authService = inject(AuthService)

    onLogout(){

        this.authService.logout().subscribe(() => {
            this.router.navigate(['/auth/login']);
        });

    }
}