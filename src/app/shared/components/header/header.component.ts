import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../features/auth/services/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent{

    private router = inject(Router)
    private authService = inject(AuthService)

    isAuthenticated = this.authService.isAuthenticated;

    onLogout(){
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}