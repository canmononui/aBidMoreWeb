import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTotalComponent } from './payment-total.component';

describe('PaymentTotalComponent', () => {
  let component: PaymentTotalComponent;
  let fixture: ComponentFixture<PaymentTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
