import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCenterListComponent } from './help-center-list.component';

describe('HelpCenterListComponent', () => {
  let component: HelpCenterListComponent;
  let fixture: ComponentFixture<HelpCenterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCenterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
