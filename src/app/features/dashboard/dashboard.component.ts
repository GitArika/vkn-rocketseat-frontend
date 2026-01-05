import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardOwnerService } from '../../core/services/dashboard-owner.service';
import { DashboardKPIs, StatusCount, TopCliente } from '../../core/models/dashboard.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="dashboard-page">
      <header class="dashboard-header">
        <div>
          <h1>Dashboard - Visão Geral</h1>
          <p class="subtitle">Métricas e insights do negócio</p>
        </div>
      </header>

      @if (carregando()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      } @else {
        <!-- KPIs Cards -->
        <div class="kpi-grid">
          <div class="kpi-card clients">
            <div class="kpi-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Total de Clientes</span>
              <span class="kpi-value">{{ kpis()?.totalClientes || 0 }}</span>
            </div>
          </div>

          <div class="kpi-card orders">
            <div class="kpi-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Ordens em Andamento</span>
              <span class="kpi-value">{{ kpis()?.ordensEmAndamento || 0 }}</span>
            </div>
          </div>

          <div class="kpi-card revenue">
            <div class="kpi-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 1V23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Receita (Mês)</span>
              <span class="kpi-value">R$ {{ formatarValor(kpis()?.receitaTotalMes || 0) }}</span>
            </div>
          </div>

          <div class="kpi-card completed">
            <div class="kpi-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Concluídas (Mês)</span>
              <span class="kpi-value">{{ kpis()?.ordensConcluidasMes || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- Ordens por Status -->
          <div class="chart-card">
            <h2>Ordens por Status</h2>
            <div class="status-list">
              @for (status of ordensPorStatus(); track status.status) {
                <div class="status-item">
                  <div class="status-info">
                    <span class="status-label">{{ getStatusLabel(status.status) }}</span>
                    <span class="status-count">{{ status.count }}</span>
                  </div>
                  <div class="status-bar">
                    <div class="status-fill" [style.width.%]="getStatusPercentage(status.count)"></div>
                  </div>
                </div>
              }
              @if (ordensPorStatus().length === 0) {
                <p class="empty-state">Nenhuma ordem cadastrada</p>
              }
            </div>
          </div>

          <!-- Top Clientes -->
          <div class="chart-card">
            <h2>Top 5 Clientes</h2>
            <div class="clients-table">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Ordens</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cliente of topClientes(); track cliente.id) {
                    <tr>
                      <td class="client-name">{{ cliente.nome }}</td>
                      <td class="client-orders">{{ cliente.totalOrdens }}</td>
                      <td class="client-value">R$ {{ formatarValor(cliente.valorTotal) }}</td>
                    </tr>
                  }
                  @if (topClientes().length === 0) {
                    <tr>
                      <td colspan="3" class="empty-state">Nenhum cliente com ordens concluídas</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      @if (erro()) {
        <div class="error-message">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ erro() }}
        </div>
      }
    </section>
  `,
    styles: [`
    .dashboard-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1rem;
    }

    /* Loading */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      gap: 1rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .kpi-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .kpi-card.clients .kpi-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff;
    }

    .kpi-card.orders .kpi-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #ffffff;
    }

    .kpi-card.revenue .kpi-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
    }

    .kpi-card.completed .kpi-icon {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: #ffffff;
    }

    .kpi-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .kpi-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .chart-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .chart-card h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1.5rem;
    }

    /* Status List */
    .status-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .status-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .status-count {
      font-size: 0.875rem;
      font-weight: 700;
      color: #2563eb;
    }

    .status-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .status-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    /* Clients Table */
    .clients-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f9fafb;
    }

    th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .client-name {
      font-weight: 600;
      color: #111827;
    }

    .client-orders {
      color: #6b7280;
    }

    .client-value {
      font-weight: 600;
      color: #10b981;
    }

    .empty-state {
      text-align: center;
      color: #9ca3af;
      padding: 2rem;
      font-size: 0.875rem;
    }

    /* Error Message */
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      color: #991b1b;
      margin-top: 1rem;
    }

    .error-message svg {
      flex-shrink: 0;
      color: #dc2626;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-page {
        padding: 1rem;
      }

      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .kpi-value {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
    private dashboardService = inject(DashboardOwnerService);

    kpis = signal<DashboardKPIs | null>(null);
    ordensPorStatus = signal<StatusCount[]>([]);
    topClientes = signal<TopCliente[]>([]);
    carregando = signal(true);
    erro = signal<string | null>(null);

    ngOnInit() {
        this.carregarDados();
    }

    carregarDados() {
        this.carregando.set(true);
        this.erro.set(null);

        // Carregar KPIs
        this.dashboardService.getKPIs().subscribe({
            next: (data) => this.kpis.set(data),
            error: (err) => this.erro.set('Erro ao carregar KPIs')
        });

        // Carregar ordens por status
        this.dashboardService.getOrdensPorStatus().subscribe({
            next: (data) => this.ordensPorStatus.set(data),
            error: (err) => this.erro.set('Erro ao carregar ordens por status')
        });

        // Carregar top clientes
        this.dashboardService.getTopClientes(5).subscribe({
            next: (data) => {
                this.topClientes.set(data);
                this.carregando.set(false);
            },
            error: (err) => {
                this.erro.set('Erro ao carregar top clientes');
                this.carregando.set(false);
            }
        });
    }

    formatarValor(valor: number): string {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'RECEBIDO': 'Recebido',
            'DIAGNOSTICO': 'Diagnóstico',
            'AGUARDANDO_PECAS': 'Aguardando Peças',
            'EM_REPARO': 'Em Reparo',
            'PRONTO': 'Pronto',
            'ENTREGUE': 'Entregue'
        };
        return labels[status] || status;
    }

    getStatusPercentage(count: number): number {
        const total = this.ordensPorStatus().reduce((sum, s) => sum + s.count, 0);
        return total > 0 ? (count / total) * 100 : 0;
    }
}
