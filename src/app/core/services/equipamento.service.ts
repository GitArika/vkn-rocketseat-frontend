import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipamento, EquipamentoPayload } from '../models/equipamento.model';

@Injectable({ providedIn: 'root' })
export class EquipamentoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/equipamentos`;

  listByCliente(clienteId: string): Observable<Equipamento[]> {
    const params = new HttpParams().set('clienteId', clienteId);
    return this.http.get<Equipamento[]>(this.baseUrl, { params });
  }

  create(payload: EquipamentoPayload): Observable<Equipamento> {
    return this.http.post<Equipamento>(this.baseUrl, payload);
  }

  update(id: string, payload: EquipamentoPayload): Observable<Equipamento> {
    return this.http.put<Equipamento>(`${this.baseUrl}/${id}`, payload);
  }
}

