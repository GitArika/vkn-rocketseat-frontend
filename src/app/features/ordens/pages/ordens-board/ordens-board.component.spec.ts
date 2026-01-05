import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdensBoardComponent } from './ordens-board.component';

describe('OrdensBoardComponent', () => {
  let component: OrdensBoardComponent;
  let fixture: ComponentFixture<OrdensBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdensBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdensBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
