import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSuccessDescriptionComponent } from './transport-success-description.component';

describe('TransportSuccessDescriptionComponent', () => {
  let component: TransportSuccessDescriptionComponent;
  let fixture: ComponentFixture<TransportSuccessDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportSuccessDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportSuccessDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
