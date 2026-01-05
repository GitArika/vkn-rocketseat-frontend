import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CardInsight {
  label: string;
  value: string;
  helper: string;
}

export interface RankingCliente {
  nome: string;
  valor: number;
  ordens: number;
}

export interface AlertaItem {
  titulo: string;
  data: string;
  descricao: string;
}

export interface DashboardResponse {
  cards: CardInsight[];
  rankingClientes: RankingCliente[];
  alertas: AlertaItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  obterDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.baseUrl);
  }
}











