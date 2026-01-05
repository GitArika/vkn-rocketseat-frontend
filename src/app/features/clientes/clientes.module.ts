import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesListComponent } from './pages/clientes-list/clientes-list.component';
import { ClienteFormComponent } from './pages/cliente-form/cliente-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ClientesRoutingModule, ClientesListComponent, ClienteFormComponent],
})
export class ClientesModule {}
