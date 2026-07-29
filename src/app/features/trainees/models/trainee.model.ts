import { TraineeStatusEnum } from "./traineestatus.enum";

export interface Trainee {
    
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    techStack: string,
    status: TraineeStatusEnum,
    createdAt: Date,
    updatedAt: Date
}