import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { VeiculoService } from '../../service/veiculo.service';
import { IVeiculo } from '../../IVeiculo';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar',
  imports: [
    HeaderComponent,
     FooterComponent,
     CommonModule,
     RouterModule
    ],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit {
excluirVeiculo(arg0: number) {
throw new Error('Method not implemented.');
}
  veiculos: IVeiculo[] = [];
  carregando: boolean = true;
  errorMsg: null | string = null;  

  showConfirmDialog: boolean = false; // Controla a visibilidade do diálogo
  veiculoToDeleteId: number | null = null; // Armazena o ID do veículo a ser excluído

  constructor(
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obterVeiculos();
  }

  obterVeiculos(): void {
    this.carregando = true;
    this.errorMsg = null;
    
    this.veiculoService.obterTodos().subscribe({
      next: (data: IVeiculo[]) => {
        this.veiculos = data;
  
        this.carregando = false;
        console.log('Veículos carregados com sucesso.');
      },
      error: (error) => {
        console.error('Erro ao obter veículos:', error);
        this.errorMsg = 'Falha ao carregar veículos. Por favor, tente novamente mais tarde.';
        this.carregando = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  editarVeiculo(id: number): void {
    if (this.isAdmin()) {
      this.router.navigate(['/edicao', id]);
    } else {
      console.warn('Usuário não ADMIN tentando editar veículo. Ação bloqueada pelo frontend.');
    }
  }

  openConfirmDeleteDialog(id: number): void { 
    console.log('openConfirmDeleteDialog foi chamado para o ID:', id); // <<-- NOVO: Log de depuração
    if (this.isAdmin()) {
      this.veiculoToDeleteId = id;
      this.showConfirmDialog = true;
      console.log('showConfirmDialog agora é:', this.showConfirmDialog, 'e veiculoToDeleteId é:', this.veiculoToDeleteId); // <<-- NOVO: Log de depuração
    } else {
      console.warn('Usuário não ADMIN tentando excluir veículo. Ação bloqueada pelo frontend.');
      this.errorMsg = 'Você não tem permissão para excluir veículos.';
    }
  }

  /**
   * Cancela a exclusão e fecha o diálogo de confirmação.
   */
  cancelDelete(): void { 
    this.showConfirmDialog = false;
    this.veiculoToDeleteId = null;
    this.errorMsg = null; 
  }

  /**
   * Confirma a exclusão e chama o serviço para deletar o veículo.
   */
  confirmDelete(): void { 
    if (this.veiculoToDeleteId !== null) {
      this.carregando = true; 
      this.errorMsg = null; 

      this.veiculoService.excluir(this.veiculoToDeleteId).subscribe({
        next: () => {
          console.log(`Veículo com ID ${this.veiculoToDeleteId} excluído com sucesso.`);
          this.obterVeiculos(); 
          this.cancelDelete(); 
          this.carregando = false; 
        },
        error: (error) => {
          console.error('Erro ao excluir veículo:', error);
          this.errorMsg = 'Falha ao excluir o veículo. Por favor, tente novamente.';
          this.carregando = false; 
          this.cancelDelete(); 
        }
      });
    }
  }

  
}
