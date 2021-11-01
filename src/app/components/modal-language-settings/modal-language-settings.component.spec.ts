import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLanguageSettingsComponent } from './modal-language-settings.component';

describe('ModalLanguageSettingsComponent', () => {
  let component: ModalLanguageSettingsComponent;
  let fixture: ComponentFixture<ModalLanguageSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLanguageSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLanguageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
