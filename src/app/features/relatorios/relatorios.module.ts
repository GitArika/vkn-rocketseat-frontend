import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatoriosDashboardComponent } from './pages/relatorios-dashboard/relatorios-dashboard.component';

@NgModule({
  imports: [CommonModule, RelatoriosRoutingModule, RelatoriosDashboardComponent],
})
export class RelatoriosModule {}
