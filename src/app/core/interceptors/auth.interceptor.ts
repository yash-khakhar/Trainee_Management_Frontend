import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const baseUrl = environment.apiUrl;

    if(!req.url.startsWith(baseUrl)){
        return next(req);
    }

    const request = req.clone({
        withCredentials: true
    })

    return next(request);
    
};
