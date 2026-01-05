import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Cliente } from '../../../../core/models/cliente.model';
import { Equipamento } from '../../../../core/models/equipamento.model';
import { OrdemServicoPayload, StatusOrdem } from '../../../../core/models/ordem-servico.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { EquipamentoService } from '../../../../core/services/equipamento.service';
import { OrdemServicoService } from '../../../../core/services/ordem-servico.service';

const STATUS_OPTIONS: { value: StatusOrdem; label: string }[] = [
  { value: 'RECEBIDO', label: 'Recebido' },
  { value: 'DIAGNOSTICO', label: 'Diagnóstico' },
  { value: 'AGUARDANDO_PECAS', label: 'Aguardando peças' },
  { value: 'EM_REPARO', label: 'Em reparo' },
  { value: 'PRONTO', label: 'Pronto' },
  { value: 'ENTREGUE', label: 'Entregue' },
];

@Component({
  selector: 'app-ordem-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div class="header-content">
          <h1>{{ ordemId ? 'Editar' : 'Nova' }} Ordem de Serviço</h1>
          <p class="subtitle">{{ ordemId ? 'Atualize as informações da ordem' : 'Cadastre uma nova ordem de atendimento' }}</p>
        </div>
      </header>

      <form [formGroup]="form" (ngSubmit)="salvar()" class="form-container">
        
        <!-- Seção: Informações Básicas -->
        <div class="card">
          <div class="card-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <h2>Informações Básicas</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Cliente *</label>
              <select formControlName="clienteId">
                <option value="">Selecione um cliente</option>
                @for (cliente of clientes(); track cliente.id) {
                  <option [value]="cliente.id">{{ cliente.nome }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Equipamento *</label>
              <select formControlName="equipamentoId">
                <option value="">Selecione um equipamento</option>
                @for (equip of equipamentos(); track equip.id) {
                  <option [value]="equip.id">{{ equip.descricao }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Status *</label>
              <select formControlName="status">
                <option value="RECEBIDO">Recebido</option>
                <option value="DIAGNOSTICO">Diagnóstico</option>
                <option value="AGUARDANDO_PECAS">Aguardando peças</option>
                <option value="EM_REPARO">Em reparo</option>
                <option value="PRONTO">Pronto</option>
                <option value="ENTREGUE">Entregue</option>
              </select>
            </div>

            <div class="form-group">
              <label>Responsável</label>
              <input type="text" formControlName="responsavelId" placeholder="Nome do responsável" />
            </div>
          </div>
        </div>

        <!-- Seção: Descrições -->
        <div class="card">
          <div class="card-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 6H16M4 10H16M4 14H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <h2>Descrições do Serviço</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Descrição do problema *</label>
              <textarea formControlName="descricaoProblema" rows="3" placeholder="Descreva o problema relatado pelo cliente"></textarea>
            </div>

            <div class="form-group full-width">
              <label>Serviços realizados</label>
              <textarea formControlName="descricaoServico" rows="3" placeholder="Descreva os serviços que foram ou serão realizados"></textarea>
            </div>
          </div>
        </div>

        <!-- Seção: Valores e Datas -->
        <div class="card">
          <div class="card-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10 7V10L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <h2>Valores e Prazos</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Valor mão de obra</label>
              <input type="number" formControlName="valorMaoObra" placeholder="0.00" step="0.01" />
            </div>

            <div class="form-group">
              <label>Valor peças</label>
              <input type="number" formControlName="valorPecas" placeholder="0.00" step="0.01" />
            </div>

            <div class="form-group">
              <label>Previsão de entrega</label>
              <input type="date" formControlName="previsaoEntrega" />
            </div>

            <div class="form-group">
              <label>Data de conclusão</label>
              <input type="date" formControlName="dataConclusao" />
            </div>
          </div>
        </div>

        <!-- Seção: Observações -->
        <div class="card">
          <div class="card-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17H15C16.1046 17 17 16.1046 17 15V5C17 3.89543 16.1046 3 15 3H5C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H7" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <h2>Observações Internas</h2>
          </div>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Observações</label>
              <textarea formControlName="observacoes" rows="3" placeholder="Informações adicionais sobre a ordem"></textarea>
            </div>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ errorMessage() }}
          </div>
        }

        @if (form.get('status')?.value === 'PRONTO') {
          <div class="action-buttons-secondary">
            <button type="button" class="btn btn-print" (click)="imprimirPDF()">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7V3C5 2.44772 5.44772 2 6 2H14C14.5523 2 15 2.44772 15 3V7M5 7H4C2.89543 7 2 7.89543 2 9V13C2 14.1046 2.89543 15 4 15H5M5 7H15M15 7H16C17.1046 7 18 7.89543 18 9V13C18 14.1046 17.1046 15 16 15H15M15 15V17C15 17.5523 14.5523 18 14 18H6C5.44772 18 5 17.5523 5 17V15M15 15H5" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Imprimir NFe
            </button>
            
            <button type="button" class="btn btn-download" (click)="baixarOrdem()">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3V13M10 13L14 9M10 13L6 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M3 15V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Baixar PDF
            </button>
          </div>
        }

        <div class="action-buttons">
          <button type="button" class="btn btn-secondary" (click)="voltar()">
            Cancelar
          </button>
          
          @if (ordemId) {
            <button type="button" class="btn btn-danger" (click)="deletar()">
              Excluir
            </button>
          }
          
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || carregando()">
            {{ carregando() ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [
    `
      .page {
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .header-content h1 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: #6b7280;
        font-size: 1rem;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Card Styles */
      .card {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 1.5rem;
        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        border-bottom: 1px solid #e5e7eb;
      }

      .card-header svg {
        color: #2563eb;
        flex-shrink: 0;
      }

      .card-header h2 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      /* Form Grid */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.25rem;
        padding: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-group label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: 0.625rem 0.875rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 0.9375rem;
        transition: all 0.2s ease;
        background: #ffffff;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .form-group textarea {
        resize: vertical;
        font-family: inherit;
      }

      .form-group input::placeholder,
      .form-group textarea::placeholder {
        color: #9ca3af;
      }

      /* Alert Styles */
      .alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-radius: 10px;
        font-size: 0.9375rem;
      }

      .alert svg {
        flex-shrink: 0;
      }

      .alert-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
      }

      .alert-error svg {
        color: #dc2626;
      }

      /* Action Buttons */
      .action-buttons-secondary {
        display: flex;
        justify-content: center;
        gap: 1rem;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 12px;
        border: 1px dashed #d1d5db;
      }

      .action-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding-top: 1rem;
      }

      /* Button Styles */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9375rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-primary {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
      }

      .btn-secondary {
        background: #ffffff;
        color: #374151;
        border: 1px solid #d1d5db;
      }

      .btn-secondary:hover {
        background: #f9fafb;
      }

      .btn-danger {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
      }

      .btn-danger:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
      }

      .btn-print {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
      }

      .btn-print:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
      }

      .btn-download {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
      }

      .btn-download:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .page-header h1 {
          font-size: 1.5rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 1rem;
        }

        .card-header {
          padding: 1rem;
        }

        .action-buttons {
          flex-direction: column;
        }

        .action-buttons-secondary {
          flex-direction: column;
          padding: 1rem;
        }

        .btn {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .page {
          padding: 0;
        }

        .card {
          border-radius: 8px;
        }

        .form-grid {
          padding: 0.75rem;
        }
      }
    `,
  ],
})
export class OrdemFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly clienteService = inject(ClienteService);
  private readonly equipamentoService = inject(EquipamentoService);
  private readonly ordemService = inject(OrdemServicoService);

  clientes = signal<Cliente[]>([]);
  equipamentos = signal<Equipamento[]>([]);
  statusOptions = STATUS_OPTIONS;
  carregando = signal(false);
  titulo = 'Nova ordem de serviço';
  errorMessage = signal<string | null>(null);
  ordemId: string | null = null;

  form = this.fb.group({
    clienteId: ['', Validators.required],
    equipamentoId: ['', Validators.required],
    responsavelId: [''],
    status: ['RECEBIDO' as StatusOrdem, Validators.required],
    descricaoProblema: ['', Validators.required],
    descricaoServico: [''],
    valorMaoObra: [0],
    valorPecas: [0],
    previsaoEntrega: [''],
    dataConclusao: [''],
    observacoes: [''],
  });

  constructor() {
    this.carregarClientes();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.ordemId = id;
        this.titulo = 'Editar ordem de serviço';
        this.carregarOrdem(id);
      }
    });
    this.form
      .get('clienteId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((clienteId) => {
        if (clienteId) {
          this.onClienteChange(clienteId);
        }
      });
  }

  private carregarClientes(): void {
    this.clienteService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((clientes) => this.clientes.set(clientes));
  }

  onClienteChange(clienteId: string | null): void {
    if (!clienteId) {
      this.equipamentos.set([]);
      return;
    }
    this.equipamentoService
      .listByCliente(clienteId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((equipamentos) => this.equipamentos.set(equipamentos));
  }

  private carregarOrdem(id: string): void {
    this.carregando.set(true);
    this.ordemService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ordem) => {
          this.form.patchValue({
            clienteId: ordem.clienteId,
            equipamentoId: ordem.equipamentoId,
            responsavelId: ordem.responsavelId,
            status: ordem.status,
            descricaoProblema: ordem.descricaoProblema,
            descricaoServico: ordem.descricaoServico,
            valorMaoObra: ordem.valorMaoObra,
            valorPecas: ordem.valorPecas,
            previsaoEntrega: ordem.previsaoEntrega,
            dataConclusao: ordem.dataConclusao,
            observacoes: ordem.observacoes,
          });
          this.onClienteChange(ordem.clienteId);
        },
        complete: () => this.carregando.set(false),
      });
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.carregando.set(true);
    this.errorMessage.set(null);
    const formValue = this.form.getRawValue();

    // Valida se responsavelId é um UUID válido
    const responsavelId = formValue.responsavelId?.trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = responsavelId && uuidRegex.test(responsavelId);

    const payload: OrdemServicoPayload = {
      clienteId: formValue.clienteId!,
      equipamentoId: formValue.equipamentoId!,
      responsavelId: isValidUuid ? responsavelId : null,
      status: formValue.status!,
      descricaoProblema: formValue.descricaoProblema!,
      descricaoServico: formValue.descricaoServico || null,
      valorMaoObra: formValue.valorMaoObra || null,
      valorPecas: formValue.valorPecas || null,
      previsaoEntrega: formValue.previsaoEntrega || null,
      dataConclusao: formValue.dataConclusao || null,
      observacoes: formValue.observacoes || null,
    };
    const operacao = this.ordemId
      ? this.ordemService.update(this.ordemId, payload)
      : this.ordemService.create(payload);

    operacao.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['/ordens']),
      error: (error) => {
        this.carregando.set(false);
        console.error('Erro ao salvar ordem:', error);
        this.errorMessage.set('Erro ao salvar a ordem de serviço. Verifique os dados e tente novamente.');
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/ordens']);
  }

  baixarOrdem(): void {
    // Usar a mesma função de imprimir PDF
    this.imprimirPDF();
  }

  imprimirPDF(): void {
    if (!this.ordemId) {
      alert('Salve a ordem antes de imprimir.');
      return;
    }

    this.carregando.set(true);

    // Buscar dados completos da ordem
    this.ordemService.getById(this.ordemId).subscribe({
      next: (ordem) => {
        this.gerarPDF(ordem);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        alert('Erro ao gerar PDF. Tente novamente.');
      }
    });
  }

  private gerarPDF(ordem: any): void {
    // Gerar número de NFe simulado
    const numeroNFe = this.gerarNumeroNFe();
    const chaveAcesso = this.gerarChaveAcesso();
    const dataEmissao = new Date();

    // Criar conteúdo HTML para NFe simulada
    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nota Fiscal de Serviço Eletrônica - ${numeroNFe}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px;
            font-size: 11px;
          }
          .container { 
            border: 2px solid #000; 
            padding: 10px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #000; 
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .header h1 { 
            font-size: 16px; 
            margin: 5px 0;
          }
          .header h2 { 
            font-size: 12px; 
            margin: 3px 0;
            font-weight: normal;
          }
          .section { 
            border: 1px solid #000; 
            margin: 10px 0; 
            padding: 8px;
          }
          .section-title { 
            font-weight: bold; 
            background: #f0f0f0; 
            padding: 4px;
            margin: -8px -8px 8px -8px;
            border-bottom: 1px solid #000;
          }
          .row { 
            display: flex; 
            margin: 4px 0;
          }
          .col { 
            flex: 1; 
            padding: 2px;
          }
          .col-2 { flex: 2; }
          .col-3 { flex: 3; }
          .label { 
            font-weight: bold; 
            font-size: 9px;
            color: #666;
          }
          .value { 
            font-size: 11px;
            margin-top: 2px;
          }
          .chave { 
            font-size: 10px; 
            word-break: break-all;
            font-family: monospace;
          }
          .total { 
            font-size: 14px; 
            font-weight: bold;
            text-align: right;
          }
          .footer { 
            margin-top: 15px; 
            text-align: center; 
            font-size: 9px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          .barcode {
            text-align: center;
            margin: 10px 0;
            font-family: 'Libre Barcode 128', monospace;
            font-size: 40px;
            letter-spacing: 2px;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(255, 0, 0, 0.1);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="watermark">SEM VALOR FISCAL</div>
        <div class="container">
          <div class="header">
            <h1>NOTA FISCAL DE SERVIÇO ELETRÔNICA - NFSe</h1>
            <h2>DOCUMENTO AUXILIAR (Sem Valor Fiscal)</h2>
            <h2>Nº ${numeroNFe} - SÉRIE 001</h2>
          </div>

          <div class="section">
            <div class="section-title">EMITENTE</div>
            <div class="row">
              <div class="col-3">
                <div class="label">RAZÃO SOCIAL / NOME</div>
                <div class="value">OFICINA PRO - SERVIÇOS TÉCNICOS</div>
              </div>
              <div class="col">
                <div class="label">CNPJ</div>
                <div class="value">00.000.000/0001-00</div>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <div class="label">ENDEREÇO</div>
                <div class="value">Rua Exemplo, 123 - Centro</div>
              </div>
              <div class="col">
                <div class="label">MUNICÍPIO</div>
                <div class="value">Porto Alegre - RS</div>
              </div>
              <div class="col">
                <div class="label">CEP</div>
                <div class="value">90000-000</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DESTINATÁRIO / TOMADOR</div>
            <div class="row">
              <div class="col-2">
                <div class="label">NOME / RAZÃO SOCIAL</div>
                <div class="value">${ordem.clienteNome || 'Cliente não informado'}</div>
              </div>
              <div class="col">
                <div class="label">CPF/CNPJ</div>
                <div class="value">${this.formatarDocumento(ordem.clienteDocumento) || 'Não informado'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DADOS DO SERVIÇO</div>
            <div class="row">
              <div class="label">DESCRIÇÃO DO EQUIPAMENTO</div>
            </div>
            <div class="row">
              <div class="value">${ordem.equipamentoDescricao || 'Equipamento não especificado'}</div>
            </div>
            <div class="row" style="margin-top: 8px;">
              <div class="label">DESCRIÇÃO DO PROBLEMA</div>
            </div>
            <div class="row">
              <div class="value">${ordem.descricaoProblema || 'Não informado'}</div>
            </div>
            <div class="row" style="margin-top: 8px;">
              <div class="label">SERVIÇOS REALIZADOS</div>
            </div>
            <div class="row">
              <div class="value">${ordem.descricaoServico || 'Serviços de manutenção e reparo'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">VALORES</div>
            <div class="row">
              <div class="col">
                <div class="label">MÃO DE OBRA</div>
                <div class="value">R$ ${(ordem.valorMaoObra || 0).toFixed(2)}</div>
              </div>
              <div class="col">
                <div class="label">PEÇAS</div>
                <div class="value">R$ ${(ordem.valorPecas || 0).toFixed(2)}</div>
              </div>
              <div class="col">
                <div class="label">DESCONTO</div>
                <div class="value">R$ 0,00</div>
              </div>
              <div class="col">
                <div class="label total">TOTAL</div>
                <div class="value total">R$ ${((ordem.valorMaoObra || 0) + (ordem.valorPecas || 0)).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">INFORMAÇÕES COMPLEMENTARES</div>
            <div class="row">
              <div class="col">
                <div class="label">DATA DE EMISSÃO</div>
                <div class="value">${dataEmissao.toLocaleDateString('pt-BR')} ${dataEmissao.toLocaleTimeString('pt-BR')}</div>
              </div>
              <div class="col">
                <div class="label">STATUS</div>
                <div class="value">${this.getStatusLabel(ordem.status)}</div>
              </div>
            </div>
            ${ordem.observacoes ? `
            <div class="row" style="margin-top: 8px;">
              <div class="col">
                <div class="label">OBSERVAÇÕES</div>
                <div class="value">${ordem.observacoes}</div>
              </div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">CHAVE DE ACESSO</div>
            <div class="row">
              <div class="col">
                <div class="chave">${chaveAcesso}</div>
              </div>
            </div>
            <div class="barcode">*${numeroNFe}*</div>
          </div>

          <div class="footer">
            <p><strong>DOCUMENTO SEM VALOR FISCAL</strong></p>
            <p>Este documento é apenas um comprovante de serviço prestado.</p>
            <p>Para emissão de Nota Fiscal válida, consulte um contador.</p>
            <p style="margin-top: 10px;">Emitido em: ${dataEmissao.toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Abrir em nova janela para impressão
    const janelaImpressao = window.open('', '_blank');
    if (janelaImpressao) {
      janelaImpressao.document.write(conteudoHTML);
      janelaImpressao.document.close();
      janelaImpressao.focus();
      setTimeout(() => {
        janelaImpressao.print();
      }, 250);
    }
  }

  private gerarNumeroNFe(): string {
    // Gerar número sequencial baseado em timestamp
    const timestamp = Date.now();
    const numero = timestamp.toString().slice(-6);
    return numero.padStart(6, '0');
  }

  private gerarChaveAcesso(): string {
    // Gerar chave de acesso simulada (44 dígitos)
    const uf = '43'; // RS
    const aamm = new Date().toISOString().slice(2, 7).replace('-', '');
    const cnpj = '00000000000100';
    const modelo = '55';
    const serie = '001';
    const numero = this.gerarNumeroNFe().padStart(9, '0');
    const tipoEmissao = '1';
    const codigoNumerico = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

    const chaveBase = uf + aamm + cnpj + modelo + serie + numero + tipoEmissao + codigoNumerico;
    const dv = this.calcularDV(chaveBase);

    const chave = chaveBase + dv;

    // Formatar com espaços a cada 4 dígitos
    return chave.match(/.{1,4}/g)?.join(' ') || chave;
  }

  private calcularDV(chave: string): string {
    const pesos = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;

    for (let i = 0; i < chave.length; i++) {
      soma += parseInt(chave[i]) * pesos[i];
    }

    const resto = soma % 11;
    const dv = resto < 2 ? 0 : 11 - resto;

    return dv.toString();
  }

  private formatarDocumento(doc: string | null): string {
    if (!doc) return '';
    const numeros = doc.replace(/\D/g, '');
    if (numeros.length === 11) {
      // CPF
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numeros.length === 14) {
      // CNPJ
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
  }

  private getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      'RECEBIDO': 'Recebido',
      'DIAGNOSTICO': 'Diagnóstico',
      'AGUARDANDO_PECAS': 'Aguardando peças',
      'EM_REPARO': 'Em reparo',
      'PRONTO': 'Pronto',
      'ENTREGUE': 'Entregue'
    };
    return statusMap[status] || status;
  }

  deletar(): void {
    if (!this.ordemId || !confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      return;
    }
    this.carregando.set(true);
    this.errorMessage.set(null);
    this.ordemService
      .delete(this.ordemId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/ordens']),
        error: (error) => {
          this.carregando.set(false);
          console.error('Erro ao excluir ordem:', error);
          this.errorMessage.set('Erro ao excluir a ordem de serviço. Tente novamente.');
        },
      });
  }
}
