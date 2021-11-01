import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-credit',
  templateUrl: './wallet-credit.component.html',
  styleUrls: ['./wallet-credit.component.css']
})
export class WalletCreditComponent implements OnInit {
  
  public id;
  public DepositCredit = true;
  public PaymentMethod = false;
  public showColRightPackage = true;
  public showColRightInput = false;
  public SelectCard = false;
  public showWithdrawInput = true;
  public showAccountDetails = false;
  public userBuyer:any;
  public showContent = false;
  public showDisplayName = '';
  public amountCoin:number = 0;
  public amountBaht:number = 0.00;
  public amountBahtShow:string = '0.00';
  public select10Baht = false;
  public select20Baht = false;
  public select50Baht = false;
  public select100Baht = false;
  public packageAutoBid = true;
  public paymentMethodAutoBid = false;
  public profileImg = './assets/img/profile-icon-BG.svg';
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
this.id = this.auth.currentUserId;
    if(this.id){
      this.getProfile();
    }
    else{
      this.router.navigate(['/'])
    }
  }

  getProfile(){
    this.firestore.collection('user-buyer').doc(this.id).valueChanges()
    .subscribe(userBuyer => {
      // console.log(userBuyer)
      this.userBuyer = userBuyer;
      if(this.userBuyer != undefined){
        if(this.userBuyer.profileImg.imgUrl != null){
          this.profileImg = this.userBuyer.profileImg.imgUrl
        }
        if(this.userBuyer.hideDisplayName){
          var name = '';
          for (var i = 0; i < 4; i++) {
            name = name + this.userBuyer.displayName[i];
          }
          this.showDisplayName = name + '****';
        }
        else{
          this.showDisplayName = this.userBuyer.displayName
        }
        this.showContent = true;
      }
      else{
        // console.log(this.userBuyer)
        this.profileImg = './assets/img/profile-icon-BG.svg';
        this.showDisplayName = 'เข้าสู่ระบบ';
        this.showContent = true;
      }
      // this.showContent = true;
    })
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

  selectPackage10Baht(){
    this.select20Baht = false;
    this.select50Baht = false;
    this.select100Baht = false;
    if(this.select10Baht){
      this.select10Baht = false;
      this.amountBaht = 0.00
      this.amountCoin = 0;
      this.amountBahtShow = '0.00'
    }
    else{
      this.select10Baht = true;
      this.amountBaht = 10.00;
      this.amountCoin = 20;
      this.amountBahtShow = '10.00'
    }
  }

  selectPackage20Baht(){
    this.select10Baht = false;
    this.select50Baht = false;
    this.select100Baht = false;
    if(this.select20Baht){
      this.select20Baht = false;
      this.amountBaht = 0.00;
      this.amountCoin = 0;
      this.amountBahtShow = '0.00'
    }
    else{
      this.select20Baht = true;
      this.amountBaht = 20.00;
      this.amountCoin = 42;
      this.amountBahtShow = '20.00'
    }
  }

  selectPackage50Baht(){
    this.select10Baht = false;
    this.select20Baht = false;
    this.select100Baht = false;
    if(this.select50Baht){
      this.select50Baht = false;
      this.amountBaht = 0.00
      this.amountCoin = 0;
      this.amountBahtShow = '0.00'
    }
    else{
      this.select50Baht = true;
      this.amountBaht = 50.00;
      this.amountCoin = 105;
      this.amountBahtShow = '50.00'
    }
  }

  selectPackage100Baht(){
    this.select10Baht = false;
    this.select20Baht = false;
    this.select50Baht = false;
    if(this.select100Baht){
      this.select100Baht = false;
      this.amountBaht = 0.00
      this.amountCoin = 0;
      this.amountBahtShow = '0.00'
    }
    else{
      this.select100Baht = true;
      this.amountBaht = 100.00;
      this.amountCoin = 220;
      this.amountBahtShow = '100.00'
    }
  }

  backwardAutoBid(){
    this.packageAutoBid = true;
    this.paymentMethodAutoBid = false;
  }

  submitAutoBid(){
    // console.log(this.amountBaht)
    this.packageAutoBid = false;
    this.paymentMethodAutoBid = true;
  }

  payment(channel){
    if(channel == 'debitCredit'){
      // "channel_list": ktbcard
      // "fee_type": "THB",
    }
    else if(channel == 'promptpay'){
      // "channel_list": promptpay
      // "fee_type": "THB",
    }
    
  }

  paymentKsherCredit(){
    // CALL API KSHER

    // WHEN CALLBACK PAYMENT SUCCESS FROM KSHER
    var createAt:any = firebase.firestore.Timestamp.now();
    // ADD DATA TO SUBCOLLECTION ABIDMORE-CION
    this.firestore.collection('user-buyer').doc(this.id).collection('abidmore-coin').add({
      amountCoin: this.amountCoin,
      amountMoney: this.amountBaht,
      createAt: createAt,
      payment: 'CREDIT PAYMENT KSHER'
    })
    .then((docDes) => {
      // GET DATA FROM COLLECTION USER-BUYER
      this.firestore.collection('user-buyer').doc(this.id).get().toPromise()
      .then((userBuyer) => {
        var _userBuyer:any = userBuyer.data();
        var _abidmoreCoin = {
          amountCoin: null,
          paymentUID: null,
          updateAt: null
        }
        if(_userBuyer.abidmoreCoin != undefined){
          _abidmoreCoin.amountCoin = _userBuyer.abidmoreCoin.amountCoin + this.amountCoin;
          _abidmoreCoin.paymentUID = docDes.id;
          _abidmoreCoin.updateAt = createAt;
        }
        else{
          _abidmoreCoin.amountCoin = this.amountCoin;
          _abidmoreCoin.paymentUID = docDes.id;
          _abidmoreCoin.updateAt = createAt;
        }
        // UPDATE TO COLLECTION USER-BUYER
        this.firestore.collection('user-buyer').doc(this.id).update({
          abidmoreCoin: _abidmoreCoin
        })
        .then((docDes) => {
          // SUCCESS
        })
      })
    })
  }

}
