import { UserRolesEnum } from '../enums/user-roles.enum';

export interface User {
    id: number;
    userName: string;
    role: UserRolesEnum;
}