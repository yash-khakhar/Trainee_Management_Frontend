import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../features/auth/services/auth.service";
import { UserRolesEnum } from "../../features/auth/enums/user-roles.enum";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser;

    if(!user){
        return router.createUrlTree(['/']);
    }

    const allowedRoles = route.data['roles'] as UserRolesEnum[];

    if(!allowedRoles || allowedRoles.length === 0){
        return true;
    }

    if(allowedRoles.includes(user.role)){
        return true;
    }

    return router.createUrlTree(['/not-found']);

}