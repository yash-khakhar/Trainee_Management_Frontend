import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserLoginRequestDto } from '../models/user-login-request.model';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../shared/components/UI/text-input/input.component';
import { UserRolesEnum } from '../enums/user-roles.enum';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
    templateUrl: './login.component.html'
})
export class LoginComponent {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    loginForm = this.fb.nonNullable.group({
        userName: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    onSubmit(): void {

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const payload: UserLoginRequestDto = {
            userName: this.loginForm.controls.userName.value,
            password: this.loginForm.controls.password.value
        };

        this.authService.login(payload).subscribe({
            next: (user) => {
                this.isLoading.set(false);
                if(user.role === UserRolesEnum.ADMIN){
                    console.log(user)
                    this.router.navigate(['/admin']);    
                } else{
                    this.router.navigate(['/trainees']);
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.Message || 'Invalid credentials or server error.');
            }
        });
    }

}