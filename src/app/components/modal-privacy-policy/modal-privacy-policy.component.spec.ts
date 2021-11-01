import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrivacyPolicyComponent } from './modal-privacy-policy.component';

describe('ModalPrivacyPolicyComponent', () => {
  let component: ModalPrivacyPolicyComponent;
  let fixture: ComponentFixture<ModalPrivacyPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrivacyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
