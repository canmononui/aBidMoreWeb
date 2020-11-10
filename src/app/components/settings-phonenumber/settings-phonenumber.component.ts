import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-phonenumber',
  templateUrl: './settings-phonenumber.component.html',
  styleUrls: ['./settings-phonenumber.component.css']
})
export class SettingsPhonenumberComponent implements OnInit {


  public showInputOTP = true;
  public showMsgNewPhone = false;
  public showBtnSubmit = true
  public showBtnModal = false;


  constructor() { }

  ngOnInit(): void {
  }

  submitChangePhone() {
    this.showInputOTP = false;
    this.showBtnSubmit = false;
    this.showMsgNewPhone = true;
    this.showBtnModal = true;
  }


}
