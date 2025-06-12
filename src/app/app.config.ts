import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    provideHttpClient(withInterceptorsFromDi()), 
    { provide: AuthInterceptor, useClass: AuthInterceptor, multi: true }  // Registra seu interceptor
  ]
};
