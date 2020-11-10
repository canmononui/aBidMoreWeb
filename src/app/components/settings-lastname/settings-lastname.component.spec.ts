import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLastnameComponent } from './settings-lastname.component';

describe('SettingsLastnameComponent', () => {
  let component: SettingsLastnameComponent;
  let fixture: ComponentFixture<SettingsLastnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsLastnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLastnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
