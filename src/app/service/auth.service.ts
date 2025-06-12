import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environment/envitonment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}`; //url do backend, definida no environment.ts localhost:8080
  private token: string | null = null; // o token do jwt
  private userRole: string | null = null; // e o cargo do usuario podendo ser USER ou A

  constructor(private http: HttpClient, private router: Router) {

    this.loadTokenAndRole();
  }

  private loadTokenAndRole(): void {
    const storedToken = localStorage.getItem('jwt_token');
    const storedRole = localStorage.getItem('user_role');
    if (storedToken && storedRole) {
      this.token = storedToken;
      this.userRole = storedRole;
      if (this.isTokenExpired(this.token)) {
        console.warn('Token JWT expirado no carregamento. Realizando logout.');
        this.logout();
      }
    }
  }
  hasRole(roles: string): boolean {
    this.userRole = this.getUserRole() || localStorage.getItem('user_role');
    const hasRole = this.userRole === roles.toUpperCase(); 
    // tem um bug que quando voce faz login com ADMIN 
    // a pagina carrega na /litagem sem poder editar e sem poder deletar portanto para resolver é so dar um F5
    return hasRole;
  }
  getUserRole(): string | null {
    return this.userRole;
  }

  getToken(): string | null {
    return this.token;
  }
login(username: string, password: string): Observable<any> { //Observable faz uma transformação de dados, nesse caso o retorno do backend
    const credentials = { username, password };

    return this.http.post(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response: any) => { //response é o retorno do backend em, que deve conter o token e o cargo do usuário
        this.token = response.token;
        this.userRole = response.roles;
        if (this.token !== null && this.userRole !== null) {
          localStorage.setItem('jwt_token', this.token); //o response tras o token e userRole e armazena no localStorage do navegador do usuário
          localStorage.setItem('user_role', this.userRole);
        }
        this.router.navigate(['/cadastro']);
      }),
      catchError(this.handleLoginError) // Captura e trata erros da requisição
    );
  }
  isAuthenticated(): boolean {
    return !!this.token && !this.isTokenExpired(this.token);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      return decodedToken.exp < Date.now() / 1000;
    } catch (Error) {
      console.error('Erro ao decodificar o token JWT:', Error);
      return true;
    }
  }

  //esse metodo lida com erros de requisição HTTP
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Erro na requisição de login:', error); // Log de ERRO na resposta
    let errorMessage = 'Ocorreu um erro desconhecido no login.';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      errorMessage = `Erro de rede: ${error.error.message}`;
    } else {
      // Erro do lado do servidor (status code e corpo da resposta)
      if (error.status === 401) {
        errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado. Você não tem permissão.';
      } else if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      } else {
        errorMessage = `Erro do servidor (${error.status}): ${error.message || JSON.stringify(error.error)}`;
      }
    }
    // Rejeita o erro para que o componente possa lidar com ele (no login.component.ts)
    return throwError(() => new Error(errorMessage));
  }
}