import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './funcoesPrincipais/cadastro/cadastro.component';
import { EditarComponent } from './funcoesPrincipais/editar/editar.component';
import { ListarComponent } from './funcoesPrincipais/listar/listar.component';
import { authGuard } from './core/guards/auth.guard';
import { AppComponent } from './app.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/listagem', pathMatch: 'full' },
  {
    path: '',
    component: AppComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'cadastro',
        component: CadastroComponent,
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'listagem',
        component: ListarComponent,
        data: { roles: ['ADMIN', 'USER'] },
      },
      {
        path: 'edicao/:id',
        component: EditarComponent,
        data: { roles: ['ADMIN'] }
      }
    ],
  },
  
];
