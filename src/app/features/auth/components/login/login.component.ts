import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserLoginRequestDto } from '../../models/user-login-request.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/text-input/input.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
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
            passwordHash: this.loginForm.controls.password.value
        };

        this.authService.login(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Invalid credentials or server error.');
            }
        });
    }

}