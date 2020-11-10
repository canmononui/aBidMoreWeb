import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDescriptionComponent } from './shop-description.component';

describe('ShopDescriptionComponent', () => {
  let component: ShopDescriptionComponent;
  let fixture: ComponentFixture<ShopDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
