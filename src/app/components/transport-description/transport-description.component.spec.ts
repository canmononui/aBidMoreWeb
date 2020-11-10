import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportDescriptionComponent } from './transport-description.component';

describe('TransportDescriptionComponent', () => {
  let component: TransportDescriptionComponent;
  let fixture: ComponentFixture<TransportDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
