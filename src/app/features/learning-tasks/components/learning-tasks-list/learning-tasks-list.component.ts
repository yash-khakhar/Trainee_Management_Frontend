import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { NotificationService } from '../../../../shared/services/NotificationService.service';
import { AdminLayoutComponent } from '../../../admin/components/admin-layout/admin-layout.component';
import { LearningTaskResponse } from '../../models/learning-task-response.model';
import { LearningTaskService } from '../../services/learning-tasks.service';

@Component({
    selector: 'app-learning-task-list',
    standalone: true,
    imports: [CommonModule, RouterLink, AdminLayoutComponent, DatePipe],
    templateUrl: './learning-tasks-list.component.html'
})
export class LearningTaskListComponent implements OnInit {

    private taskService = inject(LearningTaskService);
    private notificationService = inject(NotificationService);

    tasks = signal<LearningTaskResponse[]>([]);
    isLoading = signal<boolean>(false);

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
                this.notificationService.error(err.error?.Message || 'Failed to load tasks.');
                this.isLoading.set(false);
            }
        });
    }
}