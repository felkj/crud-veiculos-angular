import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './service/auth.service';

/*
  Interceptor é o mais importante é ele que envia o authorization de volta para o backend
  para o backend verificar se o token é valido pelo JWT(Json web token)
  Sem ele nao podemos fazer nenhuma requisição para nenhum endpoint do backend
*/ 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}