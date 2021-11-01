import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserBuyerComponent } from './update-user-buyer.component';

describe('UpdateUserBuyerComponent', () => {
  let component: UpdateUserBuyerComponent;
  let fixture: ComponentFixture<UpdateUserBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateUserBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
