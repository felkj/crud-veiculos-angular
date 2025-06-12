import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IVeiculo } from '../IVeiculo';
import { environment } from '../environment/envitonment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/veiculos`;

  obterTodos(): Observable<IVeiculo[]> { // Essa IVeiculos é uma interface que define a estrutura dos dados do veículo é igual os Model do java ou backend em geral
    return this.http.get<IVeiculo[]>(this.baseUrl);
  }
  obterPorId(id: number): Observable<IVeiculo> {
    return this.http.get<IVeiculo>(`${this.baseUrl}/${id}`);
  }
  criar(veiculo: Omit<IVeiculo, 'id'>): Observable<IVeiculo> { //Omit é usado para excluir a propriedade 'id' do objeto IVeiculo, pois o id é gerado pelo backend 
    return this.http.post<IVeiculo>(this.baseUrl, veiculo);         //se ficar confuso é so ir pelo nome ele "Omite dados"
  }
  atualizar(id: number, veiculo: IVeiculo): Observable<IVeiculo> {
    return this.http.put<IVeiculo>(`${this.baseUrl}/${id}`, veiculo);
  }
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
