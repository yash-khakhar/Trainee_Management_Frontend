import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TaskAssignmentService } from '../../services/task-assignment.service';
import { SubmissionService } from '../../../submissions/services/submission.service';
import { SubmissionResponse } from '../../../submissions/models/SubmissionResponse.model';
import { SubmissionStatusEnum } from '../../../submissions/models/SubmissionStatus.enum';
import { DetailedTaskAssignmentResponse } from '../../models/detailed-task-assignment-response';
import { NotificationService } from '../../../../shared/services/NotificationService.service';
import { SubmissionFileResponse } from '../../../submissions/models/SubmissionFileResponse.model';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/models/user.model';
import { UserRolesEnum } from '../../../auth/enums/user-roles.enum';

import { ReviewService } from '../../../reviews/services/review.services';
import { ReviewStatusEnum } from '../../../reviews/models/review-status.enum';
import { ReviewRequest } from '../../../reviews/models/review-request.model';
import { ReviewResponse } from '../../../reviews/models/review-response.model';

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
    private authService = inject(AuthService);
    private reviewService = inject(ReviewService);

    isLoading = signal<boolean>(true);
    isSubmitting = signal<boolean>(false);
    private user: User | null = null;
    isMentor = signal<boolean>(false);

    assignment = signal<DetailedTaskAssignmentResponse | null>(null);
    submissions = signal<SubmissionResponse[]>([]); 

    submissionUrl: string = '';
    notes: string = '';
    selectedFiles: File[] = [];
    isFileRequiredError: boolean = false;

    selectedSubmissionId = signal<number | null>(null);
    submissionFiles = signal<SubmissionFileResponse[]>([]);
    isFetchingFiles = signal<boolean>(false);
    downloadingFileId = signal<number | null>(null);

    reviewFeedback: string = '';
    reviewScore: number | null = null;
    reviewStatus: ReviewStatusEnum = ReviewStatusEnum.ACCEPTED;
    isSubmittingReview = signal<boolean>(false);
    reviewStatuses = Object.values(ReviewStatusEnum);

    currentSubmissionReview = signal<ReviewResponse | null>(null);
    isFetchingReview = signal<boolean>(false);

    constructor(){
        this.user = this.authService.currentUser;
        this.isMentor.set(this.user?.role === UserRolesEnum.MENTOR);
    }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const assignmentId = Number(idParam);
            this.fetchAssignmentDetail(assignmentId);
            this.fetchSubmissionsHistory(assignmentId);
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

    fetchSubmissionsHistory(taskAssignmentId: number): void {
        this.submissionService.getSubmissionsByTaskAssignment(taskAssignmentId).subscribe({
            next: (res) => {
                this.submissions.set(res);
            },
            error: (err) => {
                console.error('Failed to load submissions history', err);
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
        this.isFileRequiredError = this.selectedFiles.length === 0;

        if (form.invalid || this.isFileRequiredError || !this.assignment()) {
            return;
        }

        this.isSubmitting.set(true);

        const currentAssignment = this.assignment()!;
        const currentDate = new Date().toISOString().split('T')[0];

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

                this.fetchSubmissionsHistory(currentAssignment.id);
            },
            error: (err) => {
                this.isSubmitting.set(false);
                this.notificationService.error(err.error?.Message || 'Failed to process submission.');
            }
        });
    }

    onSelectSubmission(sub: SubmissionResponse): void {
        if (this.selectedSubmissionId() === sub.id) {
            this.selectedSubmissionId.set(null);
            this.currentSubmissionReview.set(null);
            return;
        }
        this.selectedSubmissionId.set(sub.id);
        this.reviewFeedback = '';
        this.reviewScore = null;
        this.reviewStatus = ReviewStatusEnum.ACCEPTED;
        
        this.fetchFiles(sub.id);
        this.fetchReviewForSubmission(sub.id);
    }

    fetchFiles(submissionId: number): void {
        this.isFetchingFiles.set(true);
        this.submissionService.getSubmissionFilesBySubmissionId(submissionId).subscribe({
            next: (files) => {
                this.submissionFiles.set(files);
                this.isFetchingFiles.set(false);
            },
            error: () => this.isFetchingFiles.set(false)
        });
    }

    fetchReviewForSubmission(submissionId: number): void {
        this.isFetchingReview.set(true);
        this.currentSubmissionReview.set(null);

        this.reviewService.getReviewBySubmissionId(submissionId).subscribe({
            next: (review) => {
                this.currentSubmissionReview.set(review);
                this.isFetchingReview.set(false);
            },
            error: () => {
                this.currentSubmissionReview.set(null);
                this.isFetchingReview.set(false);
            }
        });
    }

    downloadFile(file: SubmissionFileResponse, event: MouseEvent): void {
        event.stopPropagation(); 
        this.downloadingFileId.set(file.id);

        this.submissionService.downloadSubmissionFile(file.id).subscribe({
            next: (blob) => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = file.fileName; 
                link.click();
                window.URL.revokeObjectURL(downloadUrl);
                this.downloadingFileId.set(null);
            },
            error: (err) => {
                this.downloadingFileId.set(null);
                this.notificationService.error('Failed to download file.');
                console.error('Download error', err);
            }
        });
    }

    onSubmitReview(submissionId: number, reviewForm: any): void {
        if (reviewForm.invalid || !this.user) {
            return;
        }

        this.isSubmittingReview.set(true);
        const reviewDate = new Date().toISOString().split('T')[0];

        const payload: ReviewRequest = {
            submissionId: submissionId,
            mentorId: this.user.id,
            feedback: this.reviewFeedback,
            score: Number(this.reviewScore),
            reviewDate: reviewDate,
            status: this.reviewStatus
        };

        this.reviewService.addReview(payload).subscribe({
            next: (res) => {
                this.isSubmittingReview.set(false);
                this.notificationService.success('Review submitted successfully!');
                reviewForm.resetForm();
                this.reviewStatus = ReviewStatusEnum.ACCEPTED;
                
                this.currentSubmissionReview.set(res);
                if (this.assignment()) {
                    this.fetchAssignmentDetail(this.assignment()!.id);
                    this.fetchSubmissionsHistory(this.assignment()!.id);
                }
            },
            error: (err) => {
                this.isSubmittingReview.set(false);
                this.notificationService.error(err.error?.Message || 'Failed to submit review.');
            }
        });
    }
}