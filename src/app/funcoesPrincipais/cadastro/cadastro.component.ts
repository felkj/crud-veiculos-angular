import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IVeiculo } from '../../IVeiculo';
import { VeiculoService } from '../../service/veiculo.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-cadastro',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule
    ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  newVeiculo: IVeiculo = {
    marca: '',
    modelo: '',
    url_image: '',
    ano: null as any, // Inicializa como null ou 0, para evitar erro de tipo para number
    preco: null as any, // Inicializa como null ou 0
    vendido: false,
    id: 0,
  };
  carregando: boolean = false; // <<-- CORREÇÃO: Inicializa como FALSE. O formulário deve aparecer por padrão.
  errorMsg: string | null = null; // <<-- CORREÇÃO: Nome da variável para consistência com HTML
  sucessoMsg: string | null = null; // <<-- CORREÇÃO: Nome da variável para consistência com HTML

  constructor(
    private veiculoService: VeiculoService,
    private authService: AuthService, // Para verificar se é ADMIN
    private router: Router
  ) {}

  ngOnInit(): void {
    // verifica se usuário é ADMIN
    // Se não for, redireciona para a listagem
    if (!this.isAdmin()) {
      this.errorMsg = 'Você não tem permissão para cadastrar veículos. Apenas administradores.';
      console.warn('Usuário não ADMIN tentou acessar a página de cadastro.');
      // Redireciona para a listagem. A mensagem de erro será exibida no local da permissão negada.
      this.router.navigate(['/listagem']); 
    }
  }

  /**
   * Método para cadastrar um novo veículo.
   * Chamado quando o formulário é submetido.
   */
  cadastrarVeiculo(form: NgForm): void {
    if (form.invalid) { // <<-- NOVO: Verifica se o formulário é inválido
      this.errorMsg = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return; // Interrompe a função se o formulário for inválido
    }
    this.carregando = true; // Ativa o indicador de carregamento
    this.errorMsg = null; // Limpa mensagens anteriores
    this.sucessoMsg = null;

    // Cria um objeto para enviar que omite o 'id' e 'data_cadastro'
    // pois eles são gerados pelo backend na criação.
    const veiculoParaCriar: Omit<IVeiculo, 'id'> = {
      marca: this.newVeiculo.marca,
      modelo: this.newVeiculo.modelo,
      url_image: this.newVeiculo.url_image,
      ano: this.newVeiculo.ano,
      preco: this.newVeiculo.preco,
      vendido: this.newVeiculo.vendido
    };


    // Chama o serviço para criar o veículo
    this.veiculoService.criar(veiculoParaCriar).subscribe({
      next: (veiculoCriado: IVeiculo) => {
        console.log('Veículo cadastrado com sucesso:', veiculoCriado);
        this.sucessoMsg = 'Veículo cadastrado com sucesso!';
        this.carregando = false;
        // Limpa o formulário após o sucesso
        this.resetForm(form);
        // Redireciona para a página de listagem após o cadastro bem-sucedido
        // Isso pode ser uma opção de UX, se o usuário quiser continuar na página de cadastro
        // this.router.navigate(['/listagem']); 
      },
      error: (error) => {
        console.error('Erro ao cadastrar veículo:', error);
        this.errorMsg = 'Falha ao cadastrar veículo. Por favor, tente novamente mais tarde.';
        this.carregando = false;
      }
    });
  }

  /**
   * Reseta o formulário limpando os dados do newVeiculo.
   */
  resetForm(form: NgForm): void {
    form.resetForm(); // <<-- CORREÇÃO: Nome da função para consistência
    this.newVeiculo = {
      id: 0,
      marca: '',
      modelo: '',
      url_image: '',
      ano: null as any,
      preco: null as any,
      vendido: false,
      // id: 0, // Removido
    };
    this.errorMsg = null; // Limpa mensagens de erro
    this.sucessoMsg = null; // Limpa mensagens de sucesso
  }

  /**
   * Verifica se o usuário logado tem a role 'ADMIN'.
   * Usado para controlar a visibilidade do formulário/botão de cadastro.
   */
  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  /**
   * Redireciona para a página de login.
   * Usado para o botão na mensagem de permissão negada.
   */
  goToLogin(): void { // <<-- CORREÇÃO: Nome da função para consistência
    this.router.navigate(['/login']);
  }
}
