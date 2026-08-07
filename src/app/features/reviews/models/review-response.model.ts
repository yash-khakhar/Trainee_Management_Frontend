export interface ReviewResponse {
    id: number;
    submissionId: number;
    mentorId: number;
    feedback: string;
    score: number;
    reviewDate: string;
    status: string;
}