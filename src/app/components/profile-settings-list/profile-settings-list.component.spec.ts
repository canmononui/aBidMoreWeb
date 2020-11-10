import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsListComponent } from './profile-settings-list.component';

describe('ProfileSettingsListComponent', () => {
  let component: ProfileSettingsListComponent;
  let fixture: ComponentFixture<ProfileSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
