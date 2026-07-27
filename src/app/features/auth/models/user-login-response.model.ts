import { UserResponse } from './user-response.model';

export interface UserLoginResponse {
    token: string;
    expiresIn: number;
    user: UserResponse;
}