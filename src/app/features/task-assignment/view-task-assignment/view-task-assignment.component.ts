import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TaskAssignmentService } from '../services/task-assignment.service';
import { TraineeService } from '../../trainees/services/trainees.service';
import { MentorsService } from '../../mentors/services/mentors.service';
import { LearningTaskService } from '../../learning-tasks/services/learning-tasks.service';

import { LearningTaskResponse } from '../../learning-tasks/models/learning-task-response.model';
import { Mentor } from '../../mentors/models/mentors.model';
import { Trainee } from '../../trainees/models/trainee.model';
import { TaskAssignmentResponse } from '../models/task-assignment-response.model';
import { UpdateTaskAssignmentRequest } from '../models/update-task-assignment.model';
import { TaskAssignmentStatusEnum } from '../models/task-assignment-status.enum';

import { AdminLayoutComponent } from '../../admin/admin-layout/admin-layout.component';
import { NotificationService } from '../../../shared/services/NotificationService.service';

@Component({
    selector: 'app-view-task-assignments',
    standalone: true,
    imports: [CommonModule, RouterLink, AdminLayoutComponent],
    templateUrl: './view-task-assignment.component.html'
})
export class ViewTaskAssignmentsComponent implements OnInit {

    private taskAssignmentService = inject(TaskAssignmentService);
    private traineeService = inject(TraineeService);
    private mentorService = inject(MentorsService);
    private learningTaskService = inject(LearningTaskService);
    private notificationService = inject(NotificationService);

    isLoading = signal<boolean>(true);

    assignments = signal<TaskAssignmentResponse[]>([]);
    traineesMap = new Map<number, string>();
    mentorsMap = new Map<number, string>();
    tasksMap = new Map<number, string>();

    statuses = [
        { label: 'Assigned', value: TaskAssignmentStatusEnum.Assigned },
        { label: 'InProgress', value: TaskAssignmentStatusEnum.InProgess },
        { label: 'Submitted', value: TaskAssignmentStatusEnum.Submitted },
        { label: 'Reviewed', value: TaskAssignmentStatusEnum.Reviewed },
        { label: 'Completed', value: TaskAssignmentStatusEnum.Completed }
    ];

    ngOnInit(): void {
        this.loadMetaDataAndAssignments();
    }

    loadMetaDataAndAssignments(): void {
        this.isLoading.set(true);

        Promise.all([
            this.fetchTrainees(),
            this.fetchMentors(),
            this.fetchTasks()
        ]).then(() => {
            this.fetchAssignments();
        }).catch(() => {
            this.notificationService.error('Failed to load lookup context data.');
            this.isLoading.set(false);
        });
    }

    private fetchTrainees(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.traineeService.getTrainees().subscribe({
                next: (res: any) => {
                    const list = Array.isArray(res) ? res : (res.items || res.data || []);
                    list.forEach((t: Trainee) => this.traineesMap.set(t.id, `${t.firstName} ${t.lastName}`));
                    resolve();
                },
                error: (err) => reject(err)
            });
        });
    }

    private fetchMentors(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.mentorService.getMentors().subscribe({
                next: (res: any) => {
                    const list = Array.isArray(res) ? res : (res.items || res.data || []);
                    list.forEach((m: Mentor) => this.mentorsMap.set(m.id, `${m.firstName} ${m.lastName}`));
                    resolve();
                },
                error: (err) => reject(err)
            });
        });
    }

    private fetchTasks(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.learningTaskService.getAllTasks().subscribe({
                next: (res: LearningTaskResponse[]) => {
                    res.forEach((t) => this.tasksMap.set(t.id, t.title));
                    resolve();
                },
                error: (err) => reject(err)
            });
        });
    }

    private fetchAssignments(): void {
        this.taskAssignmentService.getTaskAssignments().subscribe({
            next: (res) => {
                this.assignments.set(res);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.notificationService.error(err.error?.Message || 'Failed to load task assignments.');
                this.isLoading.set(false);
            }
        });
    }

    onStatusChange(assignment: TaskAssignmentResponse, newStatus: string): void {
        const typedStatus = newStatus as TaskAssignmentStatusEnum;
        if (assignment.status === typedStatus) return;

        const payload: UpdateTaskAssignmentRequest = {
            status: typedStatus
        };

        this.taskAssignmentService.updateTaskAssignment(assignment.id, payload).subscribe({
            next: (updated) => {
                this.assignments.update(list =>
                    list.map(item => item.id === assignment.id ? { ...item, status: updated.status || typedStatus } : item)
                );
                this.notificationService.success(`Status updated successfully for Assignment #${assignment.id}`);
            },
            error: (err) => {
                this.notificationService.error(err.error?.Message || 'Failed to update assignment status.');
            }
        });
    }

    getTraineeName(traineeId: number): string {
        return this.traineesMap.get(traineeId) || `Trainee #${traineeId}`;
    }

    getMentorName(mentorId: number): string {
        return this.mentorsMap.get(mentorId) || `Mentor #${mentorId}`;
    }

    getTaskTitle(taskId: number): string {
        return this.tasksMap.get(taskId) || `Task #${taskId}`;
    }
}