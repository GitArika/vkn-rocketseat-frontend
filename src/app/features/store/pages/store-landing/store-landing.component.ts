import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-store-landing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="store-container">
      <!-- Navbar Simplificada para Loja -->
      <nav class="store-nav">
        <div class="brand">
          <span class="logo">OP</span>
          <strong>Oficina<span>Pro</span> Store</strong>
        </div>
        <div class="nav-links">
          <a href="#ferramentas">Ferramentas</a>
          <a href="#cortadores">Cortadores</a>
          <a href="#sobre">Sobre Nós</a>
          <a routerLink="/login" class="btn-admin">Acesso Restrito</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <span class="badge">Lançamento 2024</span>
          <h1>Potência Máxima para o seu <span>Trabalho</span></h1>
          <p>Explore nossa nova linha de ferramentas elétricas e cortadores de grama de alta performance. Tecnologia alemã ao seu alcance.</p>
          <div class="hero-actions">
            <a href="#ferramentas" class="btn-primary">Ver Catálogo</a>
            <a href="#sobre" class="btn-outline">Conheça a Qualidade</a>
          </div>
        </div>
        <div class="hero-image">
           <img src="images/hero_tools.png" alt="Ferramentas Pro">
        </div>
      </header>

      <!-- Featured Categories -->
      <section id="categorias" class="categories">
        <div class="section-header">
          <h2>Categorias em Destaque</h2>
          <p>Equipamentos selecionados para profissionais e entusiastas.</p>
        </div>

        <div class="category-grid">
          <div class="category-card" id="ferramentas">
            <div class="card-image">
              <img src="images/drill.png" alt="Ferramentas Elétricas">
            </div>
            <div class="card-content">
              <h3>Ferramentas Elétricas</h3>
              <p>Furadeiras, serras e parafusadeiras com torque superior e bateria de longa duração.</p>
              <button class="btn-card">Explorar Linha</button>
            </div>
          </div>

          <div class="category-card" id="cortadores">
            <div class="card-image">
              <img src="images/lawnmower.png" alt="Cortadores de Grama">
            </div>
            <div class="card-content">
              <h3>Cortadores de Grama</h3>
              <p>Manutenção impecável para o seu jardim com nossos cortadores elétricos e robóticos.</p>
              <button class="btn-card">Ver Modelos</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits">
        <div class="benefit-item">
          <div class="icon">🚀</div>
          <h4>Entrega Turbo</h4>
          <p>Receba em até 24h na sua oficina ou residência.</p>
        </div>
        <div class="benefit-item">
          <div class="icon">🛡️</div>
          <h4>Garantia Pro</h4>
          <p>2 anos de garantia total em todos os equipamentos elétricos.</p>
        </div>
        <div class="benefit-item">
          <div class="icon">🛠️</div>
          <h4>Suporte Técnico</h4>
          <p>Assistência especializada própria sempre à disposição.</p>
        </div>
      </section>

      <!-- CTA Footer -->
      <footer class="store-footer">
        <div class="footer-content">
          <h2>Pronto para elevar seu nível de serviço?</h2>
          <p>Entre em contato com nossos consultores para orçamentos personalizados.</p>
          <button class="btn-cta">Falar com Consultor</button>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 OficinaPro Store. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      --primary: #2563eb;
      --primary-dark: #1e40af;
      --accent: #10b981;
      --dark: #0f172a;
      --light: #f8fafc;
      --grey: #64748b;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .store-container {
      background: var(--light);
      min-height: 100vh;
      color: var(--dark);
      overflow-x: hidden;
    }

    /* Navbar */
    .store-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 5%;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 10px;
      font-weight: 800;
      font-size: 1.25rem;
    }

    .brand strong {
      font-size: 1.5rem;
      letter-spacing: -0.5px;
    }

    .brand strong span {
      color: var(--primary);
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--grey);
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: var(--primary);
    }

    .btn-admin {
      background: var(--dark);
      color: white !important;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
    }

    /* Hero */
    .hero {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      align-items: center;
      padding: 4rem 5% 6rem;
      gap: 4rem;
      position: relative;
      background: white;
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .hero h1 {
      font-size: 4rem;
      line-height: 1.1;
      font-weight: 900;
      margin-bottom: 1.5rem;
      letter-spacing: -2px;
    }

    .hero h1 span {
      background: linear-gradient(to right, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      font-size: 1.25rem;
      color: var(--grey);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-primary {
      padding: 1rem 2rem;
      background: var(--primary);
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
      transition: transform 0.3s, background 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      background: var(--primary-dark);
    }

    .btn-outline {
      padding: 1rem 2rem;
      border: 2px solid var(--grey);
      color: var(--dark);
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      border-color: var(--dark);
      background: var(--light);
    }

    .hero-image img {
      width: 100%;
      height: auto;
      border-radius: 24px;
      box-shadow: 30px 30px 80px rgba(0,0,0,0.1);
      transform: rotate(2deg);
    }

    /* Categories */
    .categories {
      padding: 6rem 5%;
      background: var(--light);
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    .category-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
    }

    .category-card {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .category-card:hover {
      transform: scale(1.02);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }

    .category-card .card-image {
      flex: 1;
      max-width: 200px;
    }

    .category-card .card-image img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 10px 10px rgba(0,0,0,0.15));
    }

    .category-card .card-content {
      flex: 1.5;
    }

    .category-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .category-card p {
      color: var(--grey);
      margin-bottom: 1.5rem;
      font-size: 0.9375rem;
      line-height: 1.5;
    }

    .btn-card {
      padding: 0.75rem 1.5rem;
      background: var(--dark);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-card:hover {
      background: var(--primary);
    }

    /* Benefits */
    .benefits {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
      padding: 6rem 10%;
      background: white;
      text-align: center;
    }

    .benefit-item .icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }

    .benefit-item h4 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .benefit-item p {
      color: var(--grey);
    }

    /* Footer */
    .store-footer {
      background: var(--dark);
      color: white;
      padding: 8rem 5% 4rem;
      text-align: center;
    }

    .footer-content h2 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      letter-spacing: -1px;
    }

    .footer-content p {
      font-size: 1.25rem;
      color: rgba(255,255,255,0.6);
      margin-bottom: 3rem;
    }

    .btn-cta {
      padding: 1.25rem 3rem;
      background: white;
      color: var(--dark);
      border: none;
      border-radius: 14px;
      font-weight: 700;
      font-size: 1.125rem;
      cursor: pointer;
      transition: transform 0.3s, background 0.3s;
    }

    .btn-cta:hover {
      transform: scale(1.05);
      background: var(--primary);
      color: white;
    }

    .footer-bottom {
      margin-top: 6rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.4);
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
      }
      .hero-content {
        order: 1;
      }
      .hero-image {
        order: 0;
        max-width: 500px;
        margin: 0 auto;
      }
      .hero h1 { font-size: 3rem; }
      .hero-actions { justify-content: center; }
      .category-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .benefits { grid-template-columns: 1fr; }
      .hero h1 { font-size: 2.5rem; }
      .footer-content h2 { font-size: 2rem; }
    }
  `]
})
export class StoreLandingComponent { }
