import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { VeiculoService } from '../../service/veiculo.service';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IVeiculo } from '../../IVeiculo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editar',
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    RouterModule
    ],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent implements OnInit {
  
    veiculo: IVeiculo | undefined;
    carregando: boolean = true;
    errorMsg: null | string = null; 
    veiculoId: number | null = null; 
  
    constructor(
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    const idParam = params.get('id'); // Obtém o 'id' da URL
      if (idParam) {
        this.veiculoId = +idParam; // Converte a string do ID para número
        this.obterVeiculosPorId(this.veiculoId); // Chama o método para carregar o veículo
      } else {
        this.errorMsg = 'ID do veículo não fornecido na URL.';
        this.carregando = false;
        console.error('ID do veículo ausente na rota de edição.');
      }
    });
  }
  obterVeiculosPorId(id: number): void {
    this.carregando = true;
    this.errorMsg = null;

    this.veiculoService.obterPorId(id).subscribe({
      next: (data: IVeiculo) => {
        this.veiculo = data; // Atribui os dados do veículo à propriedade
        this.carregando = false;
        console.log('Veículo carregado com sucesso para edição:', this.veiculo);
      },
      error: (error) => {
        console.error('Erro ao obter veículo para edição:', error);
        this.errorMsg = 'Falha ao carregar veículo para edição. Verifique o ID e sua permissão.';
        this.carregando = false;
        // Redireciona para listagem se não encontrar ou tiver erro grave
        this.router.navigate(['/listagem']); 
      }
  });
}

  // Método para salvar as alterações do veículo (a ser implementado)
  salvarAlteracoes(): void {
    if (!this.veiculo || !this.veiculo.id) {
      this.errorMsg = 'Dados do veículo inválidos para atualização.';
      return;
    }

    if (!this.isAdmin()) {
      console.warn('Usuário não ADMIN tentando salvar alterações. Ação bloqueada pelo frontend.');
      this.errorMsg = 'Você não tem permissão para editar veículos.';
      return;
    }

    this.carregando = true; // Mostra carregamento ao salvar
    this.veiculoService.atualizar(this.veiculo.id, this.veiculo).subscribe({
      next: (updatedVeiculo: IVeiculo) => {
      console.log('Veículo atualizado com sucesso:', updatedVeiculo);
      this.carregando = false;
      this.router.navigate(['/listagem']); // Redireciona para a listagem
      },
      error: (error) => {
      console.error('Erro ao atualizar veículo:', error);
      this.errorMsg = 'Falha ao atualizar veículo. Verifique os dados e sua permissão.';
      this.carregando = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }
  public voltarParaListagem(): void {
  this.router.navigate(['/listagem']);
}
}