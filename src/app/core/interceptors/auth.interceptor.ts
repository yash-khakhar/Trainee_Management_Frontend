import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieStorageService } from '../../shared/services/cookiestorage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const cookieStorage = inject(CookieStorageService);
    const token = cookieStorage.getItem('token');

    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq);
    }
    return next(req);
};
