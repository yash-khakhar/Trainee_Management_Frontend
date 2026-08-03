import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { UserRolesEnum } from '../enums/user-roles.enum';
import { UserStatusEnum } from '../enums/user-status.enum';
import { CreateUserRequest } from '../models/create-user-request.model';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';

@Component({
    selector: 'app-add-user',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent, AdminLayoutComponent],
    templateUrl: './add-user.component.html'
})
export class AddUserComponent {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    status = [
        { label: 'Active', value: UserStatusEnum.ACTIVE },
        { label: 'Inactive', value: UserStatusEnum.INACTIVE }
    ];

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
        status: [UserStatusEnum.ACTIVE, [Validators.required]],
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
            status: formValues.status 
        };

        this.authService.register(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set('User Created successfully!');
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.Message || 'Account Creation failed. Check inputs.');
            }
        });
    }
}