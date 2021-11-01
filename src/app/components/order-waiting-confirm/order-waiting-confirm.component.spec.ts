import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWaitingConfirmComponent } from './order-waiting-confirm.component';

describe('OrderWaitingConfirmComponent', () => {
  let component: OrderWaitingConfirmComponent;
  let fixture: ComponentFixture<OrderWaitingConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWaitingConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWaitingConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
