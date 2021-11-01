import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyDescriptionComponent } from './privacy-policy-description.component';

describe('PrivacyPolicyDescriptionComponent', () => {
  let component: PrivacyPolicyDescriptionComponent;
  let fixture: ComponentFixture<PrivacyPolicyDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
