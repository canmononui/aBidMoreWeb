import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportPrepareListComponent } from './transport-prepare-list.component';

describe('TransportPrepareListComponent', () => {
  let component: TransportPrepareListComponent;
  let fixture: ComponentFixture<TransportPrepareListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportPrepareListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportPrepareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
