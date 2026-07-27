import { UserRolesEnum } from '../enums/user-roles.enum';
import { UserStatusEnum } from '../enums/user-status.enum';

export interface CreateUserRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    techStack: string;
    role: UserRolesEnum;
    status: UserStatusEnum;
}