import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNameComponent } from './settings-name.component';

describe('SettingsNameComponent', () => {
  let component: SettingsNameComponent;
  let fixture: ComponentFixture<SettingsNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
