import { MentorStatusEnum } from "./mentorstatus.enum"

export interface Mentor {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    expertise: string,
    status: MentorStatusEnum,
    createdAt: Date,
    updatedAt: Date
}