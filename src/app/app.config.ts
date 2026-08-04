import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './features/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes), 

    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    }),

    provideBrowserGlobalErrorListeners(),

    provideAppInitializer(() => {

      const authService = inject(AuthService);

      return firstValueFrom(authService.initializeAuth())

    })

  ]
};
