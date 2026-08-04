import { TaskAssignmentStatusEnum } from "./task-assignment-status.enum";

export interface TaskAssignmentResponse {
    id: number;
    traineeId: number;
    mentorId: number;
    taskId: number;
    assignedDate: string; 
    dueDate: string;      
    status: TaskAssignmentStatusEnum;
    remarks: string;
}