import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSuccessListComponent } from './transport-success-list.component';

describe('TransportSuccessListComponent', () => {
  let component: TransportSuccessListComponent;
  let fixture: ComponentFixture<TransportSuccessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportSuccessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportSuccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
