import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TraineeService } from '../../trainees/services/trainees.service';
import { UserRolesEnum } from '../../auth/enums/user-roles.enum';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';
import { TraineeStatusEnum } from '../../trainees/models/traineestatus.enum';
import { CommonModule } from '@angular/common';
import { UpdateTraineeRequest } from '../../trainees/models/update-trainee-request';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent, AdminLayoutComponent, CommonModule],
    templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {

    private fb = inject(FormBuilder);
    private traineeService = inject(TraineeService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    isLoading = signal<boolean>(false);
    isFetching = signal<boolean>(true);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null); // Added success message signal
    userId!: number;

    status = [
        { label: 'Active', value: TraineeStatusEnum.ACTIVE },
        { label: 'Inactive', value: TraineeStatusEnum.INACTIVE }
    ];

    roles = [
        { label: 'Trainee', value: UserRolesEnum.TRAINEE },
        { label: 'Mentor', value: UserRolesEnum.MENTOR },
        { label: 'Admin', value: UserRolesEnum.ADMIN }
    ];

    editForm = this.fb.nonNullable.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        techStack: ['', [Validators.required]],
        status: [TraineeStatusEnum.ACTIVE, [Validators.required]]
    });

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.userId = Number(idParam);
            this.fetchUserData(this.userId);
        }
    }

    fetchUserData(id: number) {
        this.isFetching.set(true);
        this.traineeService.getTraineeById(id).subscribe({
            next: (user) => {
                if(user != null){
                    this.editForm.patchValue({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        techStack: user.techStack,
                        status: user.status
                    });
                }
                this.isFetching.set(false);
            },
            error: (err) => {
                this.isFetching.set(false);
                this.errorMessage.set('Failed to load trainee profile data.');
            }
        });
    }

    onSubmit(): void {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null); // Clear previous success message

        const formValues = this.editForm.getRawValue();

        const traineeData: UpdateTraineeRequest = {
            id: this.userId,
            ...formValues
        }

        this.traineeService.updateTrainee(traineeData).pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: () => {
                // Show success message and stay on the same page
                this.successMessage.set('Trainee profile updated successfully!');
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message || 'Profile update failed. Check inputs.');
            }
        });
    }
}