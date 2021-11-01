import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
// import * as firebase from 'firebase';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, RoutesRecognized } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
// CHART
import { Chart } from 'chart.js';
// CLIPBOARD
import { ClipboardModule } from 'ngx-clipboard';
// TIMER 
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})

export class ProductDescriptionComponent implements OnInit, OnDestroy {

  public auctionPrice = 0;
  // public auctionPriceServer = 7500
  public timeBid = 0;
  public timewaitAuction: any = null;
  // public timeBidServer = 10
  // Chart
  timeBidChart: any = [];
  public productDes: any;
  public id
  public showContent = true;
  public userSeller: any
  authState: any = null;
  public productImgTop: any = '';
  public indexOfproductImgTop: number = 0;
  public statusLike = false;
  public productOther: any = [];
  public showNoProductOtherText = false;
  public showNoBiddinHistoryText = false;
  public historyList = [];
  public queryHistoryList
  public productOptionSelect: any = {
    optionName: '',
    subOption: '',
    number: 0
  }
  public deliveredData: any;
  public deliveredOpt: any;
  public userBuyer: any;
  public abidmoreCoin: number = 0;
  public autoBidShow: string = 'กำหนดราคา';
  public autoBidPrice: number = 0.00;
  public setPriceAutoBidText = '';
  public biddingPrice = '';
  public biddingBuyerName = '';
  public auctionPriceDownDisabled = false;
  public biddingFail = false;
  public selectProductOptionFail = false;
  public productOpText = '';
  time: number = 60;
  display;
  interval;
  public textBiddingButton = 'ร่วมประมูล';
  a: any = 70;
  b: any = 30;
  myChart: any = [];
  public showModalBidded = false;
  intervalSubcribe
  public reviewList: any = [];
  public check = true;
  public buyerUID: any = '';
  // TIMER
  private subscription: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 100;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  public timeDifference;
  public secondsToDday: any = '00';
  public minutesToDday: any = '00';
  public hoursToDday: any = '00';
  public addToCartCheck = false;
  public testModal = false;
  public noProduct = false;
  public nextProDuctLoading = false;
  public showWinnerDetail = false;
  public showNOProductNext = false;
  public bannerTop = false;

