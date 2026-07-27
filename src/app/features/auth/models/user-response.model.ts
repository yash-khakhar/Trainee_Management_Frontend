import { UserRolesEnum } from '../enums/user-roles.enum';

export interface UserResponse {
    id: number;
    userName: string;
    role: UserRolesEnum;
}