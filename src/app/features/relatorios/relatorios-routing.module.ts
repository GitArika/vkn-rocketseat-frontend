import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelatoriosDashboardComponent } from './pages/relatorios-dashboard/relatorios-dashboard.component';

const routes: Routes = [{ path: '', component: RelatoriosDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosRoutingModule {}
