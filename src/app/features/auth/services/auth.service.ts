import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserLoginRequestDto } from '../models/user-login-request.model';
import { UserLoginResponse } from '../models/user-login-response.model';
import { CreateUserRequest } from '../models/create-user-request.model';
import { UserResponse } from '../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
  
    // Point to your ASP.NET Core API Base URL
    private readonly baseUrl = 'http://localhost:5000/api/Auth';

    // State Management with Signals
    currentUser = signal<UserResponse | null>(this.getStoredUser());
    token = signal<string | null>(null);
    isAuthenticated = computed(() => !!this.token());

    /**
     * Post to /api/Auth/login
     */
    login(credentials: UserLoginRequestDto): Observable<UserLoginResponse> {
        return this.http.post<UserLoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
            tap((response) => this.setSession(response))
        );
    }

    /**
     * Post to /api/Auth/register
     */
    register(userData: CreateUserRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.baseUrl}/register`, userData);
    }

    /**
     * Clear auth token & user state on logout
     */
    logout(): void {
        //localStorage.removeItem('jwt_token');
        //localStorage.removeItem('user_info');
        this.token.set(null);
        this.currentUser.set(null);
    }

    private setSession(authResult: UserLoginResponse): void {
        //localStorage.setItem('jwt_token', authResult.token);
        //localStorage.setItem('user_info', JSON.stringify(authResult.user));
        this.token.set(authResult.token);
        this.currentUser.set(authResult.user);
    }

    private getStoredUser(): UserResponse | null {
        //const userStr = localStorage.getItem('user_info');
        const userStr = null;
        return userStr ? JSON.parse(userStr) : null;
    }
}