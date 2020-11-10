import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelDescriptionComponent } from './order-cancel-description.component';

describe('OrderCancelDescriptionComponent', () => {
  let component: OrderCancelDescriptionComponent;
  let fixture: ComponentFixture<OrderCancelDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCancelDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCancelDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
