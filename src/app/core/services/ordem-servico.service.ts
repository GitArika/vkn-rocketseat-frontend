import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrdemServico, OrdemServicoPayload, StatusOrdem } from '../models/ordem-servico.model';

@Injectable({ providedIn: 'root' })
export class OrdemServicoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ordens`;

  list(status?: StatusOrdem, clienteId?: string): Observable<OrdemServico[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (clienteId) {
      params = params.set('clienteId', clienteId);
    }
    return this.http.get<OrdemServico[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.baseUrl}/${id}`);
  }

  create(payload: OrdemServicoPayload): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.baseUrl, payload);
  }

  update(id: string, payload: OrdemServicoPayload): Observable<OrdemServico> {
    return this.http.put<OrdemServico>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

