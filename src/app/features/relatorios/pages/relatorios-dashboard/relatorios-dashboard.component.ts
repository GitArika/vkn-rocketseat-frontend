import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { CardInsight, RankingCliente, AlertaItem } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-relatorios-dashboard',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1>Relatórios e insights</h1>
          <p>Visão consolidada de produtividade, receita e gargalos da oficina.</p>
        </div>
      </header>

      <div class="grid grid--cards">
        <article class="card" *ngFor="let card of cards()">
          <span class="label">{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
          <small>{{ card.helper }}</small>
        </article>
      </div>

      <div class="grid">
        <article class="card span-2">
          <header class="card__header">
            <h2>Clientes com maior ticket</h2>
            <span>Últimos 90 dias</span>
          </header>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Ordens</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of rankingClientes()">
                <td>{{ item.nome }}</td>
                <td>{{ item.ordens }}</td>
                <td>{{ item.valor | currency : 'BRL' }}</td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="card">
          <header class="card__header">
            <h2>Alertas</h2>
            <span>Próximos 7 dias</span>
          </header>
          <ul class="lista-alertas">
            <li *ngFor="let alerta of alertas()">
              <strong>{{ alerta.titulo }}</strong>
              <span>{{ alerta.data }}</span>
              <small>{{ alerta.descricao }}</small>
            </li>
          </ul>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .page__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
      }
      .grid--cards {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .card {
        background: #fff;
        border-radius: 12px;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .span-2 {
        grid-column: span 2;
      }
      .label {
        color: #94a3b8;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      strong {
        font-size: 1.7rem;
        color: #0f172a;
      }
      small {
        color: #94a3b8;
      }
      .card__header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.75rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        text-align: left;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e2e8f0;
      }
      th {
        color: #94a3b8;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .lista-alertas {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .lista-alertas li {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        border-left: 3px solid #2563eb;
        padding-left: 0.75rem;
      }
      .lista-alertas small {
        color: #64748b;
      }
    `,
  ],
})
export class RelatoriosDashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  cards = signal<CardInsight[]>([]);
  rankingClientes = signal<RankingCliente[]>([]);
  alertas = signal<AlertaItem[]>([]);

  constructor() {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.dashboardService
      .obterDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dashboard) => {
          this.cards.set(dashboard.cards);
          this.rankingClientes.set(dashboard.rankingClientes);
          this.alertas.set(dashboard.alertas);
        },
        error: () => {
          // Em caso de erro, manter dados vazios ou valores padrão
          this.cards.set([
            { label: 'Receita no mês', value: 'R$ 0,00', helper: 'Sem dados' },
            { label: 'Ordens em aberto', value: '0', helper: '' },
            { label: 'Ticket médio', value: 'R$ 0,00', helper: 'Meta: R$ 1.250' },
            { label: 'SLA cumprido', value: '0%', helper: 'Meta: 90%' },
          ]);
          this.rankingClientes.set([]);
          this.alertas.set([]);
        },
      });
  }
}
