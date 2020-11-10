import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-email',
  templateUrl: './settings-email.component.html',
  styleUrls: ['./settings-email.component.css']
})
export class SettingsEmailComponent implements OnInit {

  public showMsgAlert = true;
  public showMsgNewMail = false;
  public showBtnSubmit = true
  public showBtnModal = false;


  constructor() { }

  ngOnInit(): void {

  }

  submitChangeEmail() {
    this.showMsgAlert = false;
    this.showBtnSubmit = false;
    this.showMsgNewMail = true;
    this.showBtnModal = true;
  }

}
