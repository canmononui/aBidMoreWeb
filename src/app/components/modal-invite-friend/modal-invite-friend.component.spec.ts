import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInviteFriendComponent } from './modal-invite-friend.component';

describe('ModalInviteFriendComponent', () => {
  let component: ModalInviteFriendComponent;
  let fixture: ComponentFixture<ModalInviteFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInviteFriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInviteFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
