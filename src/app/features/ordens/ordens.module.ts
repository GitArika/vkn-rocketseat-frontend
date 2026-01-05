import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { OrdensRoutingModule } from './ordens-routing.module';
import { OrdensBoardComponent } from './pages/ordens-board/ordens-board.component';
import { OrdemFormComponent } from './pages/ordem-form/ordem-form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, OrdensRoutingModule, OrdensBoardComponent, OrdemFormComponent],
})
export class OrdensModule {}
