import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdensBoardComponent } from './pages/ordens-board/ordens-board.component';
import { OrdemFormComponent } from './pages/ordem-form/ordem-form.component';

const routes: Routes = [
  { path: '', component: OrdensBoardComponent },
  { path: 'nova', component: OrdemFormComponent },
  { path: ':id/editar', component: OrdemFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdensRoutingModule {}
