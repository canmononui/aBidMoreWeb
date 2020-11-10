import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyMenuListComponent } from './buy-menu-list.component';

describe('BuyMenuListComponent', () => {
  let component: BuyMenuListComponent;
  let fixture: ComponentFixture<BuyMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
