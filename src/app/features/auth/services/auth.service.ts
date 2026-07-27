import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { UserLoginRequestDto } from '../models/user-login-request.model';
import { UserLoginResponse } from '../models/user-login-response.model';
import { CreateUserRequest } from '../models/create-user-request.model';
import { UserResponse } from '../models/user-response.model';
import { environment } from '../../../../environments/environment.development';
import { CookieStorageService } from '../../../shared/services/cookiestorage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
  
    private readonly baseUrl = `${environment.apiUrl}/Auth`

    private cookieStorageService = inject(CookieStorageService)

    // State Management with Signals
    currentUser = signal<UserResponse | null>(this.getStoredUser());
    token = signal<string | null>(this.getStoredToken());
    isAuthenticated = computed(() => !!this.token());

    constructor(){

        const storedToken = this.getStoredToken();
        const storedUser = this.getStoredUser();

        if (storedToken) {
            this.token.set(storedToken);
        }

        if (storedUser) {
            this.currentUser.set(storedUser);
        }

    }

    login(credentials: UserLoginRequestDto): Observable<UserLoginResponse> {
        return this.http.post<UserLoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
            tap((response) => this.setSession(response))
        );
    }

   
    register(userData: CreateUserRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.baseUrl}/register`, userData);
    }

    logout(): void {
        
        this.cookieStorageService.removeKey("user");
        this.cookieStorageService.removeKey("token");

        this.token.set(null);
        this.currentUser.set(null);
    }

    private setSession(authResult: UserLoginResponse): void {

        this.cookieStorageService.setItem("token", authResult.token);
        this.cookieStorageService.setItem("user", authResult.user);

        console.log(this.cookieStorageService.getItem('token'));

        this.token.set(authResult.token);
        this.currentUser.set(authResult.user);
    }

    private getStoredUser(): UserResponse | null {
        return this.cookieStorageService.getItem("user");
    }

    private getStoredToken(): string | null {
        console.log("ST: " + this.cookieStorageService.getItem("token"));
        return this.cookieStorageService.getItem("token");
    }
}