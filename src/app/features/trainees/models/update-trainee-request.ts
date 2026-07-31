import { TraineeStatusEnum } from "./traineestatus.enum";

export interface UpdateTraineeRequest{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    techStack: string;
    status: TraineeStatusEnum
}