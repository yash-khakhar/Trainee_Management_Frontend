import { TaskStatusEnum } from "./taskstatus.enum";

export interface UpsertLearningTaskRequest {
    title?: string;
    description?: string;
    expectedTechStack?: string;
    dueDate?: string;
    status?: TaskStatusEnum;
}