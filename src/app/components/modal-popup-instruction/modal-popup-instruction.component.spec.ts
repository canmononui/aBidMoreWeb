import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPopupInstructionComponent } from './modal-popup-instruction.component';

describe('ModalPopupInstructionComponent', () => {
  let component: ModalPopupInstructionComponent;
  let fixture: ComponentFixture<ModalPopupInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPopupInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPopupInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
