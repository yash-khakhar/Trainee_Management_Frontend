import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

import { UserLoginRequestDto } from '../models/user-login-request.model';
import { User } from '../models/user.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private readonly baseUrl = `${environment.apiUrl}/Auth`
    
    private http = inject(HttpClient);
  
    private userSubject = new BehaviorSubject<User | null>(null);
    readonly user$ = this.userSubject.asObservable();

    private initializedSubject = new BehaviorSubject<boolean>(false);
    readonly initialized$ = this.initializedSubject.asObservable();

    constructor(){
        console.log("Auth Service created: ", this);
        console.trace();
    }

    get currentUser() : User | null {
        return this.userSubject.value;
    }

    get isLoggedIn(): boolean{
        return this.userSubject.value !== null;
    }

    login(credentials: UserLoginRequestDto): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/login`, credentials)
            .pipe(
                tap((response) => this.userSubject.next(response)
            )
        );
    }

    initializeAuth() : Observable<void>{

        return this.http.get<User>(`${this.baseUrl}/me`
        ).pipe(
            tap(user => {
                console.log("initizalie auth:" + user)
                this.userSubject.next(user)
            }),
            catchError(() => {
                this.userSubject.next(null);
                return of(null);
            }),
            tap(() => {
                this.initializedSubject.next(true)
            }),
            map(() => void 0)
        )
    }

    logout(): Observable<void> {
        
        return this.http.post<void>(`${this.baseUrl}/logout`, {}).pipe(
            tap(() => {
                this.userSubject.next(null);
            })
        )
        
    }

}