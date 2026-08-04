import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { LearningTaskService } from '../services/learning-tasks.service';
import { LearningTaskResponse } from '../models/learning-task-response.model';
import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';

@Component({
    selector: 'app-learning-task-list',
    standalone: true,
    imports: [CommonModule, RouterLink, AdminLayoutComponent, DatePipe],
    templateUrl: './learning-tasks-list.component.html'
})
export class LearningTaskListComponent implements OnInit {

    private taskService = inject(LearningTaskService);

    tasks = signal<LearningTaskResponse[]>([]);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.isLoading.set(true);
        this.taskService.getAllTasks().subscribe({
            next: (data) => {
                this.tasks.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.Message || 'Failed to load tasks.');
                this.isLoading.set(false);
            }
        });
    }
}