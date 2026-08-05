import { SubmissionStatusEnum } from "./SubmissionStatus.enum";

export interface SubmissionResponse {
    id: number;
    taskAssignmentId: number;
    submissionUrl: string;
    notes: string;
    submittedDate: string;
    status: SubmissionStatusEnum;
}