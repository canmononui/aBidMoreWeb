import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfirmListComponent } from './payment-confirm-list.component';

describe('PaymentConfirmListComponent', () => {
  let component: PaymentConfirmListComponent;
  let fixture: ComponentFixture<PaymentConfirmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentConfirmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConfirmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
