import { MentorStatusEnum } from "./mentorstatus.enum";

export interface UpdateMentorRequest{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    expertise: string;
    status: MentorStatusEnum
}