import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterLink, FormsModule, DatePipe],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1>Clientes</h1>
          <p>Gerencie os clientes e visualize equipamentos vinculados.</p>
        </div>
      </header>

      <section class="filters">
        <label class="filters__field">
          <span>Buscar por nome</span>
          <input type="text" [(ngModel)]="filtroNome" (keyup.enter)="buscar()" placeholder="Digite o nome do cliente" />
        </label>
        <button class="btn outline" type="button" (click)="buscar()">Filtrar</button>
      </section>

      <div class="card">
        <table *ngIf="clientes().length; else vazio">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Status</th>
              <th>Atualizado em</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cliente of clientes()">
              <td>
                <strong>{{ cliente.nome }}</strong>
                <span class="muted" *ngIf="cliente.documento">{{ cliente.documento }}</span>
              </td>
              <td>
                <div>{{ cliente.telefone || '-' }}</div>
                <div class="muted">{{ cliente.email || 'sem e-mail' }}</div>
              </td>
              <td>
                <span class="status" [class.status--inactive]="!cliente.ativo">{{
                  cliente.ativo ? 'Ativo' : 'Inativo'
                }}</span>
              </td>
              <td>{{ cliente.atualizadoEm | date : 'short' }}</td>
              <td class="align-right">
                <a class="btn ghost" [routerLink]="[cliente.id, 'editar']">Editar</a>
              </td>
            </tr>
          </tbody>
        </table>

        <ng-template #vazio>
          <div class="empty-state">
            <p *ngIf="carregando(); else vazioTexto">Carregando clientes...</p>
            <ng-template #vazioTexto>
              <p>Nenhum cliente encontrado com os filtros atuais.</p>
            </ng-template>
          </div>
        </ng-template>
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
        gap: 1rem;
      }
      .filters {
        display: flex;
        gap: 1rem;
        align-items: flex-end;
      }
      .filters__field {
        display: flex;
        flex-direction: column;
        flex: 1;
        font-size: 0.9rem;
        color: #555;
      }
      .filters__field input {
        margin-top: 0.25rem;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        border: 1px solid #d0d5dd;
      }
      .card {
        background: #fff;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        text-align: left;
        padding: 0.75rem 0.5rem;
      }
      thead {
        color: #667085;
        font-size: 0.85rem;
      }
      tbody tr:not(:last-child) td {
        border-bottom: 1px solid #f0f0f0;
      }
      .muted {
        color: #98a2b3;
        font-size: 0.85rem;
        display: block;
      }
      .status {
        padding: 0.15rem 0.65rem;
        border-radius: 999px;
        background: #ecfdf3;
        color: #027a48;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .status--inactive {
        background: #fef3f2;
        color: #b42318;
      }
      .align-right {
        text-align: right;
      }
      .empty-state {
        padding: 2rem 0;
        text-align: center;
        color: #adb5bd;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        padding: 0.45rem 1rem;
        font-weight: 600;
        border: 1px solid transparent;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
      }
      .btn.primary {
        background: #2563eb;
        color: #fff;
      }
      .btn.outline {
        border-color: #d0d5dd;
      }
      .btn.ghost {
        border-color: #eaecf0;
        color: #344054;
      }
    `,
  ],
})
export class ClientesListComponent {
  private readonly clienteService = inject(ClienteService);
  private readonly destroyRef = inject(DestroyRef);

  filtroNome = '';
  clientes = signal<Cliente[]>([]);
  carregando = signal(false);
  totalClientes = computed(() => this.clientes().length);

  constructor() {
    this.buscar();
  }

  buscar(): void {
    this.carregando.set(true);
    this.clienteService
      .list(this.filtroNome.trim() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (lista) => this.clientes.set(lista),
        error: () => this.clientes.set([]),
        complete: () => this.carregando.set(false),
      });
  }
}
