import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsProfileimgComponent } from './profile-settings-profileimg.component';

describe('ProfileSettingsProfileimgComponent', () => {
  let component: ProfileSettingsProfileimgComponent;
  let fixture: ComponentFixture<ProfileSettingsProfileimgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingsProfileimgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsProfileimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
