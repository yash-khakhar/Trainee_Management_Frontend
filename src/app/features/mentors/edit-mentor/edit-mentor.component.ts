import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { UserRolesEnum } from '../../auth/enums/user-roles.enum';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../admin/admin-layout/admin-layout.component';
import { CommonModule } from '@angular/common';
import { MentorsService } from '../services/mentors.service';
import { MentorStatusEnum } from '../models/mentorstatus.enum';
import { UpdateMentorRequest } from '../models/update-mentor-request';
import { NotificationService } from '../../../shared/services/NotificationService.service';

@Component({
    selector: 'app-edit-mentor',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent, AdminLayoutComponent, CommonModule],
    templateUrl: './edit-mentor.component.html'
})
export class EditMentorComponent implements OnInit {

    private fb = inject(FormBuilder);
    private mentorService = inject(MentorsService);
    private route = inject(ActivatedRoute);
    private notificationService = inject(NotificationService);

    isLoading = signal<boolean>(false);
    isFetching = signal<boolean>(true);
    userId!: number;

    status = [
        { label: 'Active', value: MentorStatusEnum.ACTIVE },
        { label: 'Inactive', value: MentorStatusEnum.INACTIVE }
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
        expertise: ['', [Validators.required]],
        status: [MentorStatusEnum.ACTIVE, [Validators.required]]
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
        this.mentorService.getMentorById(id).subscribe({
            next: (user) => {
                if(user != null){
                    this.editForm.patchValue({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        expertise: user.expertise,
                        status: user.status
                    });
                }
                this.isFetching.set(false);
            },
            error: (err) => {
                this.isFetching.set(false);
                this.notificationService.error('Failed to load mentor profile data.');
            }
        });
    }

    onSubmit(): void {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

        const formValues = this.editForm.getRawValue();

        const mentorData: UpdateMentorRequest = {
            id: this.userId,
            ...formValues
        }

        this.mentorService.updateMentor(mentorData).pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: () => {
                this.notificationService.success('Mentor profile updated successfully!');
            },
            error: (err) => {
                this.notificationService.error(err.error?.Message || 'Profile update failed. Check inputs.');
            }
        });
    }
}