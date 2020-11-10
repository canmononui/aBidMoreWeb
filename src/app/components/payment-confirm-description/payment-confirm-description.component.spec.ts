import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfirmDescriptionComponent } from './payment-confirm-description.component';

describe('PaymentConfirmDescriptionComponent', () => {
  let component: PaymentConfirmDescriptionComponent;
  let fixture: ComponentFixture<PaymentConfirmDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentConfirmDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentConfirmDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
