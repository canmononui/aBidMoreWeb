import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckEmailVerifyComponent } from './check-email-verify.component';

describe('CheckEmailVerifyComponent', () => {
  let component: CheckEmailVerifyComponent;
  let fixture: ComponentFixture<CheckEmailVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckEmailVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckEmailVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
