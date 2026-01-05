import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardKPIs, StatusCount, ReceitaMensal, TopCliente } from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardOwnerService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/dashboard/owner`;

    getKPIs(): Observable<DashboardKPIs> {
        return this.http.get<DashboardKPIs>(`${this.apiUrl}/kpis`);
    }

    getOrdensPorStatus(): Observable<StatusCount[]> {
        return this.http.get<StatusCount[]>(`${this.apiUrl}/ordens-por-status`);
    }

    getReceitaMensal(ano: number): Observable<ReceitaMensal[]> {
        return this.http.get<ReceitaMensal[]>(`${this.apiUrl}/receita-mensal`, {
            params: { ano: ano.toString() }
        });
    }

    getTopClientes(limit: number = 5): Observable<TopCliente[]> {
        return this.http.get<TopCliente[]>(`${this.apiUrl}/top-clientes`, {
            params: { limit: limit.toString() }
        });
    }
}
