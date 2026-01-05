import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Login</h1>
        <p class="subtitle">Sistema de Cadastro de Clientes - Oficina</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="seu@email.com"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <span class="error-message">Email é obrigatório</span>
            }
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input
              id="senha"
              type="password"
              formControlName="senha"
              placeholder="••••••••"
              [class.error]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
            />
            @if (loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched) {
              <span class="error-message">Senha é obrigatória</span>
            }
          </div>

          @if (erro()) {
            <div class="alert error">{{ erro() }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || carregando()">
            {{ carregando() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .login-card {
        background: white;
        border-radius: 12px;
        padding: 2.5rem;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      h1 {
        margin: 0 0 0.5rem 0;
        color: #1a202c;
        font-size: 1.875rem;
      }

      .subtitle {
        color: #718096;
        margin: 0 0 2rem 0;
        font-size: 0.9rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #374151;
        font-weight: 500;
        font-size: 0.875rem;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }

      input:focus {
        outline: none;
        border-color: #667eea;
      }

      input.error {
        border-color: #ef4444;
      }

      .error-message {
        display: block;
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .alert {
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      .alert.error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }

      .btn-primary {
        width: 100%;
        padding: 0.75rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-primary:hover:not(:disabled) {
        background: #5568d3;
      }

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  carregando = signal(false);
  erro = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.erro.set(null);
    this.carregando.set(true);

    const { email, senha } = this.loginForm.value;

    this.authService.login({ email: email!, senha: senha! }).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.carregando.set(false);
        
        // Tratar diferentes tipos de erro
        if (err.status === 0) {
          this.erro.set('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        } else if (err.status === 401 || err.status === 403) {
          this.erro.set(err.error?.message || 'Email ou senha inválidos');
        } else if (err.error?.message) {
          this.erro.set(err.error.message);
        } else {
          this.erro.set('Erro ao fazer login. Tente novamente.');
        }
      },
      complete: () => {
        this.carregando.set(false);
      }
    });
  }
}
