import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LearningTaskService } from '../services/learning-tasks.service';
import { TaskStatusEnum } from '../models/taskstatus.enum';
import { UpsertLearningTaskRequest } from '../models/upsert-learning-task-request.model';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../admin/admin-layout/admin-layout.component';
import { NotificationService } from '../../../shared/services/NotificationService.service';

@Component({
    selector: 'app-learning-task-edit',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent, AdminLayoutComponent],
    templateUrl: './edit-learning-task.component.html'
})
export class LearningTaskEditComponent implements OnInit {

    private fb = inject(FormBuilder);
    private taskService = inject(LearningTaskService);
    private notificationService = inject(NotificationService)
    private route = inject(ActivatedRoute);

    taskId!: number;

    isLoading = signal<boolean>(false);
    isFetching = signal<boolean>(false);

    statuses = [
        { label: 'DRAFT', value: TaskStatusEnum.Draft },
        { label: 'PUBLISHED', value: TaskStatusEnum.Published },
        { label: 'ARCHIEVED', value: TaskStatusEnum.Archived }
    ];

    taskForm = this.fb.nonNullable.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        expectedTechStack: ['', [Validators.required]],
        dueDate: ['', [Validators.required]],
        status: [TaskStatusEnum.Draft, [Validators.required]]
    });

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.taskId = Number(idParam);
            this.fetchTaskDetails(this.taskId);
        }
    }

    fetchTaskDetails(id: number): void {
        this.isFetching.set(true);
        this.taskService.getTaskById(id).subscribe({
            next: (task) => {
                this.isFetching.set(false);
                this.taskForm.patchValue({
                    title: task.title,
                    description: task.description,
                    expectedTechStack: task.expectedTechStack,
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                    status: task.status
                });
            },
            error: (err) => {
                this.isFetching.set(false);
                this.notificationService.error(err.error?.Message || 'Failed to load task details.');
            }
        });
    }

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

        const id = this.taskId || Number(this.route.snapshot.paramMap.get('id'));

        this.taskService.updateTask(id, payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.notificationService.success('Learning Task updated successfully!');
            },
            error: (err) => {
                this.isLoading.set(false);
                this.notificationService.error(err.error?.Message || 'Operation failed. Please check inputs.');
            }
        });
    }
    
}