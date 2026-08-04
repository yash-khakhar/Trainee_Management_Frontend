import { TaskAssignmentStatusEnum } from "./task-assignment-status.enum";

export interface CreateTaskAssignmentRequest {
    traineeId: number;
    mentorId: number;
    taskId: number;
    assignedDate: string; 
    status: TaskAssignmentStatusEnum;
    remarks?: string | null;
}
