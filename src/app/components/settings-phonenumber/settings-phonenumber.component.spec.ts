import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPhonenumberComponent } from './settings-phonenumber.component';

describe('SettingsPhonenumberComponent', () => {
  let component: SettingsPhonenumberComponent;
  let fixture: ComponentFixture<SettingsPhonenumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPhonenumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPhonenumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
