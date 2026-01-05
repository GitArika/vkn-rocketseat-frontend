import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ClienteService } from '../../../../core/services/cliente.service';
import { EquipamentoService } from '../../../../core/services/equipamento.service';
import { ClientePayload } from '../../../../core/models/cliente.model';
import { EquipamentoPayload } from '../../../../core/models/equipamento.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-wrapper">
        <!-- Header -->
        <header class="page-header">
          <div class="header-content">
            <div class="header-text">
              <h1 class="page-title">{{ titulo }}</h1>
              <p class="page-subtitle">
                Preencha os dados obrigatórios (nome e pelo menos um contato).
              </p>
            </div>
            <button class="btn-back" type="button" (click)="voltar()">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Voltar
            </button>
          </div>
        </header>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="salvar()" class="form-container">
          
          <!-- Informações Básicas -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor"/>
                  <path d="M10 12C4.477 12 0 14.477 0 17.5V20H20V17.5C20 14.477 15.523 12 10 12Z" fill="currentColor"/>
                </svg>
              </div>
              <h2 class="section-title">Informações Básicas</h2>
            </div>

            <div class="form-grid">
              <div class="form-group span-full">
                <label class="form-label required">Nome completo</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="nome" 
                  placeholder="Ex.: João da Silva"
                  [class.invalid]="form.get('nome')?.invalid && form.get('nome')?.touched"
                />
                <span class="form-hint">Nome completo do cliente</span>
              </div>

              <div class="form-group">
                <label class="form-label">Documento</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="documento" 
                  placeholder="CPF ou CNPJ"
                />
                <span class="form-hint">CPF ou CNPJ</span>
              </div>

              <div class="form-group">
                <label class="form-label">E-mail</label>
                <input 
                  type="email" 
                  class="form-input" 
                  formControlName="email" 
                  placeholder="contato@email.com"
                  [class.invalid]="form.get('email')?.invalid && form.get('email')?.touched"
                />
                <span class="form-hint">E-mail para contato</span>
              </div>

              <div class="form-group">
                <label class="form-label">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="telefone" 
                  placeholder="(11) 99999-0000"
                />
                <span class="form-hint">Telefone fixo, celular ou WhatsApp</span>
              </div>
            </div>
          </section>

          <!-- Endereço -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0C6.13 0 3 3.13 3 7C3 12.25 10 20 10 20C10 20 17 12.25 17 7C17 3.13 13.87 0 10 0ZM10 9.5C8.62 9.5 7.5 8.38 7.5 7C7.5 5.62 8.62 4.5 10 4.5C11.38 4.5 12.5 5.62 12.5 7C12.5 8.38 11.38 9.5 10 9.5Z" fill="currentColor"/>
                </svg>
              </div>
              <h2 class="section-title">Endereço</h2>
            </div>

            <div class="form-grid">
              <div class="form-group span-full">
                <label class="form-label">Endereço completo</label>
                <textarea 
                  rows="3" 
                  class="form-textarea" 
                  formControlName="endereco" 
                  placeholder="Rua, número, bairro, cidade, estado"
                ></textarea>
                <span class="form-hint">Endereço completo para entrega ou visita</span>
              </div>
            </div>
          </section>

          <!-- Ferramentas / Equipamentos -->
          <section class="form-section equipamentos-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 3.75H2.5C1.81 3.75 1.25 4.31 1.25 5V15C1.25 15.69 1.81 16.25 2.5 16.25H17.5C18.19 16.25 18.75 15.69 18.75 15V5C18.75 4.31 18.19 3.75 17.5 3.75ZM17.5 15H2.5V5H17.5V15Z" fill="currentColor"/>
                  <path d="M5 7.5H8.75V12.5H5V7.5Z" fill="currentColor"/>
                  <path d="M11.25 7.5H15V9.375H11.25V7.5Z" fill="currentColor"/>
                  <path d="M11.25 10.625H15V12.5H11.25V10.625Z" fill="currentColor"/>
                </svg>
              </div>
              <h2 class="section-title">Ferramenta / Equipamento</h2>
            </div>

            <div class="form-grid">
              <div class="form-group span-full">
                <label class="form-label">Descrição da ferramenta</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="equipamentoDescricao" 
                  placeholder="Ex.: Furadeira de impacto Bosch"
                />
                <span class="form-hint">Descreva a ferramenta ou equipamento principal do cliente</span>
              </div>

              <div class="form-group">
                <label class="form-label">Marca</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="equipamentoMarca" 
                  placeholder="Ex.: Bosch"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Modelo</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="equipamentoModelo" 
                  placeholder="Ex.: GSB 450"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Número de série</label>
                <input 
                  type="text" 
                  class="form-input" 
                  formControlName="equipamentoNumeroSerie" 
                  placeholder="Ex.: 123456789"
                />
              </div>
            </div>
          </section>

          <!-- Observações e Status -->
          <section class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M17.5 0H2.5C1.12 0 0 1.12 0 2.5V17.5C0 18.88 1.12 20 2.5 20H17.5C18.88 20 20 18.88 20 17.5V2.5C20 1.12 18.88 0 17.5 0ZM17.5 17.5H2.5V2.5H17.5V17.5Z" fill="currentColor"/>
                  <path d="M5 5H15V7.5H5V5Z" fill="currentColor"/>
                  <path d="M5 10H15V12.5H5V10Z" fill="currentColor"/>
                </svg>
              </div>
              <h2 class="section-title">Observações e Status</h2>
            </div>

            <div class="form-grid">
              <div class="form-group span-full">
                <label class="form-label">Observações internas</label>
                <textarea 
                  rows="4" 
                  class="form-textarea" 
                  formControlName="observacoes" 
                  placeholder="Anotações internas sobre o cliente, preferências, histórico, etc."
                ></textarea>
                <span class="form-hint">Informações adicionais visíveis apenas internamente</span>
              </div>

              <div class="form-group span-full">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="ativo" class="checkbox-input" />
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">
                    <strong>Cliente ativo</strong>
                    <small>Marque se o cliente está ativo no sistema</small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <!-- Actions -->
          <div class="form-actions">
            <button class="btn btn-secondary" type="button" (click)="voltar()" [disabled]="carregando()">
              Cancelar
            </button>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid || carregando()">
              <svg *ngIf="carregando()" class="spinner" width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M8 2 A6 6 0 0 1 14 8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
              </svg>
              {{ carregando() ? 'Salvando...' : 'Salvar cliente' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      /* Container & Layout */
      .container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem 1rem;
      }

      .page-wrapper {
        max-width: 1200px;
        margin: 0 auto;
      }

      /* Header */
      .page-header {
        margin-bottom: 2rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        flex-wrap: wrap;
      }

      .header-text {
        flex: 1;
        min-width: 250px;
      }

      .page-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.02em;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .page-subtitle {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        font-weight: 400;
      }

      .btn-back {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: #ffffff;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-back:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
      }

      .btn-back svg {
        transition: transform 0.2s ease;
      }

      .btn-back:hover svg {
        transform: translateX(-2px);
      }

      /* Form Container */
      .form-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Form Sections */
      .form-section {
        background: #ffffff;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .form-section:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08), 0 15px 30px rgba(0, 0, 0, 0.12);
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.75rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f3f4f6;
        flex-wrap: wrap;
      }

      .section-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        flex-shrink: 0;
      }

      .section-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
        flex: 1;
        min-width: 200px;
      }

      /* Form Grid */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .span-full {
        grid-column: 1 / -1;
      }

      /* Form Groups */
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .form-label.required::after {
        content: '*';
        color: #ef4444;
        font-weight: 700;
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 1rem;
        color: #1f2937;
        background: #ffffff;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-input::placeholder,
      .form-textarea::placeholder {
        color: #9ca3af;
      }

      .form-input.invalid,
      .form-textarea.invalid {
        border-color: #ef4444;
      }

      .form-input.invalid:focus,
      .form-textarea.invalid:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-hint {
        font-size: 0.85rem;
        color: #6b7280;
        font-style: italic;
      }

      /* Checkbox */
      .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        cursor: pointer;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 10px;
        border: 2px solid #e5e7eb;
        transition: all 0.2s ease;
      }

      .checkbox-label:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
      }

      .checkbox-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .checkbox-custom {
        width: 24px;
        height: 24px;
        border: 2px solid #d1d5db;
        border-radius: 6px;
        flex-shrink: 0;
        position: relative;
        transition: all 0.2s ease;
        background: #ffffff;
      }

      .checkbox-input:checked + .checkbox-custom {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
      }

      .checkbox-input:checked + .checkbox-custom::after {
        content: '';
        position: absolute;
        left: 7px;
        top: 3px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      .checkbox-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .checkbox-text strong {
        color: #1f2937;
        font-weight: 600;
      }

      .checkbox-text small {
        color: #6b7280;
        font-size: 0.85rem;
      }

      /* Equipment Section */
      .equipamentos-section {
        background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      }

      .btn-add-equipment {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
      }

      .btn-add-equipment:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
      }

      .btn-add-equipment:active {
        transform: translateY(0);
      }

      .equipamentos-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .equipment-card {
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.2s ease;
      }

      .equipment-card:hover {
        border-color: #d1d5db;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .equipment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f3f4f6;
      }

      .equipment-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .btn-remove-equipment {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fef2f2;
        color: #ef4444;
        border: 1px solid #fecaca;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-remove-equipment:hover {
        background: #ef4444;
        color: #ffffff;
        transform: rotate(90deg);
      }

      .equipment-fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.25rem;
      }

      .empty-equipment-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #9ca3af;
      }

      .empty-equipment-state svg {
        margin-bottom: 1.5rem;
        opacity: 0.5;
      }

      .empty-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #6b7280;
        margin: 0 0 0.5rem 0;
      }

      .empty-subtitle {
        font-size: 0.95rem;
        color: #9ca3af;
        margin: 0;
      }

      /* Form Actions */
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 2rem;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.1);
        flex-wrap: wrap;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        min-width: 150px;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }

      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .btn-secondary {
        background: #ffffff;
        color: #374151;
        border: 2px solid #e5e7eb;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      .btn-secondary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .container {
          padding: 1rem 0.75rem;
        }

        .page-title {
          font-size: 2rem;
        }

        .page-subtitle {
          font-size: 1rem;
        }

        .form-section {
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.2rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .equipment-fields {
          grid-template-columns: 1fr;
        }

        .form-actions {
          padding: 1.5rem;
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }

        .header-content {
          flex-direction: column;
        }

        .btn-back {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .page-title {
          font-size: 1.75rem;
        }

        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .btn-add-equipment {
          width: 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class ClienteFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly equipamentoService = inject(EquipamentoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  titulo = 'Novo cliente';
  carregando = signal(false);
  private clienteId: string | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    documento: [''],
    email: ['', Validators.email],
    telefone: [''], // Campo unificado Telefone/WhatsApp
    endereco: [''],
    observacoes: [''],
    ativo: [true],
    // Equipamento único (não é array)
    equipamentoDescricao: [''],
    equipamentoMarca: [''],
    equipamentoModelo: [''],
    equipamentoNumeroSerie: [''],
  });



  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.clienteId = id;
        this.titulo = 'Editar cliente';
        this.carregarCliente(id);
      }
    });
  }

  private carregarCliente(id: string): void {
    this.carregando.set(true);
    this.clienteService
      .getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((cliente) => {
          this.form.patchValue(cliente);
          return this.equipamentoService.listByCliente(id);
        })
      )
      .subscribe({
        next: (equipamentos) => {
          // Carregar apenas o primeiro equipamento se existir
          if (equipamentos.length > 0) {
            const eq = equipamentos[0];
            this.form.patchValue({
              equipamentoDescricao: eq.descricao,
              equipamentoMarca: eq.marca,
              equipamentoModelo: eq.modelo,
              equipamentoNumeroSerie: eq.numeroSerie,
            });
          }
        },
        error: () => this.form.reset(),
        complete: () => this.carregando.set(false),
      });
  }



  salvar(): void {
    if (this.form.invalid) return;

    const clientePayload = {
      nome: this.form.value.nome,
      documento: this.form.value.documento,
      email: this.form.value.email,
      telefone: this.form.value.telefone,
      whatsapp: this.form.value.telefone, // Usa o mesmo valor para ambos
      endereco: this.form.value.endereco,
      observacoes: this.form.value.observacoes,
      ativo: this.form.value.ativo,
    } as ClientePayload;

    this.carregando.set(true);

    const operacaoCliente = this.clienteId
      ? this.clienteService.update(this.clienteId, clientePayload)
      : this.clienteService.create(clientePayload);

    operacaoCliente
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((cliente) => {
          const clienteIdFinal = this.clienteId || cliente.id;
          return this.salvarEquipamentos(clienteIdFinal);
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: () => this.carregando.set(false),
      });
  }

  private salvarEquipamentos(clienteId: string) {
    const descricao = this.form.value.equipamentoDescricao;

    // Só salva se tiver descrição preenchida
    if (!descricao || !descricao.trim()) {
      return of(null);
    }

    const payload: EquipamentoPayload = {
      clienteId,
      descricao: descricao,
      marca: this.form.value.equipamentoMarca || null,
      modelo: this.form.value.equipamentoModelo || null,
      numeroSerie: this.form.value.equipamentoNumeroSerie || null,
      dataCompra: null,
      observacoes: null,
    };

    return this.equipamentoService.create(payload);
  }

  voltar(): void {
    this.router.navigate(['/clientes']);
  }
}
