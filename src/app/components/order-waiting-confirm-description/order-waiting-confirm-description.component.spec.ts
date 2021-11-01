import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWaitingConfirmDescriptionComponent } from './order-waiting-confirm-description.component';

describe('OrderWaitingConfirmDescriptionComponent', () => {
  let component: OrderWaitingConfirmDescriptionComponent;
  let fixture: ComponentFixture<OrderWaitingConfirmDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWaitingConfirmDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWaitingConfirmDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
