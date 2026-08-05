import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../auth/services/auth.service';
import { TaskAssignmentService } from '../../task-assignment/services/task-assignment.service';
import { NotificationService } from '../../../shared/services/NotificationService.service';

import { DetailedTaskAssignmentResponse } from '../../task-assignment/models/detailed-task-assignment-response';


@Component({
  selector: 'trainee-app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {

  private taskAssignmentService = inject(TaskAssignmentService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoading = signal<boolean>(true);

  assignments = signal<DetailedTaskAssignmentResponse[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    const currentUser = this.authService.currentUser;
    const traineeId = currentUser?.id;

    if (!traineeId) {
      this.notificationService.error('Unable to identify current user session.')
      this.isLoading.set(false);
      return;
    }

    this.taskAssignmentService.getTaskAssignmentsByTraineeId(traineeId).subscribe({
      next: (res) => {
        this.assignments.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.notificationService.error(err.error?.Message || 'Failed to load your assigned tasks.')
        this.isLoading.set(false);
      }
    });

  }

}