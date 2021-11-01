import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWaitingConfirmListComponent } from './order-waiting-confirm-list.component';

describe('OrderWaitingConfirmListComponent', () => {
  let component: OrderWaitingConfirmListComponent;
  let fixture: ComponentFixture<OrderWaitingConfirmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWaitingConfirmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWaitingConfirmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
