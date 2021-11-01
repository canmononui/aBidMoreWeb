import { Component, OnInit, OnDestroy } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase';
// TIMER 
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent implements OnInit, OnDestroy {

  public id;
  public selectBidding = false;
  public selectWin = false;
  public selectLose = false;
  public showContent = false;
  public historyList:any;
  public productBiddingList:any = [];
  public productWinList:any = [];
  public productLoseList:any = [];
  public showNoHistoryText = false;
  // TIMER
  private subscription: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 100;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  public timeDifference;
  public secondsToDday:any = '00';
  public minutesToDday:any = '00';
  public hoursToDday:any = '00';
  public firebaseTimestamp:any;
  public productLike:any = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.productBiddingList = [];
    this.productWinList = [];
    this.productLoseList = [];
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      // GET USER BUYER LIKE
      this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like', ref => ref
      ).snapshotChanges()
      .map(actions => {
        return actions.map(action =>  ( action.payload.doc.id ));
      }).subscribe(productLike => {
        if(productLike.length != 0){
          this.productLike = productLike;
          if (this.selectBidding) {
            for(var i=0; i<this.productBiddingList.length; i++){
              if (this.productLike.indexOf(this.productBiddingList[i].key) !== -1) {
                // SET THIS PRODUCT IS LIKE
                this.productBiddingList[i].value.likeStatus = true;
              }
              else{
                // SET THIS PRODUCT IS NOT LIKE
                this.productBiddingList[i].value.likeStatus = false;
              }
            }
          }
          else if (this.selectWin) {
            for(var i=0; i<this.productWinList.length; i++){
              if (this.productLike.indexOf(this.productWinList[i].key) !== -1) {
                // SET THIS PRODUCT IS LIKE
                this.productWinList[i].value.likeStatus = true;
              }
              else{
                // SET THIS PRODUCT IS NOT LIKE
                this.productWinList[i].value.likeStatus = false;
              }
            }
          }
          else if (this.selectLose) {
            for(var i=0; i<this.productLoseList.length; i++){
              if (this.productLike.indexOf(this.productLoseList[i].key) !== -1) {
                // SET THIS PRODUCT IS LIKE
                this.productLoseList[i].value.likeStatus = true;
              }
              else{
                // SET THIS PRODUCT IS NOT LIKE
                this.productLoseList[i].value.likeStatus = false;
              }
            }
          }
        }
        else{
          this.productLike = [];
        }
      })
      this.getData();
    }
    else{
      this.router.navigate(['/'])
    }
  }

  getData(){
    this.firestore.collection('user-buyer').doc(this.id)
    .collection('product-auction-history', ref => ref
    .orderBy('createAt', 'desc'))
    .get().toPromise()
    .then((historyList) => {
      // console.log(historyList)
      if(historyList.size != 0){
        // SET HISTORY LIST
        this.historyList = historyList;
        // HAVE HISTORY LIST
        // GET DATA BIDDING
        this.selectButtonBidding()
      }
      else{
        // NO HISTORY LIST
        this.historyList = [];
        this.showNoHistoryText = true;
        this.selectBidding = false;
        this.selectWin = false;
        this.selectLose = false;
      }
    })
  }

  selectButtonBidding(){
    this.productBiddingList = [];
    this.productWinList = [];
    this.productLoseList = [];
    if(this.historyList.length != 0){
      // HAVE HISTORY LIST
      this.historyList.forEach((doc) => {
        // console.log(doc.id)
        this.firestore.collection('product').doc(doc.id).valueChanges()
        .subscribe(productDes => {
          // console.log(productDes)
          var _productDes:any = productDes;
          if(_productDes.productStatus == 'bidding'){
            // if(_productDes.priceData.priceAutoWin == 0){
            //   _productDes.priceData.priceAutoWin = 'ประมูล'
            // }
            // else{
            //   _productDes.priceData.priceAutoWin = '฿' + _productDes.priceData.priceAutoWin
            // }
            // SET LIKE
            if(this.productLike.indexOf(doc.id) !== -1){
              _productDes.likeStatus = true;
            }
            else{
              _productDes.likeStatus = false;
            }
            // SET DEFAULT TIME COUNTDOWN
            _productDes.dateTime.count = {
              secondsToDday: '00',
              minutesToDday: '00',
              hoursToDday: '00'
            }
            // console.log(doc.id, _productDes)
            this.getLastAuctionHis(doc.id, _productDes);
            // console.log('->', doc.id)
            if(this.productBiddingList.length == 0){
              this.productBiddingList.push({
                key: doc.id,
                value: _productDes
              });
            }
            else{
              var dataF = this.filterData(doc.id)
              // console.log(dataF)
              if(dataF.length == 0){
                this.productBiddingList.push({
                  key: doc.id,
                  value: _productDes
                });
              }
              else{
                for(var i=0; i<this.productBiddingList.length; i++){
                  if(this.productBiddingList[i].key == doc.id){
                    // console.log('-> UPDATE ', this.productBiddingList[i].key ,'-', doc.id)
                    this.productBiddingList[i].value = _productDes
                    break;
                  }
                }
              }
            }
          }
        })
        
      })
      // SUBSCRIPTION FIREBASE TIMESTAMP
      this.subscription = interval(1000).subscribe(x => { 
        this.setTimeBidCount()
        // console.log(this.firebaseTimestamp);
      });
      this.showNoHistoryText = false;
      this.selectBidding = true;
      this.selectWin = false;
      this.selectLose = false;
    }
    else{
      // NO HISTORY LIST
      this.showNoHistoryText = true;
      this.selectBidding = false;
      this.selectWin = false;
      this.selectLose = false;
    }
  }

  // GET LAST AUCTION HISTORY
  getLastAuctionHis(productKey, productDes){
    // console.log(productKey, productDes)
    this.firestore.collection('product').doc(productKey).collection('auction-history', ref => ref
    .orderBy('createAt', 'desc')
    .limit(1)
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action =>  ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(lastAuction => {
      // console.log(productBidding.key, lastAuction)
      if(lastAuction.length != 0){
        productDes.priceData.lastPriceBidding = lastAuction[0].value.biddingPrice;
      }
      else{
        productDes.priceData.lastPriceBidding = productDes.priceData.priceStart
      }
    })
  }

  setTimeBidCount() {
    this.productBiddingList.forEach((doc) => {
      // console.log(doc.key, doc.value)
      // console.log(doc.key)
      var secondsToDday:any;
      var minutesToDday:any;
      var hoursToDday:any;
      var timeDifference:any = doc.value.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime()
      if(timeDifference > 0){
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
        doc.value.dateTime.count = {
          secondsToDday: secondsToDday,
          minutesToDday: minutesToDday,
          hoursToDday: hoursToDday
        }
      }
      else {
        // TIME < 0 TIME UP
        doc.value.dateTime.count = {
          secondsToDday: '00',
          minutesToDday: '00',
          hoursToDday: '00'
        }
      }
    })
  }

  ngOnDestroy() {
    if(this.subscription != undefined){
      this.subscription.unsubscribe();
    }
  }

  filterData(docID) {
    return this.productBiddingList.filter(object => {
      return object['key'].includes(docID)
    });
  }

  selectButtonWin(){
    this.productBiddingList = [];
    this.productWinList = [];
    this.productLoseList = [];
    if(this.historyList.length != 0){
      this.historyList.forEach((doc) => {
        // console.log(doc.id)
        // GET PRODUCT DES
        this.firestore.collection('product').doc(doc.id).get().toPromise()
        .then((productDes) => {
          var _productDes:any = productDes.data()
          // console.log(doc.id, '-', _productDes)
          if(_productDes.productStatus == 'bidded' && _productDes.winner.uid == this.id){
            // if(_productDes.priceData.priceAutoWin == 0){
            //   _productDes.priceData.priceAutoWin = 'ประมูล'
            // }
            // else{
            //   _productDes.priceData.priceAutoWin = '฿' + _productDes.priceData.priceAutoWin
            // }
            // console.log(_productDes.dateTime.dateEndBid)
            // SET LIKE
            if(this.productLike.indexOf(doc.id) !== -1){
              _productDes.likeStatus = true;
            }
            else{
              _productDes.likeStatus = false;
            }
            this.productWinList.push({
              key: doc.id,
              value: _productDes
            });
            // console.log(this.productWinList)
          }
        })
      })
      this.showNoHistoryText = false;
      this.selectBidding = false;
      this.selectWin = true;
      this.selectLose = false;
    }
    else{
      // NO HISTORY LIST
      this.showNoHistoryText = true;
      this.selectBidding = false;
      this.selectWin = false;
      this.selectLose = false;
    }
  }

  selectButtonLose(){
    this.productBiddingList = [];
    this.productWinList = [];
    this.productLoseList = [];
    if(this.historyList.length != 0){
      this.historyList.forEach((doc) => {
        // console.log(doc.id)
        // GET PRODUCT DES
        this.firestore.collection('product').doc(doc.id).get().toPromise()
        .then((productDes) => {
          var _productDes:any = productDes.data()
          // console.log(doc.id, '-', _productDes)
          if(_productDes.productStatus == 'bidded' && _productDes.winner.uid != this.id){
            // if(_productDes.priceData.priceAutoWin == 0){
            //   _productDes.priceData.priceAutoWin = 'ประมูล'
            // }
            // else{
            //   _productDes.priceData.priceAutoWin = '฿' + _productDes.priceData.priceAutoWin
            // }
            // SET LIKE
            if(this.productLike.indexOf(doc.id) !== -1){
              _productDes.likeStatus = true;
            }
            else{
              _productDes.likeStatus = false;
            }
            this.productLoseList.push({
              key: doc.id,
              value: _productDes
            });
          }
        })
      })
      this.showNoHistoryText = false;
      this.selectBidding = false;
      this.selectWin = false;
      this.selectLose = true;
    }
    else{
      // NO HISTORY LIST
      this.showNoHistoryText = true;
      this.selectBidding = false;
      this.selectWin = false;
      this.selectLose = false;
    }
  }

  gotoProductDes(key){
    // this.router.navigate([`/product-description/${key}`]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${key}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  likeThisProduct(productKey, productDes){
    // console.log(this.id)
    // console.log(productKey, productDes)
    // console.log(this.auth.authState)
    if(this.auth.authState.isAnonymous){
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
