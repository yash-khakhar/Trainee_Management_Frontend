import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TaskAssignmentService } from '../services/task-assignment.service';
import { SubmissionService } from '../../submissions/services/submission.service';
import { SubmissionResponse } from '../../submissions/models/SubmissionResponse.model';
import { SubmissionStatusEnum } from '../../submissions/models/SubmissionStatus.enum';
import { DetailedTaskAssignmentResponse } from '../models/detailed-task-assignment-response';
import { NotificationService } from '../../../shared/services/NotificationService.service';

@Component({
    selector: 'app-task-assignment-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './task-assignment-detail.component.html'
})
export class TaskAssignmentDetailComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private taskAssignmentService = inject(TaskAssignmentService);
    private submissionService = inject(SubmissionService);
    private notificationService = inject(NotificationService);

    isLoading = signal<boolean>(true);
    isSubmitting = signal<boolean>(false);

    assignment = signal<DetailedTaskAssignmentResponse | null>(null);

    submissionUrl: string = '';
    notes: string = '';
    selectedFiles: File[] = [];
    isFileRequiredError: boolean = false;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.fetchAssignmentDetail(Number(idParam));
        } else {
            this.notificationService.error('Invalid task assignment reference.');
            this.isLoading.set(false);
        }
    }

    fetchAssignmentDetail(id: number): void {
        this.taskAssignmentService.getTaskAssignmentById(id).subscribe({
            next: (res) => {
                this.assignment.set(res);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.notificationService.error(err.error?.Message || 'Failed to load task assignment details.');
                this.isLoading.set(false);
            }
        });
    }

    onFilesSelected(event: any): void {
        const files: FileList = event.target.files;
        if (files && files.length > 0) {
            this.selectedFiles = Array.from(files);
            this.isFileRequiredError = false;
        } else {
            this.selectedFiles = [];
        }
    }

    onSubmitWork(form: any): void {
        // Check file validation condition explicitly
        this.isFileRequiredError = this.selectedFiles.length === 0;

        if (form.invalid || this.isFileRequiredError || !this.assignment()) {
            return;
        }

        this.isSubmitting.set(true);

        const currentAssignment = this.assignment()!;
        const currentDate = new Date().toISOString();

        this.submissionService.addSubmission(
            currentAssignment.id,
            this.submissionUrl,
            this.notes,
            currentDate,
            SubmissionStatusEnum.Submitted,
            this.selectedFiles
        ).subscribe({
            next: (res: SubmissionResponse) => {

                this.isSubmitting.set(false);
                this.notificationService.success('Work submitted successfully!');

                this.submissionUrl = '';
                this.notes = '';
                this.selectedFiles = [];
                form.resetForm();
                
            },
            error: (err) => {
                this.isSubmitting.set(false);
                this.notificationService.error(err.error?.Message || 'Failed to process submission.');
            }
        });
    }
}