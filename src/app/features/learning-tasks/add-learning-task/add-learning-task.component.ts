import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LearningTaskService } from '../services/learning-tasks.service';
import { TaskStatusEnum } from '../models/taskstatus.enum';
import { UpsertLearningTaskRequest } from '../models/upsert-learning-task-request.model';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';
import { NotificationService } from '../../../shared/services/NotificationService.service';

@Component({
    selector: 'app-learning-task-create',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent, AdminLayoutComponent],
    templateUrl: './add-learning-task.component.html'
})
export class LearningTaskCreateComponent {

    private fb = inject(FormBuilder);
    private taskService = inject(LearningTaskService);
    private notificationService = inject(NotificationService);

    isLoading = signal<boolean>(false);

    statuses = [
        { label: 'Draft', value: TaskStatusEnum.Draft },
        { label: 'Published', value: TaskStatusEnum.Published },
        { label: 'Archived', value: TaskStatusEnum.Archived }
    ];

    taskForm = this.fb.nonNullable.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        expectedTechStack: ['', [Validators.required]],
        dueDate: ['', [Validators.required]],
        status: [TaskStatusEnum.Draft, [Validators.required]]
    });

    onSubmit(): void {
        if (this.taskForm.invalid) {
            this.taskForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

        const formValues = this.taskForm.getRawValue();
        const payload: UpsertLearningTaskRequest = {
            title: formValues.title,
            description: formValues.description,
            expectedTechStack: formValues.expectedTechStack,
            dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : undefined,
            status: formValues.status
        };

        this.taskService.createTask(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.notificationService.success('Learning Task created successfully!');
                this.taskForm.reset({ status: TaskStatusEnum.Draft });
            },
            error: (err) => {
                this.isLoading.set(false);
                this.notificationService.error(err.error?.Message || 'Operation failed. Please check inputs.');
            }
        });
    }
}