import { Component, OnInit, OnDestroy } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
// TIMER 
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // MODAL POPUP INSTRUCTION
  public showPopupInstruction = false;
  public imgSrc = '../assets/img/instruction/instruction-auction.png'
  public textDesAuction_1 = true 
  public textDesAutoWin_2 = false 
  public textDesAutoBid_3 = false 
  public textDesSeller_4 = false 
  // END MODAL POPUP INSTRUCTION
  public auctioningRow1 = false
  public auctioningRow2 = false
  public showContent = false;
  public fbTimestamp: any
  authState: any = null;
  public productBidding: any = [];
  public productWaitAction: any = [];
  public productOther: any = [];
  public showNoProductBiddingText = false;
  public showNoProductWaitActionText = false;
  public showNoProductOtherText = false;
  // FOR TIMER
  interval;
  // TIMER
  // private subscription: Subscription;
  private subscription0: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private subscription6: Subscription;
  private subscription7: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 100;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  // public timeDifference;
  // public secondsToDday:any = '00';
  // public minutesToDday:any = '00';
  // public hoursToDday:any = '00';
  public timeCount0:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount1:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount2:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount3:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount4:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount5:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount6:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };
  public timeCount7:any = { secondsToDday:'00', minutesToDday:'00', hoursToDday:'00' };

  constructor(
    public router: Router,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { 
    // // SUBSCRIBE ROUTER URL FOR PAUSE TIMER
    // router.events.subscribe((val) => {
    //   if(val instanceof NavigationEnd){
    //     // console.log(val)
    //     var _path = val.url.split("/", 2);
    //     // console.log(_path)
    //     if(_path.length == 2 && _path[0] == '' && _path[1] != ''){
    //       // console.log('CALL FUNC PAUSE TIMER')
    //       this.pauseTimer()
    //     }
    //   }
    // });
  }

  ngOnInit(): void {
    // GET STATE SHOW POPUP INSTRUCTION
    var localIns = localStorage.getItem('showPopupInstruction');
    if(localIns == 'true' || localIns == null){
      this.showPopupInstruction = true;
    }
    else{
      this.showPopupInstruction = false;
    }

    this.afAuth.authState.subscribe((auth) => {
      // this.fbTimestamp = new Date(firebase.firestore.Timestamp.now().seconds * 1000)
      // console.log(this.fbTimestamp)
      // USER LOGIN
      if(auth){
        this.authState = auth;
        this.firestore.collection('user-buyer').doc(this.authState.uid).collection('like', ref => ref
          ).snapshotChanges()
          .map(actions => {
            return actions.map(action =>  ( action.payload.doc.id ));
          }).subscribe(dataLike => {
            // console.log('like : ',dataLike);
            var productLike:any = dataLike;
            // GET PRODUCT BIDDING
            this.getProductBidding(productLike);
            // GET PRODUCT WAITACTION
            this.getProductWaitAction(productLike);
            // this.showNoProductWaitActionText = true;
            // GET PRODUCT OTHER
            this.getProductOthern(productLike)
            // this.showNoProductOtherText = true;
          })
      }
      // USER NOT LOGIN
      else{
        var productLike:any = [];
        // GET PRODUCT BIDDING
        this.getProductBidding(productLike)
        // GET PRODUCT WAITACTION
        this.getProductWaitAction(productLike);
        // GET PRODUCT OTHER
        this.getProductOthern(productLike)
      }
    });
  }

  getProductBidding(productLike){
    // GET PRODUCT BIDDING
    this.firestore.collection('product', ref => ref
    .where('salesType', '==', 'auction')
    .where('productStatus', '==', 'bidding')
    .orderBy('createAt', 'desc')
    .limit(8)
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action =>  ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(productBidding => {
      // console.log('productBidding : ',productBidding);
      this.productBidding = productBidding;
      // console.log('items', items.length)
      if(this.productBidding.length != 0){
        // LOOP FOR CHECK PRODUCT 8 ITEMS
        for (var i = 0; i < this.productBidding.length; i++) {
          // GET LAST DOC AUCTION HISTORY
          this.getLastAuctionHis(this.productBidding[i]);
          // if(this.productBidding[i].value.priceData.priceAutoWin == 0){
          //   // PRODUCT PRICE AUTO WIN == 0 => ONLY BIDDING
          //   this.productBidding[i].value.priceData.priceAutoWin = 'ประมูล'
          // }
          // else{
          //   // PRODUCT PRICE AUTO WIN != 0 => SHOW PRICE AUTO WIN
          //   this.productBidding[i].value.priceData.priceAutoWin = '฿' + this.productBidding[i].value.priceData.priceAutoWin
          // }
          // CHECK PRODUCT STATUS LIKE ?
          if (productLike.indexOf(this.productBidding[i].key) !== -1) {
            // SET LIKE THIS PRODUCT
            this.productBidding[i].value.likeStatus = true;
          }
          else{
            // SET NOT LIKE THIS PRODUCT
            this.productBidding[i].value.likeStatus = false;
          }
          // SET TIMER COUNTING DOWN
          // console.log(this.productBidding[i].value.dateTime.dateEndBid.toDate().getTime())
          if(i == 0){
            this.subscription0 = interval(1000).subscribe(x => { 
              // this.getTimeDifference0( this.productBidding[i].value.dateTime.dateEndBid.toDate().getTime(), firebase.firestore.Timestamp.now().toDate().getTime()); 
              this.allocateTimeUnits0(this.productBidding[0].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 1){
            this.subscription1 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits1(this.productBidding[1].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 2){
            this.subscription2 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits2(this.productBidding[2].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 3){
            this.subscription3 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits3(this.productBidding[3].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 4){
            this.subscription4 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits4(this.productBidding[4].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 5){
            this.subscription5 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits5(this.productBidding[5].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 6){
            this.subscription6 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits6(this.productBidding[6].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
          else if(i == 7){
            this.subscription7 = interval(1000).subscribe(x => { 
              this.allocateTimeUnits7(this.productBidding[7].value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
        }
        // if(this.auctioningRow1 == false && this.auctioningRow2 == false){
          if(this.productBidding.length == 0){
            this.auctioningRow1 = false;
            this.auctioningRow2 = false;
            this.showNoProductBiddingText = true;
          }
          else{
            this.auctioningRow1 = true;
            this.auctioningRow2 = false;
            this.showNoProductBiddingText = false;
          }
        // }
      }
      else{
        this.showNoProductBiddingText = true;
      }
    });
  }

  // TIME DIFFERENCE
  // getTimeDifference0 (dateEndBid, timeStamp) {
  //   this.timeDifference = dateEndBid - timeStamp;
  //   this.allocateTimeUnits(this.timeDifference);
  // }

  allocateTimeUnits0 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount0 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount0 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits1 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount1 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount1 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits2 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount2 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount2 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits3 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount3 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount3 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits4 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount4 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount4 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits5 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount5 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount5 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits6 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount6 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount6 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  allocateTimeUnits7 (timeDifference) {
    // CREATE VARIABLE
    var secondsToDday:any
    var minutesToDday:any
    var hoursToDday:any
    if(timeDifference > 0){
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10){
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else{
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      this.timeCount7 = {
        hoursToDday: hoursToDday,
        minutesToDday: minutesToDday,
        secondsToDday: secondsToDday,
      }
    }
    else {
      this.timeCount7 = {
        hoursToDday: '00',
        minutesToDday: '00',
        secondsToDday: '00',
      }
    }
  }

  ngOnDestroy() {
    for (var i = 0; i < this.productBidding.length; i++) {
      if(i == 0){ this.subscription0.unsubscribe(); }
      else if(i == 1){ this.subscription1.unsubscribe(); }
      else if(i == 2){ this.subscription2.unsubscribe(); }
      else if(i == 3){ this.subscription3.unsubscribe(); }
      else if(i == 4){ this.subscription4.unsubscribe(); }
      else if(i == 5){ this.subscription5.unsubscribe(); }
      else if(i == 6){ this.subscription6.unsubscribe(); }
      else if(i == 7){ this.subscription7.unsubscribe(); }
    }
  }

  // GET PRODUCT STATUS => WAIT AUCTION
  getProductWaitAction(productLike){
    this.firestore.collection('product', ref => ref
    .where('salesType', '==', 'auction')
    .where('productStatus', '==', 'waitAuction')
    .orderBy('createAt', 'desc')
    .limit(8)
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action =>  ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(waitAction => {
      // console.log('waitAction : ',waitAction);
      this.productWaitAction = waitAction;
      if(this.productWaitAction.length != 0){
        // LOOP FOR CHECK PRODUCT 8 ITEMS
        for (var i = 0; i < this.productWaitAction.length; i++) {
          // if(this.productWaitAction[i].value.priceData.priceAutoWin == 0){
          //   // PRODUCT PRICE AUTO WIN == 0 => ONLY BIDDING
          //   this.productWaitAction[i].value.priceData.priceAutoWin = 'ประมูล'
          // }
          // else{
          //   // PRODUCT PRICE AUTO WIN != 0 => SHOW PRICE AUTO WIN
          //   this.productWaitAction[i].value.priceData.priceAutoWin = '฿' + this.productWaitAction[i].value.priceData.priceAutoWin
          // }
          // CHECK PRODUCT STATUS LIKE ?
          if (productLike.indexOf(this.productWaitAction[i].key) !== -1) {
            // SET LIKE THIS PRODUCT
            this.productWaitAction[i].value.likeStatus = true;
          }
          else{
            // SET NOT LIKE THIS PRODUCT
            this.productWaitAction[i].value.likeStatus = false;
          }
          if(this.productWaitAction[i].value.dateTime.timeBidCount.hour != 0){
            // if(this.productWaitAction[i].value.dateTime.timeBidCount.hour < 10){
            //   this.productWaitAction[i].value.dateTime.timeCountMax = {
            //     typeTH: 'ชั่วโมง',
            //     typeEN: 'HOUR',
            //     value: '0' + (this.productWaitAction[i].value.dateTime.timeBidCount.hour).toString()
            //   }
            // }
            // else {
            //   this.productWaitAction[i].value.dateTime.timeCountMax = {
            //     typeTH: 'ชั่วโมง',
            //     typeEN: 'HOUR',
            //     value: (this.productWaitAction[i].value.dateTime.timeBidCount.hour).toString()
            //   }
            // }
            this.productWaitAction[i].value.dateTime.timeCountMax = {
              typeTH: 'ชั่วโมง',
              typeEN: 'HOUR',
              value: (this.productWaitAction[i].value.dateTime.timeBidCount.hour).toString()
            }
          }
          else if(this.productWaitAction[i].value.dateTime.timeBidCount.minute != 0){
            // if(this.productWaitAction[i].value.dateTime.timeBidCount.minute < 10){
            //   this.productWaitAction[i].value.dateTime.timeCountMax = {
            //     typeTH: 'นาที',
            //     typeEN: 'MINUTE',
            //     value: '0' + (this.productWaitAction[i].value.dateTime.timeBidCount.minute).toString()
            //   }
            // }
            // else {
            //   this.productWaitAction[i].value.dateTime.timeCountMax = {
            //     typeTH: 'นาที',
            //     typeEN: 'MINUTE',
            //     value: (this.productWaitAction[i].value.dateTime.timeBidCount.minute).toString()
            //   }
            // }
            this.productWaitAction[i].value.dateTime.timeCountMax = {
              typeTH: 'นาที',
              typeEN: 'MINUTE',
              value: (this.productWaitAction[i].value.dateTime.timeBidCount.minute).toString()
            }
          }
          else {
            // if(this.productWaitAction[i].value.dateTime.timeBidCount.second < 10){
            //   this.productWaitAction[i].value.dateTime.timeCountMax = {
            //     typeTH: 'วินาที',
            //     typeEN: 'SECOND',
            //     value: '0' + (this.productWaitAction[i].value.dateTime.timeBidCount.second).toString()
            //   }
            // }
            // else {
            //   this.productWaitAction[i].value.dateTime.timeCountMax = {
            //     typeTH: 'วินาที',
            //     typeEN: 'SECOND',
            //     value: (this.productWaitAction[i].value.dateTime.timeBidCount.second).toString()
            //   }
            // }
            this.productWaitAction[i].value.dateTime.timeCountMax = {
              typeTH: 'วินาที',
              typeEN: 'SECOND',
              value: (this.productWaitAction[i].value.dateTime.timeBidCount.second).toString()
            }
          }
          this.getLastAuctionHis(this.productWaitAction[i]);
          // if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 1){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'ม.ค.'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 2){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'กพ'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 3){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'มีค'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 4){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'เมย'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 5){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'พค'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 6){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'มิย'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 7){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'กค'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 8){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'สค'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 9){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'กย'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 10){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'ตค'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 11){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'พย'; }
          // else if(this.productWaitAction[i].value.dateTime.dateStartBid.month == 12){ this.productWaitAction[i].value.dateTime.dateStartBid.month = 'ธค'; }
        }
      }
      else{
        this.showNoProductWaitActionText = true;
      }
      // console.log('waitAction : ', this.productWaitAction)
    });
  }

  // GET LAST AUCTION HISTORY
  getLastAuctionHis(productDes){
    this.firestore.collection('product').doc(productDes.key).collection('auction-history', ref => ref
    .orderBy('createAt', 'desc')
    .limit(1)
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action =>  ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(lastAuction => {
      // console.log(productBidding.key, lastAuction)
      if(lastAuction.length != 0){
        productDes.value.priceData.lastPriceBidding = lastAuction[0].value.biddingPrice;
      }
      else{
        productDes.value.priceData.lastPriceBidding = productDes.value.priceData.priceStart
      }
    })
  }

  getProductOthern(productLike){
    this.firestore.collection('product', ref => ref
    .where('salesType', '==', 'setSellingPrice')
    .where('productStatus', '==', 'forSale')
    .orderBy('createAt', 'desc')
    .limit(4)
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action =>  ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(productOther => {
      // console.log('Other : ',productOther);
      this.productOther = productOther;
      // console.log('items', items.length)
      if(productOther.length != 0){
        this.showNoProductOtherText = false;
        for (var i = 0; i < this.productOther.length; i++) {
          if (productLike.indexOf(this.productOther[i].key) !== -1) {
            // SET LIKE
            this.productOther[i].value.likeStatus = true;
          }
          else{
            // SET NOT LIKE
            this.productOther[i].value.likeStatus = false;
          }
          // if(i == this.productOther.length){
          //   this.showNoProductOtherText = false;
          // }
        }
      }
      else{
        this.showNoProductOtherText = true;
      }
      this.showContent = true;
      // console.log('Other : ', this.productOther)
    });
  }

  startTimer() {
    this.fbTimestamp = firebase.firestore.Timestamp.now().seconds;
    this.interval = setInterval(() => {
      // this.fbTimestamp = firebase.firestore.Timestamp.now().seconds;
      this.fbTimestamp = this.fbTimestamp + 1;
      // console.log(this.fbTimestamp)
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  auctioningNext(){
    this.auctioningRow1 = false
    this.auctioningRow2 = true
  }

  auctioningPrevious() {
    this.auctioningRow1 = true
    this.auctioningRow2 = false
   }

  productDes(dataKey){
    // console.log(dataKey)
    // this.router.navigate([`/product-description/${dataKey}`]);
    // CREATE URL
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${dataKey}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  gotoMoreBidding(){
    this.router.navigate(['/search/productBidding']);
  }

  gotoMoreWaitAction(){
    this.router.navigate(['/search/productWaitAction']);
  }

  gotoMoreProductOther(){
    // SET PRICE
    this.router.navigate(['/search/setSellingPrice']);
  }

  // (click)="gotoMoreBidding()"

  // MODAL POPUP INSTRUCTION
  modalPrevious(){
    if(this.textDesSeller_4){
      this.imgSrc = '../assets/img/instruction/instruction-auto-bid.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = true 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoBid_3){
      this.imgSrc = '../assets/img/instruction/instruction-auto-win.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = true
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoWin_2){
      this.imgSrc = '../assets/img/instruction/instruction-auction.png'
      this.textDesAuction_1 = true 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = false
    }
  }

  modalNext(){
    if(this.textDesAuction_1){
      this.imgSrc = '../assets/img/instruction/instruction-auto-win.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = true
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoWin_2){
      this.imgSrc = '../assets/img/instruction/instruction-auto-bid.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = true 
      this.textDesSeller_4 = false
    }
    else if(this.textDesAutoBid_3){
      this.imgSrc = '../assets/img/instruction/instruction-seller.png'
      this.textDesAuction_1 = false 
      this.textDesAutoWin_2 = false
      this.textDesAutoBid_3 = false 
      this.textDesSeller_4 = true
    }
  }

  closeModalInstruction(){
    this.showPopupInstruction = false
    // SAVE LOCAL
    localStorage.setItem('showPopupInstruction', 'false');
  }
  // END MODAL POPUP INSTRUCTION

  likeThisProduct(productKey, productDes){
    // console.log(this.id)
    // console.log(productKey, productDes)

    if(this.authState == null){
      this.router.navigate(['/signin'])
    }
    else{
      if(productDes.likeStatus){
        // NOW LIKE > NO LIKE
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like').doc(productKey).delete();
      }
      else{
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like').doc(productKey).set({
          createAt: firebase.firestore.Timestamp.now(),
          productKey: productKey,
          sellerUID: productDes.sellerUID,
        })
        .catch(error => {
          console.error(`Can't like this product`, error)
        })
      } 
    }
  }
}
