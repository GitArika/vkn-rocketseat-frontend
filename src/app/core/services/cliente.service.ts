import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClientePayload } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  list(nome?: string): Observable<Cliente[]> {
    let params = new HttpParams();
    if (nome) {
      params = params.set('nome', nome);
    }
    return this.http
      .get<Cliente[]>(this.baseUrl, { params })
      .pipe(catchError(() => of([])));
  }

  getById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  create(payload: ClientePayload): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, payload);
  }

  update(id: string, payload: ClientePayload): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, payload);
  }
}

