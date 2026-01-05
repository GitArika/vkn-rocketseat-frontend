import { AsyncPipe, DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdemServicoService } from '../../../../core/services/ordem-servico.service';
import { OrdemServico, StatusOrdem } from '../../../../core/models/ordem-servico.model';

const COLUNAS: { status: StatusOrdem; titulo: string }[] = [
  { status: 'RECEBIDO', titulo: 'Recebido' },
  { status: 'DIAGNOSTICO', titulo: 'Diagnóstico' },
  { status: 'AGUARDANDO_PECAS', titulo: 'Aguardando peças' },
  { status: 'EM_REPARO', titulo: 'Em reparo' },
  { status: 'PRONTO', titulo: 'Pronto' },
  { status: 'ENTREGUE', titulo: 'Entregue' },
];

@Component({
  selector: 'app-ordens-board',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink, AsyncPipe, SlicePipe],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1>Ordens de serviço</h1>
          <p>Acompanhe o status de cada equipamento e organize o fluxo da oficina.</p>
        </div>
        <a class="btn primary" routerLink="nova">Nova OS</a>
      </header>

      <div class="board">
        <div class="column" *ngFor="let coluna of colunas">
          <header>
            <span>{{ coluna.titulo }}</span>
            <strong>{{ agrupadas()[coluna.status].length }}</strong>
          </header>
          <div class="cards">
            <article class="os-card" *ngFor="let ordem of agrupadas()[coluna.status]">
              <header>
                <h3>#{{ ordem.id | slice : -6 }} - {{ ordem.clienteNome }}</h3>
                <span>{{ ordem.equipamentoDescricao }}</span>
              </header>
              <p class="muted">{{ ordem.descricaoProblema }}</p>
              <footer>
                <span>Atualizado: {{ ordem.atualizadoEm | date : 'short' }}</span>
                <a [routerLink]="[ordem.id, 'editar']">Detalhes</a>
              </footer>
            </article>
            <p class="muted empty" *ngIf="!agrupadas()[coluna.status].length">
              Nenhuma ordem neste estágio.
            </p>
          </div>
        </div>
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
        align-items: center;
        justify-content: space-between;
      }
      .board {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .column {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .column header {
        display: flex;
        justify-content: space-between;
        color: #475467;
        font-weight: 600;
      }
      .cards {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .os-card {
        background: #fff;
        border-radius: 12px;
        padding: 0.75rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .os-card header h3 {
        margin: 0;
        font-size: 1rem;
      }
      .os-card header span {
        color: #64748b;
        font-size: 0.85rem;
      }
      .muted {
        color: #94a3b8;
        font-size: 0.9rem;
      }
      footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #94a3b8;
      }
      footer a {
        font-weight: 600;
        color: #2563eb;
      }
      .btn {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
      }
      .btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .empty {
        text-align: center;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class OrdensBoardComponent {
  private readonly ordemService = inject(OrdemServicoService);
  private readonly destroyRef = inject(DestroyRef);

  colunas = COLUNAS;
  ordens = signal<OrdemServico[]>([]);
  agrupadas = computed(() =>
    this.colunas.reduce<Record<string, OrdemServico[]>>((acc, coluna) => {
      acc[coluna.status] = this.ordens().filter((o) => o.status === coluna.status);
      return acc;
    }, {})
  );

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.ordemService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ordens) => this.ordens.set(ordens),
        error: () => this.ordens.set([]),
      });
  }
}
