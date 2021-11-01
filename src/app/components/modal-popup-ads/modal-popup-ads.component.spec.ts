import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPopupAdsComponent } from './modal-popup-ads.component';

describe('ModalPopupAdsComponent', () => {
  let component: ModalPopupAdsComponent;
  let fixture: ComponentFixture<ModalPopupAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPopupAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPopupAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
