import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantComingSoonComponent } from './merchant-coming-soon.component';

describe('MerchantComingSoonComponent', () => {
  let component: MerchantComingSoonComponent;
  let fixture: ComponentFixture<MerchantComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantComingSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
