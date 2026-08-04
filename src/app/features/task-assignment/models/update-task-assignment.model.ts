import { TaskAssignmentStatusEnum } from "./task-assignment-status.enum";

export interface UpdateTaskAssignmentRequest {
    traineeId?: number | null;
    mentorId?: number | null;
    taskId?: number | null;
    assignedDate?: string | null;
    dueDate?: string | null;
    status?: TaskAssignmentStatusEnum | null;
    remarks?: string | null;
}