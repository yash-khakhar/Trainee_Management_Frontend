import { User } from './user.model';

export interface UserLoginResponse {
    token: string;
    expiresIn: number;
    user: User;
}