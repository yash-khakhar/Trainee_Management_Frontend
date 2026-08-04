import { TaskStatusEnum } from "./taskstatus.enum";

export interface LearningTaskResponse {
    id: number;
    title: string;
    description: string;
    expectedTechStack: string;
    dueDate: string; 
    status: TaskStatusEnum;
    createdAt: string;
    updatedAt: string;
}