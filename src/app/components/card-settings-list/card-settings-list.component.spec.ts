import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSettingsListComponent } from './card-settings-list.component';

describe('CardSettingsListComponent', () => {
  let component: CardSettingsListComponent;
  let fixture: ComponentFixture<CardSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
