import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserRolesEnum } from '../../enums/user-roles.enum';
import { UserStatusEnum } from '../../enums/user-status.enum';
import { CreateUserRequest } from '../../models/create-user-request.model';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../../shared/components/UI/text-input/input.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    roles = [
        { label: 'Trainee', value: UserRolesEnum.TRAINEE },
        { label: 'Mentor', value: UserRolesEnum.MENTOR },
        { label: 'Admin', value: UserRolesEnum.ADMIN }
    ];

    registerForm = this.fb.nonNullable.group({
        username: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        techStack: ['', [Validators.required]],
        role: [UserRolesEnum.TRAINEE, [Validators.required]]
    });

    onSubmit(): void {

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const formValues = this.registerForm.getRawValue();

        const payload: CreateUserRequest = {
            ...formValues,
            role: formValues.role,
            status: UserStatusEnum.ACTIVE // Defaults to Active on creation
        };

        this.authService.register(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Registration failed. Check inputs.');
            }
        });
    }

}