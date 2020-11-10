import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-credit',
  templateUrl: './wallet-credit.component.html',
  styleUrls: ['./wallet-credit.component.css']
})
export class WalletCreditComponent implements OnInit {
  public DepositCredit = true;
  public PaymentMethod = false;
  public showColRightPackage = true;
  public showColRightInput = false;

  public SelectCard = false;

  public showWithdrawInput = true;
  public showAccountDetails = false;

  constructor() { }

  ngOnInit(): void {
  }

  ChangeToInput() {
    this.showColRightPackage = false;
    this.showColRightInput = true;
  }

  ChangeToPackage() {
    this.showColRightPackage = true;
    this.showColRightInput = false;
  }

  submitCredit() {
    this.DepositCredit = false;
    this.PaymentMethod = true;
  }

  submitCard() {
    this.PaymentMethod = false;
    this.SelectCard = true;
  }

  submitAmountWithdraw() {
    this.showWithdrawInput = false;
    this.showAccountDetails = true;
  }






}
