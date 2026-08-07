import { ReviewStatusEnum } from "./review-status.enum";

export interface ReviewRequest {
    submissionId: number;
    mentorId: number;
    feedback: string;
    score: number;
    reviewDate: string;
    status: ReviewStatusEnum;
}