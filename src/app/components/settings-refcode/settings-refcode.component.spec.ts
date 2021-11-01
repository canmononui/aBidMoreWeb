import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRefcodeComponent } from './settings-refcode.component';

describe('SettingsRefcodeComponent', () => {
  let component: SettingsRefcodeComponent;
  let fixture: ComponentFixture<SettingsRefcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsRefcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsRefcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
