import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
// TIMER 
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-shop-description',
  templateUrl: './shop-description.component.html',
  styleUrls: ['./shop-description.component.css']
})
export class ShopDescriptionComponent implements OnInit {

  public id;
  public userSeller:any;
  authState: any = null;
  public showContent = false;
  public selectProduct = true;
  public selectGroupProduct = false;
  public selectReview = false;
  public groupProductShow = [];
  public productBiddingList = [];
  public productWaitAuctionList = [];
  public productForSaleList = [];
  public productLike = [];
  public groupProductList = [];
  public reviewProductList = [];
  public ratingStars0:any
  public ratingStars1:any
  public ratingStars2:any
  public ratingStars3:any
  public ratingStars4:any
  public ratingStars5:any
  public userBuyer: any;
  // TIMER
  private subscription: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 100;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // console.log('->', this.auth.currentUserId)
    this.id = this.route.snapshot.paramMap.get("id");
    if(this.id){
      this.afAuth.authState.subscribe((auth) => {
        // USER LOGIN
        if(auth){
          this.authState = auth;
          this.firestore.collection('user-buyer').doc(this.authState.uid).get().toPromise()
            .then((val) => {
              this.userBuyer = val.data();
              if(this.userBuyer != undefined){

                // SET DATA FOR ADD VIEWERS
                var timestampHours: any = firebase.firestore.Timestamp.now().toDate().getHours();
                var timestampMinutes: any = firebase.firestore.Timestamp.now().toDate().getMinutes();
                var period: any;

                // CHECK PERIOD
                if ((timestampHours >= 0 && timestampMinutes >= 1 ) && (timestampHours <= 3 && timestampMinutes <= 59)) {
                  period = '00:01-03:00';
                }
                else if ((timestampHours >= 3 && timestampMinutes >= 1 ) && (timestampHours <= 6 && timestampMinutes <= 59)) {
                  period = '03:01-06:00';
                }
                else if ((timestampHours >= 6 && timestampMinutes >= 1 ) && (timestampHours <= 9 && timestampMinutes <= 59)) {
                  period = '06:01-09:00';
                }
                else if ((timestampHours >= 9 && timestampMinutes >= 1 ) && (timestampHours <= 12 && timestampMinutes <= 59)) {
                  period = '09:01-12:00';
                }
                else if ((timestampHours >= 12 && timestampMinutes >= 1 ) && (timestampHours <= 15 && timestampMinutes <= 59)) {
                  period = '12:01-15:00';
                }
                else if ((timestampHours >= 15 && timestampMinutes >= 1 ) && (timestampHours <= 18 && timestampMinutes <= 59)) {
                  period = '15:01-18:00';
                }
                else if ((timestampHours >= 18 && timestampMinutes >= 1 ) && (timestampHours <= 21 && timestampMinutes <= 59)) {
                  period = '18:01-21:00';
                }
                else if ((timestampHours >= 21 && timestampMinutes >= 1 ) && (timestampHours <= 23 && timestampMinutes <= 59)) {
                  period = '21:01-00:00';
                }
                else{
                  period = null;
                }

                // CHECK ADD VIEWERS
                if(this.userBuyer.age != undefined && this.userBuyer.gender != undefined && period != null){
                  // ADD VIEWERS
                  this.firestore.collection('shop').doc(this.id).collection('viewers').add({
                    age: this.userBuyer.age,
                    sex: this.userBuyer.gender,
                    createAt: firebase.firestore.Timestamp.now(),
                    period: period
                  })
                }
                
                this.firestore.collection('user-buyer').doc(this.authState.uid).collection('like', ref => ref
                ).snapshotChanges()
                .map(actions => {
                  return actions.map(action =>  ( action.payload.doc.id ));
                }).subscribe(dataLike => {
                  // console.log('like : ',dataLike);
                  if(dataLike.length != 0){
                    this.productLike = dataLike;
                    this.getShopData();
                    this.getShopProduct();
                    this.getProductReview0();
                  }
                  else{
                    this.productLike = [];
                    this.getShopData();
                    this.getShopProduct();
                    this.getProductReview0();
                  }
                })  
              }
              else{
                // ANONYMOUS
                this.productLike = [];
                this.getShopData();
                this.getShopProduct();
                this.getProductReview0();
              }
            })
        }
        else{
          this.productLike = [];
          this.getShopData();
          this.getShopProduct();
          this.getProductReview0();
        }
      })
    }
    else{
      this.router.navigate(['/'])
    }
  }

  getShopData(){
    this.firestore.collection('shop').doc(this.id).get().toPromise()
    .then((shopDes) => {
      this.userSeller = shopDes.data()
      // console.log(this.userSeller)
      if(this.userSeller.profileImg.imgUrl == null){  
        this.userSeller.profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
      }
      if(this.userSeller.coverImg.imgUrl == null){  
        this.userSeller.coverImg.imgUrl = './assets/img/seller-profile/store-img-cover.png'
      }
      if(this.userSeller.groupProduct == null){
        this.groupProductShow = [{
          groupName: 'ไม่มีหมวดหมู่',
          amountProduct: 0
        }]
      }
      else{
        for(var i=0; i<this.userSeller.groupProduct.length; i++){
          // console.log(this.userSeller.groupProduct[i])
          this.getCountProductInGroupName(this.userSeller.groupProduct[i])
        }
      }
      // GET COUNT FOLLOWER BUYER
      this.firestore.collection('shop').doc(this.id).collection('follower-buyer')
      .valueChanges()
      .subscribe(snap => {
          this.userSeller.followerBuyer = snap.length
          // GET CHECK USER FOLLOWING THIS SELLER
          if(this.authState != null){
            this.getFollowingStatus();
          }
          else{
            this.userSeller.follow = 'ติดตาม';
          }
      });
    })
  }

  getCountProductInGroupName(groupName){
    var _dataProduct:any = []
    this.firestore.collection("product" , ref => ref
    .where('groupProduct', '==', groupName)
    .where('sellerUID', '==', this.id)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(groupName)
      // console.log('-', querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
        if(_docData.productStatus == 'waitAuction' || _docData.productStatus == 'bidding' || _docData.productStatus == 'forSale' || _docData.productStatus == 'onSale14Days'){
          if(_docData.productStatus == 'forSale'){
            _docData.priceData.priceAutoWin = _docData.priceData.priceProduct
          }
          _dataProduct.push({
            key: doc.id,
            value: _docData
          })
        }
      });
      this.groupProductShow.push({
        groupName: groupName,
        amountProduct: _dataProduct.length,
        dataProduct: _dataProduct
      })
    })
  }

  getFollowingStatus(){
    // console.log(this.authState.uid)
    this.firestore.collection('shop').doc(this.id).collection('follower-buyer', ref => ref
    .where('buyerUID', '==', this.authState.uid)
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action =>  ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(follow => {
      var _follow:any = follow;
      if(_follow != 0){
        this.userSeller.follow = 'กำลังติดตาม';
      }
      else{
        this.userSeller.follow = 'ติดตาม';
      }
    });
  }

  getShopProduct(){
    this.firestore.collection('product', ref => ref
    .where('productStatus', '==', 'bidding')
    .where('sellerUID', '==', this.id)
    .orderBy('createAt', 'desc')
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(productBiddingList => {
      var _productBiddingList:any = productBiddingList;
      // console.log(_productBiddingList)
      if(_productBiddingList.length != 0){
        for (var i = 0; i < _productBiddingList.length; i++) {
          // if(_productBiddingList[i].value.priceData.priceAutoWin == 0){
          //   _productBiddingList[i].value.priceData.priceAutoWin = 'ประมูล'
          // }
          // else{
          //   _productBiddingList[i].value.priceData.priceAutoWin = '฿' + _productBiddingList[i].value.priceData.priceAutoWin
          // }
          if (this.productLike.indexOf(_productBiddingList[i].key) !== -1) {
            // SET LIKE
            _productBiddingList[i].value.likeStatus = true;
          }
          else{
            // SET NOT LIKE
            _productBiddingList[i].value.likeStatus = false;
          }
          // SET DEFAULT TIME COUNTDOWN
          _productBiddingList[i].value.dateTime.count = {
            secondsToDday: '00',
            minutesToDday: '00',
            hoursToDday: '00'
          }
          // console.log(doc.id, _productDes)
          this.getLastAuctionHis(_productBiddingList[i].key, _productBiddingList[i].value);
        }
        this.productBiddingList = _productBiddingList;
        // SUBSCRIPTION FIREBASE TIMESTAMP
        this.subscription = interval(1000).subscribe(x => { 
          this.setTimeBidCount()
          // console.log(this.firebaseTimestamp);
        });
      }
      // console.log(this.productBiddingList)
      // this.getShopProductWaitAuction();
    });
    this.getShopProductWaitAuction();
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
        productDes.priceData.lastPriceBidding = productDes.priceData.priceStart;
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


  getShopProductWaitAuction(){
    this.firestore.collection('product', ref => ref
    .where('productStatus', '==', 'waitAuction')
    .where('sellerUID', '==', this.id)
    .orderBy('createAt', 'desc')
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(productWaitAuctionList => {
      var _productWaitAuctionList:any = productWaitAuctionList;
      // console.log(_productWaitAuctionList)
      if(_productWaitAuctionList.length != 0){
        for (var i = 0; i < _productWaitAuctionList.length; i++) {
          // if(_productWaitAuctionList[i].value.priceData.priceAutoWin == 0){
          //   _productWaitAuctionList[i].value.priceData.priceAutoWin = 'ประมูล'
          // }
          // else{
          //   _productWaitAuctionList[i].value.priceData.priceAutoWin = '฿' + _productWaitAuctionList[i].value.priceData.priceAutoWin
          // }
          if (this.productLike.indexOf(_productWaitAuctionList[i].key) !== -1) {
            // SET LIKE
            _productWaitAuctionList[i].value.likeStatus = true;
          }
          else{
            // SET NOT LIKE
            _productWaitAuctionList[i].value.likeStatus = false;
          }
          if(_productWaitAuctionList[i].value.dateTime.timeBidCount.hour != 0){
            // if(_productWaitAuctionList[i].value.dateTime.timeBidCount.hour < 10){
            //   _productWaitAuctionList[i].value.dateTime.timeCountMax = {
            //     typeTH: 'ชั่วโมง',
            //     typeEN: 'HOUR',
            //     value: '0' + (_productWaitAuctionList[i].value.dateTime.timeBidCount.hour).toString()
            //   }
            // }
            // else {
            //   _productWaitAuctionList[i].value.dateTime.timeCountMax = {
            //     typeTH: 'ชั่วโมง',
            //     typeEN: 'HOUR',
            //     value: (_productWaitAuctionList[i].value.dateTime.timeBidCount.hour).toString()
            //   }
            // }
            _productWaitAuctionList[i].value.dateTime.timeCountMax = {
              typeTH: 'ชั่วโมง',
              typeEN: 'HOUR',
              value: (_productWaitAuctionList[i].value.dateTime.timeBidCount.hour).toString()
            }
          }
          else if(_productWaitAuctionList[i].value.dateTime.timeBidCount.minute != 0){
            // if(_productWaitAuctionList[i].value.dateTime.timeBidCount.minute < 10){
            //   _productWaitAuctionList[i].value.dateTime.timeCountMax = {
            //     typeTH: 'นาที',
            //     typeEN: 'MINUTE',
            //     value: '0' + (_productWaitAuctionList[i].value.dateTime.timeBidCount.minute).toString()
            //   }
            // }
            // else {
            //   _productWaitAuctionList[i].value.dateTime.timeCountMax = {
            //     typeTH: 'นาที',
            //     typeEN: 'MINUTE',
            //     value: (_productWaitAuctionList[i].value.dateTime.timeBidCount.minute).toString()
            //   }
            // }
            _productWaitAuctionList[i].value.dateTime.timeCountMax = {
              typeTH: 'นาที',
              typeEN: 'MINUTE',
              value: (_productWaitAuctionList[i].value.dateTime.timeBidCount.minute).toString()
            }
          }
          else {
            // if(_productWaitAuctionList[i].value.dateTime.timeBidCount.second < 10){
            //   _productWaitAuctionList[i].value.dateTime.timeCountMax = {
            //     typeTH: 'วินาที',
            //     typeEN: 'SECOND',
            //     value: '0' + (_productWaitAuctionList[i].value.dateTime.timeBidCount.second).toString()
            //   }
            // }
            // else {
            //   _productWaitAuctionList[i].value.dateTime.timeCountMax = {
            //     typeTH: 'วินาที',
            //     typeEN: 'SECOND',
            //     value: (_productWaitAuctionList[i].value.dateTime.timeBidCount.second).toString()
            //   }
            // }
            _productWaitAuctionList[i].value.dateTime.timeCountMax = {
              typeTH: 'วินาที',
              typeEN: 'SECOND',
              value: (_productWaitAuctionList[i].value.dateTime.timeBidCount.second).toString()
            }
          }
          this.getLastAuctionHis(_productWaitAuctionList[i].key, _productWaitAuctionList[i].value);
        }
        this.productWaitAuctionList = _productWaitAuctionList
      }
      // console.log(this.productWaitAuctionList)
      this.getShopProductForSale()
    });
  }

  getShopProductForSale(){
    this.firestore.collection('product', ref => ref
    .where('productStatus', '==', 'forSale')
    .where('sellerUID', '==', this.id)
    .orderBy('createAt', 'desc')
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(productForSaleList => {
      var _productForSaleList:any = productForSaleList;
      // console.log(_productForSaleList)
      if(_productForSaleList.length != 0){
        for (var i = 0; i < _productForSaleList.length; i++) {
          if (this.productLike.indexOf(_productForSaleList[i].key) !== -1) {
            // SET LIKE
            _productForSaleList[i].value.likeStatus = true;
          }
          else{
            // SET NOT LIKE
            _productForSaleList[i].value.likeStatus = false;
          }
        }
        this.productForSaleList = _productForSaleList
      }
      // console.log(this.productForSaleList)
      this.getShopProductOnSale14Days()
    });
  }

  getShopProductOnSale14Days(){
    this.firestore.collection('product', ref => ref
    .where('productStatus', '==', 'onSale14Days')
    .where('sellerUID', '==', this.id)
    .orderBy('createAt', 'desc')
    ).snapshotChanges()
    .map(actions => {
      return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    }).subscribe(productOnSale14DaysList => {
      var _productOnSale14DaysList:any = productOnSale14DaysList;
      // console.log(_productOnSale14DaysList)
      if(_productOnSale14DaysList.length != 0){
        for (var i = 0; i < _productOnSale14DaysList.length; i++) {
          if (this.productLike.indexOf(_productOnSale14DaysList[i].key) !== -1) {
            // SET LIKE
            _productOnSale14DaysList[i].value.likeStatus = true;
            this.productForSaleList.push(_productOnSale14DaysList[i])
          }
          else{
            // SET NOT LIKE
            _productOnSale14DaysList[i].value.likeStatus = false;
            this.productForSaleList.push(_productOnSale14DaysList[i])
          }
        }
        // for(var i=0; i<_productOnSale14DaysList.length; i++){
        //   this.productBiddingList.push(_productOnSale14DaysList[i])
        // }
        // this.productForSaleList = _productOnSale14DaysList
      }
      // console.log(this.productForSaleList)
    });
  }

  getProductReview0(){
    var _dataProductReview:any = []
    this.firestore.collection('shop').doc(this.id).collection('product' , ref => ref
    .where('ratingStars', '==', 0)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(querySnapshot)
      // console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
          _dataProductReview.push({
            key: doc.id,
            value: _docData
          })
        // dataProductReview
      });
      this.ratingStars0 = {
        amountProduct: _dataProductReview.length,
        dataProductReview: _dataProductReview
      }
      this.getProductReview1();
    })
  }

  getProductReview1(){
    var _dataProductReview:any = []
    this.firestore.collection('shop').doc(this.id).collection('product' , ref => ref
    .where('ratingStars', '==', 1)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(querySnapshot)
      // console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
          _dataProductReview.push({
            key: doc.id,
            value: _docData
          })
        // dataProductReview
      });
      this.ratingStars1 = {
        amountProduct: _dataProductReview.length,
        dataProductReview: _dataProductReview
      }
      this.getProductReview2();
    })
  }

  getProductReview2(){
    var _dataProductReview:any = []
    this.firestore.collection('shop').doc(this.id).collection('product' , ref => ref
    .where('ratingStars', '==', 2)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(querySnapshot)
      // console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
          _dataProductReview.push({
            key: doc.id,
            value: _docData
          })
        // dataProductReview
      });
      this.ratingStars2 = {
        amountProduct: _dataProductReview.length,
        dataProductReview: _dataProductReview
      }
      this.getProductReview3();
    })
  }

  getProductReview3(){
    var _dataProductReview:any = []
    this.firestore.collection('shop').doc(this.id).collection('product' , ref => ref
    .where('ratingStars', '==', 3)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(querySnapshot)
      // console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
          _dataProductReview.push({
            key: doc.id,
            value: _docData
          })
        // dataProductReview
      });
      this.ratingStars3 = {
        amountProduct: _dataProductReview.length,
        dataProductReview: _dataProductReview
      }
      this.getProductReview4();
    })
  }

  getProductReview4(){
    var _dataProductReview:any = []
    this.firestore.collection('shop').doc(this.id).collection('product' , ref => ref
    .where('ratingStars', '==', 4)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(querySnapshot)
      // console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
          _dataProductReview.push({
            key: doc.id,
            value: _docData
          })
        // dataProductReview
      });
      this.ratingStars4 = {
        amountProduct: _dataProductReview.length,
        dataProductReview: _dataProductReview
      }
      this.getProductReview5();
    })
  }

  getProductReview5(){
    var _dataProductReview:any = []
    this.firestore.collection('shop').doc(this.id).collection('product' , ref => ref
    .where('ratingStars', '==', 5)
    .orderBy('createAt', 'desc')
    ).get().toPromise()
    .then((querySnapshot) => {
      // console.log(querySnapshot)
      // console.log(querySnapshot.size)
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var _docData:any = doc.data();
          _dataProductReview.push({
            key: doc.id,
            value: _docData
          })
        // dataProductReview
      });
      this.ratingStars5 = {
        amountProduct: _dataProductReview.length,
        dataProductReview: _dataProductReview
      }
      this.showContent = true;
    })
  }

  gotoProductDes(key){
    // console.log(key)
    // this.router.navigate([`/product-description/${key}`]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${key}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  gotoProductReview(key){
    this.router.navigate([`/product-review/${this.id}_${key}`]);
  }

  followShop(){
    if(this.userSeller.follow == 'กำลังติดตาม'){
      // DELETE ADD SHOP
      this.firestore.collection('shop').doc(this.id).collection('follower-buyer').doc(this.authState.uid).delete();
      // DELETE ADD BUYER
      this.firestore.collection('user-buyer').doc(this.authState.uid).collection('following-seller').doc(this.id).delete();
    }
    else{
      // SET ADD SHOP
      this.firestore.collection('shop').doc(this.id).collection('follower-buyer').doc(this.authState.uid).set({
        buyerUID: this.authState.uid,
        createAt: firebase.firestore.Timestamp.now()
      })
      // SET ADD BUYER
      this.firestore.collection('user-buyer').doc(this.authState.uid).collection('following-seller').doc(this.id).set({
        sellerUID: this.id,
        createAt: firebase.firestore.Timestamp.now()
      })
    }
  }

  selectButtonProduct(){
    this.selectProduct = true;
    this.selectGroupProduct = false;
    this.selectReview = false;
  }

  selectButtonGroupProduct(dataGroupProduct){
    // console.log(dataGroupProduct)
      this.selectProduct = false;
      this.selectGroupProduct = true;
      this.selectReview = false;
      this.groupProductList = []
      this.groupProductList = dataGroupProduct;
  }

  selectButtonReview(rateStaer){
    // console.log(rateStaer)
    this.selectProduct = false;
    this.selectGroupProduct = false;
    this.selectReview = true;
    // this.reviewProductList = rateStaer
    this.reviewProductList = rateStaer.dataProductReview
  }

  gotoChatRoom(){
    if(this.userBuyer == undefined){
      this.router.navigate(['/signin'])
    }
    else{
    // GO TO CHAT SHOP
    this.router.navigate([`/chat-message/null&${this.userSeller.uid}&${this.userSeller.shopName}`]);
    }
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