  private subscriptionTimer10Sec: Subscription;
  //milliSecondsInASecond10Sec = 1000;
  //hoursInADay10Sec = 24;
  //minutesInAnHour10Sec = 60;
  //SecondsInAMinute10Sec = 60;
  //public minutesToDday10Sec:any = '00';
  //public secondsToDday10Sec:any = '10';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private elementRef: ElementRef
  ) {
    // // SUBSCRIBE ROUTER URL FOR PAUSE TIMER
    // router.events.subscribe((val) => {
    //   if(val instanceof NavigationEnd){
    //     var _path = val.url.split("/", 3);
    //     // console.log(this.id, _path[2])
    //     if(_path[1] == 'product-description' && this.id != _path[2]){
    //       this.ngOnInit()
    //     }
    //     if(_path.length == 2 && _path[0] == '' && _path[1] == ''){
    //       if(this.productDes.productStatus == 'bidding'){
    //         this.subscription.unsubscribe();
    //         console.log('-- unsubscribe - router --')
    //       }
    //       // PAUSE TIMER = BIDDING SEC <= 100
    //       this.pauseTimer();
    //       // PAUSE TIMER = BIDDING SEC >= 100
    //       this.pauseTimerSub();
    //     }
    //   }
    // });
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    // console.log(this.router.url)
    var link: any = this.router.url.split("/", 3)
    // console.log(link[1])
    this.afAuth.authState.subscribe((auth) => {
      // CAN GET AUTH
      var link: any = this.router.url.split("/", 3)
      if (link[1] == 'product-description') {
        // NOW ROUTER IN PRODUCT_DESCRIPTION PAGE => CALL FUNC
        this.buyerUID = auth.uid
        // GET PRODUCT KEY BY ROUTER
        this.id = this.route.snapshot.paramMap.get("id");
        if (this.id) {
          // IS CAN GET ID (PRODUCT KEY)
          this.firestore.collection('user-buyer').doc(this.buyerUID).get().toPromise()
            .then((val) => {
              this.userBuyer = val.data();
              if (this.userBuyer != undefined) {
                // CHECK ABIDMORE COIN
                if (this.userBuyer.abidmoreCoin != undefined) {
                  this.abidmoreCoin = this.userBuyer.abidmoreCoin.amountCoin
                }
                else {
                  this.abidmoreCoin = 0
                }
                // GET USER BUYER LIKE
                this.firestore.collection('user-buyer').doc(this.buyerUID).collection('like', ref => ref
                ).snapshotChanges()
                  .map(actions => {
                    return actions.map(action => (action.payload.doc.id));
                  }).subscribe(dataLike => {
                    var productLike: any = dataLike;
                    if (productLike.indexOf(this.id) !== -1) {
                      // SET THIS PRODUCT IS LIKE
                      this.statusLike = true;
                    }
                    else {
                      // SET THIS PRODUCT IS NOT LIKE
                      this.statusLike = false;
                    }
                    this.getProductDes()
                    this.getProductOthern(productLike)
                  })
              }
              else {
                this.abidmoreCoin = 0
                this.statusLike = false;
                var productLike: any = [];
                this.getProductDes()
                this.getProductOthern(productLike)
              }
            })
        }
        else {
          // IS CAN'T GET ID (PRODUCT KEY)
          this.router.navigate(['/'])
        }
      }
    })
  }

  // TIME DIFFERENCE
  getTimeDifference(dateEndBid, timeStamp) {
    this.timeDifference = dateEndBid - timeStamp;
    this.allocateTimeUnits(this.timeDifference);
  }

  allocateTimeUnits(timeDifference) {
    // SET < 10 => ADD 0 BEFORE NUMBER
    if (timeDifference > 0) {
      if (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10) {
        this.secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else {
        this.secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10) {
        this.minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else {
        this.minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10) {
        this.hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else {
        this.hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
    }
    else {
      // TIME < 0 TIME UP
      this.hoursToDday == '00';
      this.minutesToDday == '00';
      this.secondsToDday == '00';
    }
    // console.log(this.hoursToDday, this.minutesToDday, this.secondsToDday)
  }

  ngOnDestroy() {
    // if(this.productDes.productStatus == 'bidding'){
    //   this.subscription.unsubscribe();
    // }
    if (this.productDes != undefined && this.productDes.productStatus == 'bidding') {
      this.subscription.unsubscribe();
    }
  }

  getProductDes() {
    // GET PRODUCT DES
    this.firestore.collection('product').doc(this.id).valueChanges()
      .subscribe(val => {
        var _val: any = val;
        if (_val != undefined && _val.productStatus != 'banByAdmin') {
          this.noProduct = false;
          this.productDes = val;
          for(var i=0; i<this.productDes.productOption.length; i++){
            var _productOption:any = this.productDes.productOption[i];
            if(_productOption.subOption.length == 0){
              if(_productOption.optionNumber <= 0){
                _productOption.optionNumber = 0;
              }
            }
            else{
              for(var i=0; i<_productOption.subOption.length; i++){
                if(_productOption.subOption[i].subOptionNumber <= 0){
                  _productOption.subOption[i].subOptionNumber = 0;
                }
              }
            }
          }
          // GET GET REVIEW LIST
          this.getReviewList(this.productDes.sellerUID, this.productDes.productKey);
          // SET IMG TOP PREVIEW
          this.productImgTop = this.productDes.imgProduct[0].imgUrl;
          // CHECK TYPE PRODUCT
          if (this.productDes.productStatus == 'deleted') {
            // PRODUCT STATUS == DELETED => DONT SHOW GO TO HOME PAGE
            this.router.navigate(['/'])
          }
          else if (this.productDes.productStatus == 'onSale14Days') {
            // PRODUCT STATUS = ONSALE14DAYS
            // CHANGE PRODUCT SALESTYPE TO SETSELLINGPRICE
            this.productDes.salesType = 'setSellingPrice';
            // CHANGE PRODUCT STATUS TO FORSALE
            this.productDes.productStatus = 'forSale';
            // SET TEXT BIDDING & ADD TO CART BUTTON
            this.textBiddingButton = 'เพิ่มสินค้าลงรถเข็น';
            // SET PRICEPRODUCT BY PRICEAUTOWIN
            this.productDes.priceData.priceProduct = this.productDes.priceData.priceAutoWin;
          }
          else if (this.productDes.productStatus == 'forSale') {
            // PRODUCT STATUS = FORSALE
            // SET TEXT BIDDING & ADD TO CART BUTTON
            this.textBiddingButton = 'เพิ่มสินค้าลงรถเข็น';
            // SET PRICE AUTO WIN
            // this.productDes.priceData.priceAutoWin = '฿' + this.productDes.priceData.priceProduct
          }
          else {
            // PRODUCT STATUS != FORSALE => SET DATA
            // PRODUCT STATUS == BIDDING || WAITAUCTION
            // SET PRICE AUTO WIN
            // if(this.productDes.priceData.priceAutoWin == 0){
            //   this.productDes.priceData.priceAutoWin = 'ประมูลเท่านั้น'
            // }
            // else{
            //   this.productDes.priceData.priceAutoWin = '฿' + this.productDes.priceData.priceAutoWin
            // }
            if (this.productDes.productStatus == 'bidding') {
              // PRODUCT STATUS == BIDDING
              // FUNC TIMER COUNT DOWN => DATE END BID
              this.subscription = interval(1000).subscribe(x => {
                this.getTimeDifference(this.productDes.dateTime.dateEndBid.toDate().getTime(), firebase.firestore.Timestamp.now().toDate().getTime());
              });
            }
            else if (this.productDes.productStatus == 'bidded') {
              // PRODUCT STATUS == BIDDED
              if (this.productDes.winner.uid == this.buyerUID) {
                // WINNER UID == this.buyerUID => SHOW MODAL BIDDED & WINNER ICON
                this.showModalBidded = true;
                // SHOW BIDDED DETAIL
                this.showWinnerDetail = true;
              }
              else {
                this.goToNextProDuctBidding();
              }
            }

            // GET AUCTION-HISTORY
            this.firestore.collection('product').doc(this.id).collection('auction-history', ref => ref
              .orderBy('createAt', 'desc')
              .limit(5)
            ).snapshotChanges()
              .map(actions => {
                return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
              }).subscribe(biddingHistory => {
                if (biddingHistory.length != 0) {
                  // HAVE BUYER BIDDING PRICE
                  this.productDes.biddingHistory = biddingHistory;
                  this.biddingPrice = this.productDes.biddingHistory[0].value.biddingPrice;
                  this.biddingBuyerName = this.productDes.biddingHistory[0].value.buyerName;
                  this.auctionPrice = this.productDes.biddingHistory[0].value.biddingPrice + this.productDes.priceData.priceBid;
                  this.showNoBiddinHistoryText = false;
                }
                else {
                  // NO BUYER BIDDING PRICE
                  this.productDes.biddingHistory = [];
                  this.biddingPrice = this.productDes.priceData.priceStart;
                  this.biddingBuyerName = 'เริ่มประมูล';
                  this.auctionPrice = this.productDes.priceData.priceStart + this.productDes.priceData.priceBid;
                  this.showNoBiddinHistoryText = true;
                }
                // CHECK FOR DISABLED AUCTIONPRICEDOWN
                if (this.auctionPrice == Number(this.biddingPrice) || this.auctionPrice == Number(this.biddingPrice) + this.productDes.priceData.priceBid) {
                  this.auctionPriceDownDisabled = true;
                }
                else {
                  this.auctionPriceDownDisabled = false;
                }
              });
          }

          // GET SHOP DES
          this.firestore.collection('shop').doc(this.productDes.sellerUID).get().toPromise()
            .then((val) => {
              this.userSeller = val.data();
              if (this.userSeller.profileImg.imgUrl == null) {
                this.userSeller.profileImg.imgUrl = './assets/img/seller-profile/store-icon.png'
              }
              // GET COUNT FOLLOWER BUYER
              this.firestore.collection('shop').doc(this.productDes.sellerUID).collection('follower-buyer')
                .valueChanges()
                .subscribe(snap => {
                  this.userSeller.followerBuyer = snap.length
                  // GET CHECK USER FOLLOWING THIS SELLER
                  if (this.auth.currentUserId != "") {
                    this.getFollowingStatus();
                  }
                  else {
                    this.userSeller.follow = 'ติดตาม';
                    this.showContent = true;
                  }
                });
            })
        }
        else {
          this.noProduct = true;
        }
      });
  }

  goToNextProDuctBidding(){
    // SHOW MODAL BIDDED
    this.showModalBidded = true;
    // SHOW LOADING
    this.nextProDuctLoading = true;
    // HIDE BIDDED DETAIL
    this.showWinnerDetail = false;
    // SHOW NO PRODUCT NEXT
    this.showNOProductNext = false;
    // CHECK STOCK
    var _sumStock = 0
    this.productDes.productOption.forEach(doc => {
      // console.log(doc)
      _sumStock = _sumStock + doc.optionNumber;
    });
    if(_sumStock > 1){
      // HAVE STOCK
      // GET NEW PRODUCT == BIDDING
      this.firestore.collection('product', ref => ref
        .where('salesType', '==', 'auction')
        .where('productStatus', '==', 'bidding')
        .where('productKey', '==', this.productDes.productKey)
        .where('sellerUID', '==', this.productDes.sellerUID)
        .orderBy('createAt', 'desc')
        .limit(1)).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(newProductBidding => {
          // console.log(newProductBidding)
          if (newProductBidding.length != 0) {
            this.showModalBidded = false;
            // console.log(newProductBidding.docs[0].id)
            this.router.navigate([`/product-description/${newProductBidding[0].key}`]);
            // RELOAD PADGE
            this.ngOnInit();
          }
          else {
            // SUBSCRIPE DONT HAVE NEW PRODUCT == BIDDING 
            // SHOW LOADING
            this.nextProDuctLoading = true;
            // HIDE BIDDED DETAIL
            this.showWinnerDetail = false;
            // SHOW NO PRODUCT NEXT
            this.showNOProductNext = false;
            // // HIDE LOADING
            // this.nextProDuctLoading = false;      
            // // HIDE BIDDED DETAIL
            // this.showWinnerDetail = false;
            // // SHOW NO PRODUCT NEXT
            // this.showNOProductNext = true;
          }
        })
    }
    else{
      // OUT OF STOCK
      // HIDE LOADING
      this.nextProDuctLoading = false;
      // HIDE BIDDED DETAIL
      this.showWinnerDetail = false;
      // SHOW NO PRODUCT NEXT
      this.showNOProductNext = true;
    }

    // // HIDE MODAL BIDDED
    // this.showModalBidded = false;
    // // GET NEW PRODUCT == BIDDING
    // this.firestore.collection('product', ref => ref
    //   .where('salesType', '==', 'auction')
    //   .where('productStatus', '==', 'bidding')
    //   .where('productKey', '==', this.productDes.productKey)
    //   .where('sellerUID', '==', this.productDes.sellerUID)
    //   // TEST
    //   .orderBy('createAt', 'desc')
    //   .limit(1)).snapshotChanges()
    //   // ).snapshotChanges()
    //   .map(actions => {
    //     return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
    //   }).subscribe(newProductBidding => {
    //     if (newProductBidding.length != 0) {
    //       this.showModalBidded = false;
    //       // console.log(newProductBidding.docs[0].id)
    //       this.router.navigate([`/product-description/${newProductBidding[0].key}`]);
    //       // RELOAD PADGE
    //       this.ngOnInit();
    //     }
    //     else {
    //       // DONT HAVE NEW PRODUCT == BIDDING => SHOW MODAL BIDDED
    //       this.showModalBidded = true;
    //     }
    //   })
  }

  getReviewList(sellerUID, productKey) {
    if (this.check) {
      // GET PRODUCT REVIEW
      this.firestore.collection('shop').doc(sellerUID).collection('product').doc(productKey).collection('product-review').get().toPromise()
        .then((reviewList) => {
          if (reviewList.size != 0) {
            // REVIEW LIST != NULL
            // SET DATA ARR == NULL
            this.reviewList == [];
            reviewList.forEach(doc => {
              // FOR EACH REVIEW LIST
              var _docId: any = doc.id;
              var _docData: any = doc.data();
              // GET USER BUYER IS REVIEW THIS
              this.firestore.collection('user-buyer').doc(_docData.buyerUID).get().toPromise()
                .then((doc) => {
                  if (doc.data() != undefined) {
                    // CAN GET USER BUYER IS REVIEW THIS
                    var _userBuyerReview: any = doc.data();
                    // console.log(_userBuyerReview.displayName)
                    if (_userBuyerReview.hideDisplayName) {
                      // BUYER HIDE DISPLAY NAME
                      var name = '';
                      for (var i = 0; i < 4; i++) {
                        name = name + _userBuyerReview.displayName[i];
                      }
                      _userBuyerReview.displayName = name + '****';
                    }
                    else {
                      // BUYER NOT DISPLAY NAME
                    }
                    if (_userBuyerReview.profileImg.imgUrl == null) {
                      _userBuyerReview.profileImg.imgUrl = './assets/img/profile-icon-BG.svg';
                    }
                    this.reviewList.push({
                      key: _docId,
                      value: {
                        createAt: _docData.createAt,
                        buyerUID: _docData.buyerUID,
                        buyerDisplayName: _userBuyerReview.displayName,
                        buyerProfileImg: _userBuyerReview.profileImg,
                        comment: _docData.comment,
                        ratingStars: _docData.ratingStars
                      }
                    })
                  }
                })
            })
          }
          else {
            // REVIEW LIST == NULL
            this.reviewList = [];
          }
        });
      this.check = false;
    }
    else {
      return
    }
  }

  getFollowingStatus() {
    this.firestore.collection('shop').doc(this.productDes.sellerUID).collection('follower-buyer', ref => ref
      .where('buyerUID', '==', this.auth.currentUserId)
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
      }).subscribe(follow => {
        var _follow: any = follow;
        if (_follow != 0) {
          this.userSeller.follow = 'กำลังติดตาม';
          this.showContent = true;
        }
        else {
          this.userSeller.follow = 'ติดตาม';
          this.showContent = true;
        }
      });
  }

  getProductOthern(productLike) {
    this.firestore.collection('product', ref => ref
      .where('salesType', '==', 'setSellingPrice')
      .where('productStatus', '==', 'forSale')
      .orderBy('createAt', 'desc')
      .limit(4)
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
      }).subscribe(productOther => {
        // console.log('Other : ',productOther);
        this.productOther = productOther;
        // console.log('items', items.length)
        if (productOther.length != 0) {
          this.showNoProductOtherText = false;
          for (var i = 0; i < this.productOther.length; i++) {
            if (productLike.indexOf(this.productOther[i].key) !== -1) {
              // SET LIKE
              this.productOther[i].value.likeStatus = true;
            }
            else {
              // SET NOT LIKE
              this.productOther[i].value.likeStatus = false;
            }
          }
        }
        else {
          this.showNoProductOtherText = true;
        }
      });
  }

  likeThisProduct() {
    // console.log(this.id)
    if (this.userBuyer == undefined) {
      this.router.navigate(['/signin'])
    }
    else {
      if (this.statusLike) {
        // NOW LIKE > NO LIKE
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like').doc(this.id).delete();
      }
      else {
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like').doc(this.id).set({
          createAt: firebase.firestore.Timestamp.now(),
          productKey: this.id,
          sellerUID: this.productDes.sellerUID,
        })
          .catch(error => {
            console.error(`Can't like this product`, error)
          })
      }
    }
  }

  getHistoryList() {
    this.queryHistoryList = this.firestore.collection('product').doc(this.id).collection('auction-history', ref => ref
      .orderBy('createAt', 'desc')
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
      }).subscribe(historyList => {
        this.historyList = [];
        this.historyList = historyList;
      })
  }

  unsubscribeGetHistoryList() {
    this.queryHistoryList.unsubscribe();
  }

  selectImg(index, imgUrl) {
    this.indexOfproductImgTop = index;
    this.productImgTop = imgUrl
  }

  previousImg() {
    this.productImgTop = this.productDes.imgProduct[this.indexOfproductImgTop - 1].imgUrl
    this.indexOfproductImgTop--
  }

  nextImg() {
    this.productImgTop = this.productDes.imgProduct[this.indexOfproductImgTop + 1].imgUrl
    this.indexOfproductImgTop++
  }

  selectproductOption(optionName, subOption) {
    // console.log(optionName, subOption)
    if (this.productOptionSelect.optionName == optionName && this.productOptionSelect.subOption == subOption) {
      // SELECTED? => NULL
      this.productOptionSelect = {
        optionName: "",
        subOption: "",
        number: 0
      }
    }
    else {
      // FIRST SELECT
      this.productOptionSelect = {
        optionName: optionName,
        subOption: subOption, //IF SUB OPTION ARRAY == NULL => THIS VALUE == null
        number: 1
      }
      if(this.productDes.biddingHistory.length != 0 && this.productDes.biddingHistory[0].value.buyerUID == this.auth.currentUserId && (this.productDes.biddingHistory[0].value.productOption.optionName != optionName || this.productDes.biddingHistory[0].value.productOption.subOption != subOption)){
        // SCROLL TO TOP
        window.scroll(0,0);
        // SHOW BANNER ALERT
        this.bannerTop = true;
        // SET TIME COUNT DOWN 10 SEC
        var _timePlus10Sec:any = firebase.firestore.Timestamp.now().toDate().getTime() + 15000;
        this.subscriptionTimer10Sec = interval(1000).subscribe(x => {
          this.setTime10Sec(_timePlus10Sec - firebase.firestore.Timestamp.now().toDate().getTime());
        });
      }
    }
  }

  setTime10Sec(timeDifference) {
    if(timeDifference > 0){
      // TIME COUNT DOWN
      // SET < 10 => ADD 0 BEFORE NUMBER
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
        this.secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else{
        this.secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if(Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10){
        this.minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else{
        this.minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
    }
    else {
      // TIME < 0 TIME UP
      //this.minutesToDday10Sec == '00';
      //this.secondsToDday10Sec == '00';

      this.bannerTop = false;

      // THIS TIME UP && QR EXPIRED
      // UNSUBSCRIBE TIMEER COUNT DOWN
      this.subscriptionTimer10Sec.unsubscribe()
    }
  }

  hideBannerTop(){
    this.bannerTop = false;
    if(this.subscriptionTimer10Sec != undefined){
      this.subscriptionTimer10Sec.unsubscribe()
    }
  }

  followShop() {
    if (this.userBuyer == undefined) {
      this.router.navigate(['/signin'])
    }
    else {
      if (this.userSeller.follow == 'กำลังติดตาม') {
        // DELETE ADD SHOP
        this.firestore.collection('shop').doc(this.productDes.sellerUID)
          .collection('follower-buyer').doc(this.auth.currentUserId).delete();
        // DELETE ADD BUYER
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId)
          .collection('following-seller').doc(this.productDes.sellerUID).delete();
      }
      else {
        // SET ADD SHOP
        this.firestore.collection('shop').doc(this.productDes.sellerUID)
          .collection('follower-buyer').doc(this.auth.currentUserId).set({
            buyerUID: this.auth.currentUserId,
            createAt: firebase.firestore.Timestamp.now()
          })
        // SET ADD BUYER
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId)
          .collection('following-seller').doc(this.productDes.sellerUID).set({
            sellerUID: this.productDes.sellerUID,
            createAt: firebase.firestore.Timestamp.now()
          })
      }
    }
  }

  addToCart() {
    if (this.userBuyer == undefined) {
      this.router.navigate(['/signin'])
    }
    else {
      if (this.productOptionSelect.optionName != "" && this.productOptionSelect.subOption != "") {
        if (this.productDes.salesType == 'auction') {
          // ADD PRODUCT TO CART
          this.firestore.collection('order').add({
            createAt: firebase.firestore.Timestamp.now(),
            buyerUID: this.auth.currentUserId,
            delivery: null,
            device: 'website',
            donate: this.productDes.donate,
            imgProduct: this.productDes.imgProduct,
            priceOfProduct: Number(this.productDes.priceData.priceAutoWin),
            productCreateAt: this.productDes.createAt,
            productDescription: this.productDes.productDescription,
            productKey: this.id,
            productName: this.productDes.name,
            productOption: this.productOptionSelect, //IF SUB OPTION ARRAY == NULL => THIS VALUE == null
            salesType: this.productDes.salesType,
            sellerUID: this.productDes.sellerUID,
            shopName: this.userSeller.shopName,
            status: 'cart',
            tag: this.productDes.tag,
            orderNo: 'ABMTH' + (firebase.firestore.Timestamp.now().seconds).toString()
          })
            .then((doc) => {
              // SHOW MODAL SUCCESS
              this.productOpText = 'เพิ่มสินค้าลงรถเขียนเรียบร้อย โปรดตรวจสอบรถเข็น';
              this.selectProductOptionFail = true;
            })
        }
        else if (this.productDes.salesType == 'setSellingPrice') {
          // ADD PRODUCT TO CART
          this.firestore.collection('order').add({
            createAt: firebase.firestore.Timestamp.now(),
            buyerUID: this.auth.currentUserId,
            delivery: null,
            device: 'website',
            donate: this.productDes.donate,
            imgProduct: this.productDes.imgProduct,
            priceOfProduct: Number(this.productDes.priceData.priceProduct),
            productCreateAt: this.productDes.createAt,
            productDescription: this.productDes.productDescription,
            productKey: this.id,
            productName: this.productDes.name,
            productOption: this.productOptionSelect, //IF SUB OPTION ARRAY == NULL => THIS VALUE == null
            salesType: this.productDes.salesType,
            sellerUID: this.productDes.sellerUID,
            shopName: this.userSeller.shopName,
            status: 'cart',
            tag: this.productDes.tag,
            orderNo: 'ABMTH' + (firebase.firestore.Timestamp.now().seconds).toString()
          })
            .then((doc) => {
              // SHOW MODAL SUCCESS
              this.productOpText = 'เพิ่มสินค้าลงรถเขียนเรียบร้อย โปรดตรวจสอบรถเข็น';
              this.selectProductOptionFail = true;
            })
        }
      }
      else {
        // SHOW MODAL PLASE SELEC PRODUCT OPTION
        this.addToCartCheck = true;
        this.productOpText = 'โปรดเลือกตัวเลือกสินค้า';
        this.selectProductOptionFail = true;
      }
    }
  }

  gotoChatRoom() {
    if (this.userBuyer == undefined) {
      this.router.navigate(['/signin'])
    }
    else {
      // GO TO CHAT SHOP
      this.router.navigate([`/chat-message/null&${this.userSeller.uid}&${this.userSeller.shopName}`]);
    }
  }

  startTimer(timeChartSecSetTime) {
    // console.log('START =>')
    // console.log('START =>', timeChartSecSetTime)
    var startTime = timeChartSecSetTime;
    this.interval = setInterval(() => {
      // if (timeChartSecSetTime === 0) {
      //   timeChartSecSetTime--;
      // } else {
      //   timeChartSecSetTime--;
      // }
      timeChartSecSetTime--;
      // console.log('COUNT =>', timeChartSecSetTime)
      if (timeChartSecSetTime <= 0) {
        this.pauseTimer();
        this.timeBid = 0;
        this.setChart(100, 0);
      }
      else {
        this.timeBid = timeChartSecSetTime;
        // var dataPer:any = Math.ceil((timeChartSecSetTime/startTime)*100);
        // console.log('% =>', dataPer)
        // this.setChart(dataPer, 100 - dataPer);
        this.setChart(this.timeBid, 100 - this.timeBid);
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  subscribeDateEnd() {
    // debugger
    // this.startTimer(this.productDes.dateTime.dateEndBid.seconds - firebase.firestore.Timestamp.now().seconds);
    // this.productDes.dateTime.dateEndBid.seconds
    var secForCount: any = this.productDes.dateTime.dateEndBid.seconds - firebase.firestore.Timestamp.now().seconds;
    this.intervalSubcribe = setInterval(() => {
      secForCount--;
      // console.log('COUNT =>', timeChartSecSetTime)
      if (secForCount <= 100) {
        // this.pauseTimer();
        // PAUSE TIMER
        this.pauseTimerSub();
        this.startTimer(this.productDes.dateTime.dateEndBid.seconds - firebase.firestore.Timestamp.now().seconds);
        // this.timeBid = 0;
        // this.setChart(100, 0);
      }
      // else {
      //   this.timeBid = timeChartSecSetTime;
      //   this.setChart(this.timeBid, 100 - this.timeBid);
      // }
    }, 1000);
  }

  pauseTimerSub() {
    clearInterval(this.intervalSubcribe);
  }

  setChart(dataIn, dataOut) {
    // console.log('SET CHART')
    // CHART
    Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
    Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
      draw: function (ease) {
        var ctx = this.chart.chart.ctx;

        var easingDecimal = ease || 1;
        Chart.helpers.each(this.getMeta().data, function (arc, index) {
          arc.transition(easingDecimal).draw();

          var vm = arc._view;
          var radius = (vm.outerRadius + vm.innerRadius) / 2;
          var thickness = (vm.outerRadius - vm.innerRadius) / 2;
          var angle = Math.PI - vm.endAngle - Math.PI / 2;

          ctx.save();
          ctx.fillStyle = vm.backgroundColor;
          ctx.translate(vm.x, vm.y);
          ctx.beginPath();
          ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
          ctx.arc(radius * Math.sin(Math.PI), radius * Math.cos(Math.PI), thickness, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      },
    });

    // SET DATA & OPTION CHART
    this.deliveredData = {
      datasets: [
        {
          // data: [85, 15],
          data: [dataIn, dataOut],
          backgroundColor: [
            "#FE5721",
            "rgba(0,0,0,0)"
          ],
          hoverBackgroundColor: [
            "#FE5721",
            "rgba(0,0,0,0)"
          ],
          borderWidth: [
            0, 0
          ]
        }]
    };
    // SET DATA & OPTION CHART
    this.deliveredOpt = {
      cutoutPercentage: 88,
      animation: {
        duration: 0
      },
      // animation: {
      //   animationRotate: true,
      //   duration: 2000
      // },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      elements: {
        center: {
          text: '10s',
          color: '#FE5721', // Default is #000000
          fontStyle: 'Kanit', // Default is Arial
          sidePadding: 30, // Default is 20 (as a percentage)
          minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25 // Default is 25 (in px), used for when text wraps
        }
      },
    };
    // CREATE CHART => timeBidChart
    var chart = new Chart('timeBidChart', {
      type: 'RoundedDoughnut',
      data: this.deliveredData,
      options: this.deliveredOpt
    });
  }

  auctionPriceUp() {
    this.auctionPrice = this.auctionPrice + this.productDes.priceData.priceBid;
    this.auctionPriceDownDisabled = false;
  }

  auctionPriceDown() {
    // console.log('auctionPrice =>', this.auctionPrice)
    // console.log('biddingPrice =>', this.biddingPrice)
    this.auctionPrice = this.auctionPrice - this.productDes.priceData.priceBid;
    if (this.auctionPrice == Number(this.biddingPrice) || this.auctionPrice == Number(this.biddingPrice) + this.productDes.priceData.priceBid) {
      this.auctionPriceDownDisabled = true;
    }
    else {
      this.auctionPriceDownDisabled = false;
    }
  }

  biddingSubmit() {
    if (this.userBuyer == undefined) {
      this.router.navigate(['/signin'])
    }
    else {
      // console.log(this.productOptionSelect.optionName)
      // console.log(this.productOptionSelect.subOption)
      // console.log(this.productOptionSelect)
      if (this.productOptionSelect.optionName != "" && this.productOptionSelect.subOption != "") {
        // IS SELECTED PRODUCT OPTION
        if (this.productDes.salesType == 'auction' && (this.productDes.productStatus == 'bidding' || this.productDes.productStatus == 'waitAuction')) {
          // IS PRODUCT TYPE AUCTION
          //   console.log(this.auctionPrice)
          const query = this.firestore.collection('product').doc(this.id).collection('auction-history', ref => ref
            .orderBy('createAt', 'desc')
            .limit(1))
          return query.get().toPromise().then((auctionHistory) => {
            var auctionHistoryLast: any = auctionHistory.docs;
            // CHECK BUYER HIDE DISPLAYNAME 
            var userBuyerDisplayName: any = '';
            // HIDE
            if (this.userBuyer.hideDisplayName) {
              var name = '';
              for (var i = 0; i < 4; i++) {
                name = name + this.userBuyer.displayName[i];
              }
              userBuyerDisplayName = name + '****';
            }
            // NOT HIDE
            else {
              userBuyerDisplayName = this.userBuyer.displayName;
            }
            if (auctionHistoryLast.length == 0) {
              // NO ONE AUCTION-HISTORY
              this.firestore.collection('product').doc(this.id).collection('auction-history').add({
                createAt: firebase.firestore.Timestamp.now(),
                biddingPrice: this.auctionPrice,
                buyerName: userBuyerDisplayName,
                buyerUID: this.auth.currentUserId,
                productOption: this.productOptionSelect //IF SUB OPTION ARRAY == NULL => THIS VALUE == null
              })
              // .then((doc) => {
              //   return 'ADD NEW BID'
              // })    
            }
            else {
              // HAVE BUYER IN AUCTION-HISTORY 
              return firebase.firestore().runTransaction(transaction => {
                return transaction.get(auctionHistoryLast[0].ref).then(actionLast => {
                  // important, check the original condition again here
                  // console.log(actionLast.data())
                  // SET DATA
                  var auctionHistoryLast: any = actionLast.data();
                  // CHECK AUCTION PRICE > BIDDING PRICE HISTORY LAST
                  if (this.auctionPrice > auctionHistoryLast.biddingPrice) {
                    // ADD BIDDING OF THIS BUYER
                    this.firestore.collection('product').doc(this.id).collection('auction-history').add({
                      createAt: firebase.firestore.Timestamp.now(),
                      biddingPrice: this.auctionPrice,
                      buyerName: userBuyerDisplayName,
                      buyerUID: this.auth.currentUserId,
                      productOption: this.productOptionSelect //IF SUB OPTION ARRAY == NULL => THIS VALUE == null
                    })
                    // .then((doc) => {
                    //   return 'ADD NEW UP BID'
                    // })    
                  }
                  else {
                    // FALSE NOT ADD NEW UP BID
                    this.biddingFail = true;
                  }
                })
              })
            }
          })
        }
        else if (this.productDes.salesType == 'setSellingPrice' && this.productDes.productStatus == 'forSale') {
          // IS PRODUCT TYPE FOR SALE => CREATE PRE-ORDER
          this.firestore.collection('order').add({
            createAt: firebase.firestore.Timestamp.now(),
            buyerUID: this.auth.currentUserId,
            delivery: null,
            device: 'website',
            donate: this.productDes.donate,
            imgProduct: this.productDes.imgProduct,
            priceOfProduct: Number(this.productDes.priceData.priceProduct),
            productCreateAt: this.productDes.createAt,
            productDescription: this.productDes.productDescription,
            productKey: this.id,
            productName: this.productDes.name,
            productOption: this.productOptionSelect, //IF SUB OPTION ARRAY == NULL => THIS VALUE == null
            salesType: this.productDes.salesType,
            sellerUID: this.productDes.sellerUID,
            shopName: this.userSeller.shopName,
            status: 'cart',
            tag: this.productDes.tag,
            orderNo: 'ABMTH' + (firebase.firestore.Timestamp.now().seconds).toString()
          })
            .then((doc) => {
              // SHOW MODAL SUCCESS
              this.productOpText = 'เพิ่มสินค้าลงรถเขียนเรียบร้อย โปรดตรวจสอบรถเข็น';
              this.selectProductOptionFail = true;
            })
        }
      }
      else {
        // SHOW MODAL PLASE SELEC PRODUCT OPTION
        this.productOpText = 'โปรดเลือกตัวเลือกสินค้า';
        this.selectProductOptionFail = true;
      }
    }
  }

  closeModalPopupBiddingFail() {
    this.biddingFail = false;
  }

  okModalPopupSelectProductOptionFail() {
    if (this.productOpText == 'โปรดเลือกตัวเลือกสินค้า') {
      if (this.addToCartCheck) {
        this.addToCartCheck = false;
        this.addToCart();
      }
      else {
        this.biddingSubmit();
      }
    }
    this.selectProductOptionFail = false;
    this.productOpText = '';
  }

  closeModalPopupSelectProductOptionFail() {
    this.selectProductOptionFail = false;
    this.productOpText = '';
  }

  // showModalPopupBidded(){
  //   this.showModalBidded = true;
  // }

  closeModalPopupBidded() {
    this.showModalBidded = false;
  }

  goToPaymentItems() {
    this.router.navigate(['/payment-items']);
  }

  setPriceAutoBid(priceAutoBidInput) {
    // console.log(priceAutoBidInput)
    if (priceAutoBidInput <= this.auctionPrice) {
      this.setPriceAutoBidText = 'โปรดกำหนดราคาสูงกว่าราคาปัจจุบัน';
    }
    else if (priceAutoBidInput != '' && priceAutoBidInput > 0 && priceAutoBidInput > this.auctionPrice) {
      this.autoBidShow = 'สูงสุด ฿' + priceAutoBidInput;
      this.autoBidPrice = Number(priceAutoBidInput);
      this.setPriceAutoBidText = 'กำหนดราคาสำเร็จ'
      // console.log(this.autoBidShow)
      // console.log(this.autoBidPrice)
    }
  }

  gotoShopDes() {
    this.router.navigate([`/shop-description/${this.productDes.sellerUID}`]);
  }

  reportProduct() {
    if (this.userBuyer == undefined) {
      this.router.navigate(['/signin'])
    }
    else {
      var timeStamp: any = firebase.firestore.Timestamp.now()
      this.firestore.collection('report-product').doc(this.id).get().toPromise()
        .then((doc) => {
          // console.log(doc.data())
          if (doc.data() != undefined) {
            this.firestore.collection('report-product').doc(this.id).update({
              updateAt: timeStamp
            })
              .then((doc) => {
                this.firestore.collection('report-product').doc(this.id).collection('report-list').doc(this.auth.currentUserId).set({
                  userReport: this.auth.currentUserId,
                  displayName: this.userBuyer.displayName,
                  profileImg: {
                    imgUrl: this.userBuyer.profileImg.imgUrl,
                    imgpath: this.userBuyer.profileImg.imgpath
                  },
                  createAt: timeStamp
                })
              })
          }
          else {
            this.firestore.collection('report-product').doc(this.id).set({
              productKey: this.id,
              imgProduct1: {
                imgUrl: this.productDes.imgProduct[0].imgUrl,
                imgpath: this.productDes.imgProduct[0].imgpath
              },
              shopName: this.userSeller.shopName,
              sellerUID: this.productDes.sellerUID,
              updateAt: timeStamp,
              readed: false
            })
              .then((doc) => {
                this.firestore.collection('report-product').doc(this.id).collection('report-list').doc(this.auth.currentUserId).set({
                  userReport: this.auth.currentUserId,
                  displayName: this.userBuyer.displayName,
                  profileImg: {
                    imgUrl: this.userBuyer.profileImg.imgUrl,
                    imgpath: this.userBuyer.profileImg.imgpath
                  },
                  createAt: timeStamp
                })
              })
          }
        })
    }
  }

  gotoProductDes(dataKey) {
    // console.log(dataKey)
    this.router.navigate([`/product-description/${dataKey}`]);
    // window.scroll(0,0);
    this.ngOnInit();
  }

  copyLink() {
    var textField = document.createElement('textarea');
    textField.style.position = 'fixed';
    textField.style.left = '0';
    textField.style.top = '0';
    textField.style.opacity = '0';
    textField.innerText = 'https://abidmore.com/product-description/' + this.id;
    document.body.appendChild(textField);
    textField.select();
    textField.focus();
    document.execCommand('copy');
    textField.remove();
  }

  // clickTestModal() {
  //   this.testModal = true
  // }

  gotoHome() {
    this.router.navigate(['/'])
  }

}
