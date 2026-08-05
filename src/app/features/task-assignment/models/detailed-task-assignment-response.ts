import { TaskAssignmentStatusEnum } from "./task-assignment-status.enum";
import { Trainee } from "../../trainees/models/trainee.model";
import { Mentor } from "../../mentors/models/mentors.model";
import { LearningTaskResponse } from "../../learning-tasks/models/learning-task-response.model";

export interface DetailedTaskAssignmentResponse {
    id: number;
    traineeId: number;
    mentorId: number;
    taskId: number;
    assignedDate: string;
    dueDate: string;
    status: TaskAssignmentStatusEnum;
    remarks: string;
    trainee?: Trainee;
    mentor?: Mentor;
    task?: LearningTaskResponse;
}