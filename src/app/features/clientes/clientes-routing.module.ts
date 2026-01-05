import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesListComponent } from './pages/clientes-list/clientes-list.component';
import { ClienteFormComponent } from './pages/cliente-form/cliente-form.component';

const routes: Routes = [
  { path: '', component: ClientesListComponent },
  { path: 'novo', component: ClienteFormComponent },
  { path: ':id/editar', component: ClienteFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule {}
