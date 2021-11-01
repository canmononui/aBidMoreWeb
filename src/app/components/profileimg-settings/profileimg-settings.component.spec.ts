import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileimgSettingsComponent } from './profileimg-settings.component';

describe('ProfileimgSettingsComponent', () => {
  let component: ProfileimgSettingsComponent;
  let fixture: ComponentFixture<ProfileimgSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileimgSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileimgSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
