import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { KeySearchService } from '../../services/key-search.service';
// TIMER 
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public id;
  public textKeySearch = '';
  public textSetPriceRange = 'เลือกช่วงราคา';
  public priceLowFail = false;
  public priceHighFail = false;
  public priceLowInput: any = '';
  public priceHighInput: any = '';
  public setPriceRangeFail = false;
  public textSort = 'เวลาเริ่มประมูลน้อยไปมาก';
  public selectSortType = 'เวลาเริ่มประมูลน้อยไปมาก';
  public textProductType = 'สินค้าประมูล';
  public selecProType = 'สินค้าประมูล';
  public productTypeArr = ['bidding', 'waitAuction'];
  public fieldNamePrice = 'priceData.priceAutoWin';
  public productList = [];
  public showContent = false;
  public productLike: any = [];
  public pageNumber: number = 1;
  public noContentShowPage = false;
  public previousProductList: any = [];
  public selectNextStatus = false;
  public previousArrayEnd: number = 20;
  public fieldName = '';
  // TIMER BIDDING
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
    public keySearchSer: KeySearchService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    // console.log(this.id)
    if (this.id) {
      // console.log(this.auth.currentUserId)
      if (this.auth.currentUserId != '') {
        // GET USER BUYER LIKE
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like', ref => ref
        ).snapshotChanges()
          .map(actions => {
            return actions.map(action => (action.payload.doc.id));
          }).subscribe(productLike => {
            if (productLike.length != 0) {
              this.productLike = productLike;
              // this.pageNumber = 0;
              // this.getProductByKey();
              for (var i = 0; i < this.productList.length; i++) {
                if (this.productLike.indexOf(this.productList[i].key) !== -1) {
                  // SET THIS PRODUCT IS LIKE
                  this.productList[i].value.likeStatus = true;
                }
                else {
                  // SET THIS PRODUCT IS NOT LIKE
                  this.productList[i].value.likeStatus = false;
                }
              }
            }
            else {
              this.productLike = [];
              // this.pageNumber = 0;
              // this.getProductByKey();
            }
          })
        this.getProductByKey();
      }
      else {
        this.productLike = [];
        // this.pageNumber = 0;
        this.getProductByKey();
      }
    }
    else {
      this.router.navigate(['/'])
    }
    // CHECK WHEN KEY SEARCH CHANGE IN SEARCH PAGDE
    this.keySearchSer.keySearchChange.subscribe((val) => {
      // console.log('-> ', val)
      this.id = val;
      this.pageNumber = 0;
      this.getProductByKey()
    })
  }

  getProductByKey() {
    // console.log(this.id)
    if (this.priceLowInput == '') {
      this.priceLowInput = 0;
    }
    if (this.priceHighInput == '') {
      this.priceHighInput = 999999999;
    }
    // console.log(this.priceLowInput);
    // console.log(this.priceHighInput);
    // SPLIT ID(URL) => KEYSEARCH
    var _keySearch = this.id.split("&");
    // console.log(_keySearch)
    this.id = _keySearch[0]
    // SET TEXT SEARCH SHOW
    if (this.id == 'productBidding') {
      // SET TEXT SEARCH SHOW
      this.textKeySearch = 'สินค้ากำลังประมูล';
      // console.log('salesType == auction')
      // console.log('productStatus == bidding')
      this.productList = [];
      // GET DATA
      this.getProductListByProductStatus('auction', 'bidding');
    }
    else if (this.id == 'productWaitAction') {
      // SET TEXT SEARCH SHOW
      this.textKeySearch = 'สินค้าเริ่มประมูลเร็ว ๆ นี้';
      // console.log('salesType == auction')
      // console.log('productStatus == waitAuction')
      this.productList = [];
      // GET DATA
      this.getProductListByProductStatus('auction', 'waitAuction');
    }
    else if (this.id == 'setSellingPrice') {
      // SET TEXT SEARCH SHOW
      this.textKeySearch = 'สินค้าทั่วไป';
      // console.log('salesType == setSellingPrice')
      // console.log('productStatus == forSale')
      this.productList = [];
      // GET DATA
      this.getProductListByProductStatus('setSellingPrice', 'forSale');
    }
    else {
      if (this.id == 'maleClothes') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เสื้อผ้าชาย';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เสื้อผ้าชาย/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เสื้อผ้าชาย';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'maleShoes') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'รองเท้าชาย';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'รองเท้าชาย/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'รองเท้าชาย';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'femaleClothes') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เสื้อผ้าหญิง';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เสื้อผ้าหญิง/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เสื้อผ้าหญิง';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'femaleShoes') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'รองเท้าหญิง';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'รองเท้าหญิง/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'รองเท้าหญิง';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'beauty') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'ความงาม';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'ความงาม/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'ความงาม';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'bag') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'กระเป๋า';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'กระเป๋า/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'กระเป๋า';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'accessories') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เครื่องประดับ';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เครื่องประดับ/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เครื่องประดับ';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'homeAppliances') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เครื่องใช้ในบ้าน';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เครื่องใช้ในบ้าน/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เครื่องใช้ในบ้าน';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'mobilePhone') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'มือถือ';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'มือถือ/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'มือถือ';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'game') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เกม';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เกม/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เกม';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'camera') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'กล้อง';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'กล้อง/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'กล้อง';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'sport') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'กีฬา';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'กีฬา/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'กีฬา';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'computer') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'คอมพิวเตอร์';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'คอมพิวเตอร์/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'คอมพิวเตอร์';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'food') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'อาหาร';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'อาหาร/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'อาหาร';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'electricalApp') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เครื่องใช้ไฟฟ้า';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เครื่องใช้ไฟฟ้า/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เครื่องใช้ไฟฟ้า';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'motorVehicle') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'ยานยนต์';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'ยานยนต์/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'ยานยนต์';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'donate') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'บริจาค';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'บริจาค/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'บริจาค';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'voucher') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'voucher';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'voucher/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'voucher';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'fetish') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'เครื่องราง';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'เครื่องราง/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'เครื่องราง';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'collectibles') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'ของสะสม';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'ของสะสม/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'ของสะสม';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else if (this.id == 'other') {
        if (_keySearch.length == 1) {
          // SELECT HISTORY SEARCH  || SUB CATEGORY ALL
          this.fieldName = 'tag.tagEN';
          this.id = _keySearch[0];
          this.textKeySearch = 'อื่น ๆ';
        }
        else {
          if (_keySearch[1] != 'all') {
            this.fieldName = 'tag.subTagTH';
            this.id = _keySearch[1];
            this.textKeySearch = 'อื่น ๆ/' + _keySearch[1];
          }
          else {
            this.fieldName = 'tag.tagEN';
            this.id = _keySearch[0];
            this.textKeySearch = 'อื่น ๆ';
          }
        }
        // CEAR PRODUCT LIST
        this.productList = [];
        // GET PRODUCT LIST BY TAG
        this.getProductListByTag();
      }
      else {
        this.textKeySearch = this.id;
        // ELSE (USER INPUT SEARCH)
        // SEARCH DATA BY KEYWORD keySearch[Array]        
        this.productList = [];
        if (this.selectNextStatus) {
          var priceLast: any = 0;
          if (this.selecProType == 'สินค้าประมูล') {
            // CHECK SELECT PRODUCT TYPE == BIDDING
            for (var i = 0; i < this.previousProductList.length; i++) {
              // LOOP CHECK PRICE HIGHT
              if (this.previousProductList[i].value.priceData.priceAutoWin > priceLast) {
                priceLast = this.previousProductList[i].value.priceData.priceAutoWin;
              }
            }
            priceLast = priceLast + 1;
          }
          else {
            // CHECK SELECT PRODUCT TYPE == FORSALE
            for (var i = 0; i < this.previousProductList.length; i++) {
              // LOOP CHECK PRICE HIGHT
              if (this.previousProductList[i].value.priceData.priceProduct > priceLast) {
                priceLast = this.previousProductList[i].value.priceData.priceProduct;
              }
            }
            priceLast = priceLast + 1;
          }
          // SEARCH WHEN CLICK NEXT PAGE
          this.firestore.collection('product', ref => ref
            .where('keySearch', 'array-contains', this.id)
            .where('productStatus', 'in', this.productTypeArr)
            .where(this.fieldNamePrice, '>=', priceLast)
            .where(this.fieldNamePrice, '<=', this.priceHighInput)
            .orderBy(this.fieldNamePrice)
            .limit(20)
          ).get().toPromise()
            .then((productList) => {
              if (productList.size != 0) {
                productList.forEach((doc) => {
                  var _docID: any = doc.id;
                  var _docData: any = doc.data();
                  if (this.productLike.indexOf(_docID) !== -1) {
                    _docData.likeStatus = true;
                  }
                  else {
                    _docData.likeStatus = false;
                  }
                  // SET TIMER FOR PRODUCT STATUS BIDDING 
                  if (_docData.productStatus == 'bidding') {
                    this.setTimeBidCount(_docData);
                  }
                  // SET TIME CONT MAX FOR PRODUCT STATUS WAITAUCTION
                  if (_docData.productStatus == 'waitAuction') {
                    this.getTimeCountMax(_docData);
                  }
                  // GET LAST AUCTION HISTORY
                  if (_docData.productStatus == 'bidding' || 'waitAuction') {
                    this.getLastAuctionHis(_docID, _docData)
                  }
                  this.productList.push({
                    key: _docID,
                    value: _docData
                  })
                });
                this.setTextSort();
                this.showContent = true;
              }
              else {
                this.productList = [];
                this.showContent = true;
              }
            })
          this.pageNumber++
          this.selectNextStatus = false;
        }
        else {
          // SEARCH WHEN DEFAULT
          this.firestore.collection('product', ref => ref
            .where('keySearch', 'array-contains', this.id)
            .where('productStatus', 'in', this.productTypeArr)
            .where(this.fieldNamePrice, '>=', this.priceLowInput)
            .where(this.fieldNamePrice, '<=', this.priceHighInput)
            .orderBy(this.fieldNamePrice)
            .limit(20)
          ).get().toPromise()
            .then((productList) => {
              if (productList.size != 0) {
                productList.forEach((doc) => {
                  var _docID: any = doc.id;
                  var _docData: any = doc.data();
                  if (this.productLike.indexOf(_docID) !== -1) {
                    _docData.likeStatus = true;
                  }
                  else {
                    _docData.likeStatus = false;
                  }
                  // SET TIMER FOR PRODUCT STATUS BIDDING 
                  if (_docData.productStatus == 'bidding') {
                    this.setTimeBidCount(_docData);
                  }
                  // SET TIME CONT MAX FOR PRODUCT STATUS WAITAUCTION
                  if (_docData.productStatus == 'waitAuction') {
                    this.getTimeCountMax(_docData);
                  }
                  // GET LAST AUCTION HISTORY
                  if (_docData.productStatus == 'bidding' || 'waitAuction') {
                    this.getLastAuctionHis(_docID, _docData)
                  }
                  this.productList.push({
                    key: _docID,
                    value: _docData
                  })
                });
                this.setTextSort();
                this.showContent = true;
              }
              else {
                this.productList = [];
                this.showContent = true;
              }
            })
        }
      }

    }
  }

  getProductListByProductStatus(salesType, productStatus) {
    if (this.selectNextStatus) {
      var priceLast: any = 0;
      if (this.selecProType == 'สินค้าประมูล') {
        // CHECK SELECT PRODUCT TYPE == BIDDING
        for (var i = 0; i < this.previousProductList.length; i++) {
          // LOOP CHECK PRICE HIGHT
          if (this.previousProductList[i].value.priceData.priceAutoWin > priceLast) {
            priceLast = this.previousProductList[i].value.priceData.priceAutoWin;
          }
        }
        priceLast = priceLast + 1;
      }
      else {
        // CHECK SELECT PRODUCT TYPE == FORSALE
        for (var i = 0; i < this.previousProductList.length; i++) {
          // LOOP CHECK PRICE HIGHT
          if (this.previousProductList[i].value.priceData.priceProduct > priceLast) {
            priceLast = this.previousProductList[i].value.priceData.priceProduct;
          }
        }
        priceLast = priceLast + 1;
      }
      // SEARCH WHEN CLICK NEXT PAGE
      this.firestore.collection('product', ref => ref
        .where('salesType', '==', salesType)
        .where('productStatus', '==', productStatus)
        .where(this.fieldNamePrice, '>=', priceLast)
        .where(this.fieldNamePrice, '<=', this.priceHighInput)
        .orderBy(this.fieldNamePrice)
        .limit(20)
      ).get().toPromise()
        .then((productList) => {
          if (productList.size != 0) {
            productList.forEach((doc) => {
              var _docID: any = doc.id;
              var _docData: any = doc.data();
              // SET TIMER FOR PRODUCT STATUS BIDDING 
              if (_docData.productStatus == 'bidding') {
                this.setTimeBidCount(_docData);
              }
              // SET TIME CONT MAX FOR PRODUCT STATUS WAITAUCTION
              if (_docData.productStatus == 'waitAuction') {
                this.getTimeCountMax(_docData);
              }
              // GET LAST AUCTION HISTORY
              if (productStatus == 'bidding' || 'waitAuction') {
                this.getLastAuctionHis(_docID, _docData)
              }
              // SET HEART LIKE 
              if (this.productLike.indexOf(_docID) !== -1) {
                _docData.likeStatus = true;
              }
              else {
                _docData.likeStatus = false;
              }
              this.productList.push({
                key: _docID,
                value: _docData
              })
            });
            this.setTextSort();
            this.showContent = true;
          }
          else {
            this.productList = [];
            this.showContent = true;
          }
        })
      this.pageNumber++
      this.selectNextStatus = false;
    }
    else {
      // SEARCH WHEN DEFAULT
      this.firestore.collection('product', ref => ref
        .where('salesType', '==', salesType)
        .where('productStatus', '==', productStatus)
        .where(this.fieldNamePrice, '>=', this.priceLowInput)
        .where(this.fieldNamePrice, '<=', this.priceHighInput)
        .orderBy(this.fieldNamePrice)
        .limit(20)
      ).get().toPromise()
        .then((productList) => {
          if (productList.size != 0) {
            productList.forEach((doc) => {
              var _docID: any = doc.id;
              var _docData: any = doc.data();
              // SET TIMER FOR PRODUCT STATUS BIDDING 
              if (_docData.productStatus == 'bidding') {
                this.setTimeBidCount(_docData);
              }
              // SET TIME CONT MAX FOR PRODUCT STATUS WAITAUCTION
              if (_docData.productStatus == 'waitAuction') {
                this.getTimeCountMax(_docData)
              }
              // GET LAST AUCTION HISTORY
              if (productStatus == 'bidding' || 'waitAuction') {
                this.getLastAuctionHis(_docID, _docData)
              }
              // SET HEART LIKE
              if (this.productLike.indexOf(_docID) !== -1) {
                _docData.likeStatus = true;
              }
              else {
                _docData.likeStatus = false;
              }
              this.productList.push({
                key: _docID,
                value: _docData
              })
            });
            this.setTextSort();
            this.showContent = true;
          }
          else {
            this.productList = [];
            this.showContent = true;
          }
        })
    }
  }

  getProductListByTag() {
    if (this.selectNextStatus) {
      var priceLast: any = 0;
      if (this.selecProType == 'สินค้าประมูล') {
        // CHECK SELECT PRODUCT TYPE == BIDDING
        for (var i = 0; i < this.previousProductList.length; i++) {
          // LOOP CHECK PRICE HIGHT
          if (this.previousProductList[i].value.priceData.priceAutoWin > priceLast) {
            priceLast = this.previousProductList[i].value.priceData.priceAutoWin;
          }
        }
        priceLast = priceLast + 1;
      }
      else {
        // CHECK SELECT PRODUCT TYPE == FORSALE
        for (var i = 0; i < this.previousProductList.length; i++) {
          // LOOP CHECK PRICE HIGHT
          if (this.previousProductList[i].value.priceData.priceProduct > priceLast) {
            priceLast = this.previousProductList[i].value.priceData.priceProduct;
          }
        }
        priceLast = priceLast + 1;
      }
      // SEARCH WHEN CLICK NEXT PAGE
      this.firestore.collection('product', ref => ref
        .where(this.fieldName, '==', this.id)
        .where('productStatus', 'in', this.productTypeArr)
        .where(this.fieldNamePrice, '>=', priceLast)
        .where(this.fieldNamePrice, '<=', this.priceHighInput)
        .orderBy(this.fieldNamePrice)
        .limit(20)
      ).get().toPromise()
        .then((productList) => {
          if (productList.size != 0) {
            productList.forEach((doc) => {
              var _docID: any = doc.id;
              var _docData: any = doc.data();
              if (this.productLike.indexOf(_docID) !== -1) {
                _docData.likeStatus = true;
              }
              else {
                _docData.likeStatus = false;
              }
              // SET TIMER FOR PRODUCT STATUS BIDDING 
              if (_docData.productStatus == 'bidding') {
                this.setTimeBidCount(_docData);
              }
              // SET TIME CONT MAX FOR PRODUCT STATUS WAITAUCTION
              if (_docData.productStatus == 'waitAuction') {
                this.getTimeCountMax(_docData);
              }
              // GET LAST AUCTION HISTORY
              if (_docData.productStatus == 'bidding' || 'waitAuction') {
                this.getLastAuctionHis(_docID, _docData)
              }
              this.productList.push({
                key: _docID,
                value: _docData
              })
            });
            this.setTextSort();
            this.showContent = true;
          }
          else {
            this.productList = [];
            this.showContent = true;
          }
        })
      this.pageNumber++
      this.selectNextStatus = false;
    }
    else {
      // SEARCH WHEN DEFAULT
      this.firestore.collection('product', ref => ref
        .where(this.fieldName, '==', this.id)
        .where('productStatus', 'in', this.productTypeArr)
        .where(this.fieldNamePrice, '>=', this.priceLowInput)
        .where(this.fieldNamePrice, '<=', this.priceHighInput)
        .orderBy(this.fieldNamePrice)
        .limit(20)
      ).get().toPromise()
        .then((productList) => {
          if (productList.size != 0) {
            productList.forEach((doc) => {
              var _docID: any = doc.id;
              var _docData: any = doc.data();
              if (this.productLike.indexOf(_docID) !== -1) {
                _docData.likeStatus = true;
              }
              else {
                _docData.likeStatus = false;
              }
              // SET TIMER FOR PRODUCT STATUS BIDDING 
              if (_docData.productStatus == 'bidding') {
                this.setTimeBidCount(_docData);
              }
              // SET TIME CONT MAX FOR PRODUCT STATUS WAITAUCTION
              if (_docData.productStatus == 'waitAuction') {
                this.getTimeCountMax(_docData);
              }
              // GET LAST AUCTION HISTORY
              if (_docData.productStatus == 'bidding' || 'waitAuction') {
                this.getLastAuctionHis(_docID, _docData)
              }
              this.productList.push({
                key: _docID,
                value: _docData
              })
            });
            this.setTextSort();
            this.showContent = true;
          }
          else {
            this.productList = [];
            this.showContent = true;
          }
        })
    }
  }

  // GET LAST AUCTION HISTORY
  getLastAuctionHis(productKey, productDes) {
    // console.log(productKey, productDes)
    this.firestore.collection('product').doc(productKey).collection('auction-history', ref => ref
      .orderBy('createAt', 'desc')
      .limit(1)
    ).snapshotChanges()
      .map(actions => {
        return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
      }).subscribe(lastAuction => {
        // console.log(productBidding.key, lastAuction)
        if (lastAuction.length != 0) {
          productDes.priceData.lastPriceBidding = lastAuction[0].value.biddingPrice;
        }
        else {
          productDes.priceData.lastPriceBidding = productDes.priceData.priceStart
        }
      })
  }

  setTimeBidCount(productDes) {
    var secondsToDday: any;
    var minutesToDday: any;
    var hoursToDday: any;
    var timeDifference: any = productDes.dateTime.dateEndBid.toDate().getTime() - firebase.firestore.Timestamp.now().toDate().getTime()
    if (timeDifference > 0) {
      if (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10) {
        secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      else {
        secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      }
      if (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) < 10) {
        minutesToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      else {
        minutesToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).toString();
      }
      if (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) < 10) {
        hoursToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      else {
        hoursToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay)).toString();
      }
      productDes.dateTime.count = {
        secondsToDday: secondsToDday,
        minutesToDday: minutesToDday,
        hoursToDday: hoursToDday
      }
    }
    else {
      // TIME < 0 TIME UP
      productDes.dateTime.count = {
        secondsToDday: '00',
        minutesToDday: '00',
        hoursToDday: '00'
      }
    }
  }

  getTimeCountMax(productDes) {
    if (productDes.dateTime.timeBidCount.hour != 0) {
      // if (productDes.dateTime.timeBidCount.hour < 10) {
      //   productDes.dateTime.timeCountMax = {
      //     typeTH: 'ชั่วโมง',
      //     typeEN: 'HOUR',
      //     value: '0' + (productDes.dateTime.timeBidCount.hour).toString()
      //   }
      // }
      // else {
      //   productDes.dateTime.timeCountMax = {
      //     typeTH: 'ชั่วโมง',
      //     typeEN: 'HOUR',
      //     value: (productDes.dateTime.timeBidCount.hour).toString()
      //   }
      // }
      productDes.dateTime.timeCountMax = {
        typeTH: 'ชั่วโมง',
        typeEN: 'HOUR',
        value: (productDes.dateTime.timeBidCount.hour).toString()
      }
    }
    else if (productDes.dateTime.timeBidCount.minute != 0) {
      // if (productDes.dateTime.timeBidCount.minute < 10) {
      //   productDes.dateTime.timeCountMax = {
      //     typeTH: 'นาที',
      //     typeEN: 'MINUTE',
      //     value: '0' + (productDes.dateTime.timeBidCount.minute).toString()
      //   }
      // }
      // else {
      //   productDes.dateTime.timeCountMax = {
      //     typeTH: 'นาที',
      //     typeEN: 'MINUTE',
      //     value: (productDes.dateTime.timeBidCount.minute).toString()
      //   }
      // }
      productDes.dateTime.timeCountMax = {
        typeTH: 'นาที',
        typeEN: 'MINUTE',
        value: (productDes.dateTime.timeBidCount.minute).toString()
      }
    }
    else {
      // if (productDes.dateTime.timeBidCount.second < 10) {
      //   productDes.dateTime.timeCountMax = {
      //     typeTH: 'วินาที',
      //     typeEN: 'SECOND',
      //     value: '0' + (productDes.dateTime.timeBidCount.second).toString()
      //   }
      // }
      // else {
      //   productDes.dateTime.timeCountMax = {
      //     typeTH: 'วินาที',
      //     typeEN: 'SECOND',
      //     value: (productDes.dateTime.timeBidCount.second).toString()
      //   }
      // }
      productDes.dateTime.timeCountMax = {
        typeTH: 'วินาที',
        typeEN: 'SECOND',
        value: (productDes.dateTime.timeBidCount.second).toString()
      }
    }
  }

  clearTextSetPriceRange() {
    this.textSetPriceRange = 'เลือกช่วงราคา';
    this.priceLowInput = '';
    this.priceHighInput = '';
  }

  keyUpPriceLowInput($event) {
    // console.log('LOW => ', $event.target.value)
    // console.log(Number(this.priceHighInput))
    if ($event.target.value != '') {
      if (Number($event.target.value) >= Number(this.priceHighInput)) {
        this.priceLowFail = true;
      }
      else {
        this.priceLowFail = false;
      }
      // SET LOW PRICE
      this.priceLowInput = Number($event.target.value);
      // CHECK CLEAR ERROR
      this.clearPriceError();
    }
    else {
      this.priceLowFail = false;
    }
  }

  keyUpPriceHighInput($event) {
    // console.log('HIGH => ', $event.target.value)
    if ($event.target.value != '') {
      if (Number($event.target.value) <= Number(this.priceLowInput)) {
        this.priceHighFail = true;
        // this.priceHighFail = false;
      }
      else {
        this.priceHighFail = false;
      }
      // SET HIGHT PRICE
      this.priceHighInput = Number($event.target.value);
      // CHECK CLEAR ERROR
      this.clearPriceError();
    }
    else {
      this.priceHighFail = false;
    }
  }

  clearPriceError() {
    if (this.priceLowInput < this.priceHighInput) {
      this.priceLowFail = false;
      this.priceHighFail = false;
    }
  }

  setPriceRange(priceLowInput, priceHighInput) {
    // CLEAR ERROR PRICE INPUT FAIL
    this.priceLowFail = false;
    this.priceHighFail = false;
    // SET LOW PRICE ONLY
    if (priceLowInput != '' && priceHighInput == '') {
      this.textSetPriceRange = 'มากกว่า ฿' + this.numberWithCommas(priceLowInput);
      this.priceLowInput = Number(priceLowInput);
      this.priceHighInput = Number(priceHighInput);
      // GET NEW PRODUCT LIST BY LOW INPUT
      this.getProductByKey();
    }
    // SET HIGH PRICE ONLY
    else if (priceLowInput == '' && priceHighInput != '') {
      this.textSetPriceRange = 'น้อยกว่า ฿' + this.numberWithCommas(priceHighInput);
      this.priceLowInput = Number(priceLowInput);
      this.priceHighInput = Number(priceHighInput);
      // GET NEW PRODUCT LIST BY HIGHT INPUT
      this.getProductByKey();
    }
    // SET LOW & HIGH PRICE ONLY & LOW < HIGH PRICE
    else if (priceLowInput != '' && priceHighInput != '' && Number(priceLowInput) < Number(priceHighInput)) {
      this.textSetPriceRange = 'กำหนดช่วง ฿' + this.numberWithCommas(priceLowInput) + ' - ฿' + this.numberWithCommas(priceHighInput);
      this.priceLowInput = Number(priceLowInput);
      this.priceHighInput = Number(priceHighInput);
      // GET NEW PRODUCT LIST BY LOW - HIGHT INPUT
      this.getProductByKey();
    }
    else {
      // LOW & HIGH INPUT FALSE NOT SET
      this.textSetPriceRange = 'เลือกช่วงราคา';
      this.priceLowInput = '';
      this.priceHighInput = '';
      this.setPriceRangeFail = true;
      // GET NEW PRODUCT LIST BY LOW - HIGHT INPUT
      this.getProductByKey();
    }
  }

  numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  hideModalSetPriceFail() {
    this.setPriceRangeFail = false;
  }

  selectSortTypeProdut(sortType) {
    // SELECT BUTTON TYPE IN POPUP FOR CLASS
    this.selectSortType = sortType;
  }

  setTextSort() {
    // SELECT BUTTON OK IN POPUP FOR SHOW
    this.textSort = this.selectSortType;
    // SORT PRODUCT LIST OLD
    if (this.textSort == 'เวลาเริ่มประมูลน้อยไปมาก') {
      return this.productList.sort((a, b) => {
        var timeStartA: any = 0;
        var timeStartB: any = 0;
        if (a.value.salesType == 'auction') {
          timeStartA = a.value.dateTime.dateTime.seconds;
        }
        else {
          timeStartA = 2000000000;
        }
        if (b.value.salesType == 'auction') {
          timeStartB = b.value.dateTime.dateTime.seconds;
        }
        else {
          timeStartB = 2000000000;
        }
        return timeStartA - timeStartB;
      });
    }
    else if (this.textSort == 'เวลาเริ่มประมูลมากไปน้อย') {
      return this.productList.sort((a, b) => {
        var timeStartA: any = 0;
        var timeStartB: any = 0;
        if (a.value.salesType == 'auction') {
          timeStartA = a.value.dateTime.dateTime.seconds;
        }
        else {
          timeStartA = 2000000000;
        }
        if (b.value.salesType == 'auction') {
          timeStartB = b.value.dateTime.dateTime.seconds;
        }
        else {
          timeStartB = 2000000000;
        }
        return timeStartB - timeStartA;
      });
    }
    else if (this.textSort == 'ราคาต่ำไปสูง') {
      return this.productList.sort((a, b) => {
        var priceA: any = 0;
        var priceB: any = 0;
        if (a.value.salesType == 'auction') {
          priceA = a.value.priceData.priceAutoWin;
        }
        else {
          priceA = a.value.priceData.priceProduct;
        }
        if (b.value.salesType == 'auction') {
          priceB = b.value.priceData.priceAutoWin;
        }
        else {
          priceB = b.value.priceData.priceProduct;
        }
        return priceA - priceB;
      });
    }
    else if (this.textSort == 'ราคาสูงไปต่ำ') {
      return this.productList.sort((a, b) => {
        var priceA: any = 0;
        var priceB: any = 0;
        if (a.value.salesType == 'auction') {
          priceA = a.value.priceData.priceAutoWin;
        }
        else {
          priceA = a.value.priceData.priceProduct;
        }
        if (b.value.salesType == 'auction') {
          priceB = b.value.priceData.priceAutoWin;
        }
        else {
          priceB = b.value.priceData.priceProduct;
        }
        return priceB - priceA;
      });
    }
  }

  setTextProductType() {
    if (this.textProductType != this.selecProType) {
      // CHECK CHANGE SELECT PRODUCT TYPE
      if (this.selecProType == 'สินค้าประมูล') {
        // CHECK SELECT PRODUCT TYPE == BIDDING
        this.productTypeArr = ['bidding', 'waitAuction'];
        this.fieldNamePrice = 'priceData.priceAutoWin';
        // SET TEXT MODAL SORT PRODUCT SEARCH LIST
        this.selectSortType = 'เวลาเริ่มประมูลน้อยไปมาก';
        // CALL FUNC SORT PRODUCT SEARCH LIST
        this.setTextSort();
      }
      else {
        // CHECK SELECT PRODUCT TYPE == FORSALE
        this.productTypeArr = ['forSale'];
        this.fieldNamePrice = 'priceData.priceProduct';
        // SET TEXT MODAL SORT PRODUCT SEARCH LIST
        this.selectSortType = 'ราคาต่ำไปสูง';
        // CALL FUNC SORT PRODUCT SEARCH LIST
        this.setTextSort();
      }
      // SET TEXT PRODUCT TYPE SHOW IN BUTTON PAGE
      this.textProductType = this.selecProType;
      // GET NEW PRODUCT LIST BY PRODUCT TYPE
      this.getProductByKey();
    }
  }

  selectProdutType(productType) {
    // SET WHEN CLICK BUTTON IN MODAL
    this.selecProType = productType;
  }

  next() {
    this.showContent = false;
    this.previousProductList = this.previousProductList.concat(this.productList);
    // console.log(this.previousProductList)
    this.selectNextStatus = true;
    this.getProductByKey();
  }

  previous() {
    // this.productDataFromFirebase = [];
    this.productList = [];
    this.pageNumber--
    for (var i = (this.previousArrayEnd * (this.pageNumber - 1)); i <= (this.previousArrayEnd * this.pageNumber - 1); i++) {
      this.productList.push(this.previousProductList[i])
    }
    // this.noContentShowPage = false;
    // this.showTextSelectData = false;
    // this.showTextNoData = false;
    // this.showContent = true;
  }

  gotoProductDes(dataKey) {
    // console.log(dataKey)
    // this.router.navigate([`/product-description/${dataKey}`]);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${dataKey}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  likeThisProduct(productKey, productDes) {
    if (this.auth.authState.isAnonymous) {
      this.router.navigate(['/signin'])
    }
    else {
      if (productDes.likeStatus) {
        // NOW LIKE > NO LIKE
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('like').doc(productKey).delete();
      }
      else {
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
