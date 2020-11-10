import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSettingsListComponent } from './address-settings-list.component';

describe('AddressSettingsListComponent', () => {
  let component: AddressSettingsListComponent;
  let fixture: ComponentFixture<AddressSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
