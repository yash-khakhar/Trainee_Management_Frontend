import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserRolesEnum } from '../../../features/auth/enums/user-roles.enum';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html'
})
export class Unauthorized {

  private authService = inject(AuthService);
  private router = inject(Router);

  goToDashboard(){

    const user = this.authService.currentUser;

    if(!user){
      this.router.navigate(['login']);
      return;
    }

    if(user.role === UserRolesEnum.ADMIN){
      this.router.navigate(['/admin']);
    } else{
      this.router.navigate(['/trainees']);
    }

  }
  
  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    })
  }
  
}
