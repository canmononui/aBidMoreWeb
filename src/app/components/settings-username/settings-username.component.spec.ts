import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUsernameComponent } from './settings-username.component';

describe('SettingsUsernameComponent', () => {
  let component: SettingsUsernameComponent;
  let fixture: ComponentFixture<SettingsUsernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsUsernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
