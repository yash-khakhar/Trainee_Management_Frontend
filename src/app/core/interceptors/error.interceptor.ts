import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/NotificationService.service';

export interface ApiErrorResponse {
    ErrorType: string;
    StatusCode: number;
    Message: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router);
    const notificationService = inject(NotificationService)

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            let errorPayload: ApiErrorResponse;

            if (error.error && typeof error.error === 'object' && 'Message' in error.error) {
                errorPayload = error.error as ApiErrorResponse;
            } else {
                
                errorPayload = {
                    ErrorType: error.status === 0 ? 'Network Error' : 'Unexpected Error',
                    StatusCode: error.error.status || 500,
                    Message: error.status === 0
                        ? 'Unable to connect to the server. Please check your internet connection.'
                        : error.error.title || 'An unexpected error occurred.'
                };

            }

            switch (errorPayload.StatusCode) {
                case 401:
                    errorPayload.ErrorType = 'Login Failed'
                    console.warn('[Global Error] Unauthorized:', errorPayload.Message);
                    break;

                case 403:
                    errorPayload.ErrorType = 'Forbidden Access'
                    console.warn('[Global Error] Forbidden:', errorPayload.Message);
                    router.navigate(['/forbidden']);
                    break;

                case 404:
                    errorPayload.ErrorType = 'Not Fouund'
                    console.warn('[Global Error] Not Found:', errorPayload.Message);
                    break;

                case 400:
                    errorPayload.ErrorType = 'Bad Request'
                    console.warn(`[Global Error] ${errorPayload.ErrorType}:`, errorPayload.Message);
                    break;

                case 500:
                default:
                    errorPayload.ErrorType = 'Server Error'
                    console.error(`[Global Error] Server Failure (${errorPayload.StatusCode}):`, errorPayload.Message);
                    break;
            }

            notificationService.error(errorPayload.Message, errorPayload.ErrorType);

            return throwError(() => errorPayload);

        })
    );
};