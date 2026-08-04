import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { LearningTaskService } from './services/learning-tasks.service';
import { TaskStatusEnum } from './models/taskstatus.enum';
import { UpsertLearningTaskRequest } from './models/upsert-learning-task-request.model';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { InputComponent } from '../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../shared/components/layouts/admin-layout/admin-layout.component';

@Component({
    selector: 'app-learning-task',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonComponent, InputComponent, AdminLayoutComponent, DatePipe],
    templateUrl: './learning-tasks.component.html'
})
export class LearningTaskComponent implements OnInit {

    private fb = inject(FormBuilder);
    private taskService = inject(LearningTaskService);
    private route = inject(ActivatedRoute);

    mode = input<'add' | 'edit' | 'view'>('add');
    taskId = input<number | null>(null);

    isLoading = signal<boolean>(false);
    isFetching = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    createdAt = signal<string | null>(null);
    updatedAt = signal<string | null>(null);

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

    ngOnInit(): void {
        
        const currentMode = this.mode();
        const id = this.taskId() || Number(this.route.snapshot.paramMap.get('id'));

        if ((currentMode === 'edit' || currentMode === 'view') && id) {
            this.fetchTaskDetails(id);
        }

        if (currentMode === 'view') {
            this.taskForm.disable();
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
                this.createdAt.set(task.createdAt);
                this.updatedAt.set(task.updatedAt);
            },
            error: (err) => {
                this.isFetching.set(false);
                this.errorMessage.set(err.error?.Message || 'Failed to load task details.');
            }
        });

    }

    onSubmit(): void {

        if (this.mode() === 'view') return;

        if (this.taskForm.invalid) {
            this.taskForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        const formValues = this.taskForm.getRawValue();
        const payload: UpsertLearningTaskRequest = {
            title: formValues.title,
            description: formValues.description,
            expectedTechStack: formValues.expectedTechStack,
            dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : undefined,
            status: formValues.status
        };

        const currentMode = this.mode();
        const id = this.taskId() || Number(this.route.snapshot.paramMap.get('id'));

        const request$ = currentMode === 'edit' && id
            ? this.taskService.updateTask(id, payload)
            : this.taskService.createTask(payload);

        request$.subscribe({
            next: () => {
                this.isLoading.set(false);
                const actionText = currentMode === 'edit' ? 'updated' : 'created';
                this.successMessage.set(`Learning Task ${actionText} successfully!`);
                if (currentMode === 'add') {
                    this.taskForm.reset({ status: TaskStatusEnum.Draft });
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.Message || 'Operation failed. Please check inputs.');
            }
        });
    }
}