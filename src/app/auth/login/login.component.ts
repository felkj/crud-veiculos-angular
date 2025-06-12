import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true, // Garante que este é um componente autônomo
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  //Faz autenticação via AuthService
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/listagem']),
      error: () => (this.errorMessage = 'Usuário ou senha inválidos'),
    });
  }
}
