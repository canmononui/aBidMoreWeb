import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})
export class ProductReviewComponent implements OnInit {

  public id;
  public shopDes: any;
  public productDes: any;
  public sellerUID: any;
  public productKey: any;
  public showContent = false;
  public reviewList: any = [];
  // public userBuyerDes: any;
  authState: any = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    // console.log(this.id)
    var keyArr = this.id.split("_", 2);
    // console.log(keyArr)
    this.sellerUID = keyArr[0]
    this.productKey = keyArr[1]
    // console.log(this.sellerUID, this.productKey)
    if (this.id) {
      this.afAuth.authState.subscribe((auth) => {
        if (auth) {
          this.authState = auth;
          this.getProductDes();
        }
        else {
          this.getProductDes();
        }
      })
    }
  }

  getProductDes() {
    this.firestore.collection('shop').doc(this.sellerUID).get().toPromise()
      .then((shopDes) => {
        // SHOP DATA
        this.shopDes = shopDes.data();
        // if (this.shopDes.profileImg.imgUrl == null) {
        //   this.shopDes.profileImg = './assets/img/profile-icon-BG.svg';
        // }
        // PRODUCT DATA
        this.firestore.collection('shop').doc(this.sellerUID).collection('product').doc(this.productKey).get().toPromise()
          .then((productDes) => {
            // console.log(productDes.data())
            this.productDes = productDes.data()
            this.firestore.collection('shop').doc(this.sellerUID).collection('product').doc(this.productKey).collection('product-review').get().toPromise()
              .then((productDes) => {
                // console.log(productDes)
                productDes.forEach((doc) => {
                  // console.log(doc.id, " => ", doc.data());
                  this.getUserbuyer(doc.id, doc.data());
                  // this.reviewList.push({
                  //   key: doc.id,
                  //   value: doc.data()
                  // })
                  this.showContent = true;
                });
              })
          })
      })
  }

  getUserbuyer(key, value){
    this.firestore.collection('user-buyer').doc(value.buyerUID).get().toPromise()
      .then((userBuyerDes) => {
        // console.log(userBuyerDes.data())
        var _userBuyerDes:any = userBuyerDes.data()
        // console.log(_userBuyerDes.profileImg.imgUrl)

        if (_userBuyerDes.profileImg.imgUrl == null) {
          _userBuyerDes.profileImg.imgUrl = './assets/img/profile-icon-BG.svg';
        }
        if(_userBuyerDes.hideDisplayName){
          _userBuyerDes.displayName = _userBuyerDes.displayName[0] + _userBuyerDes.displayName[1] + _userBuyerDes.displayName[2] + _userBuyerDes.displayName[3] + '****'
        }
        // console.log(_userBuyerDes.profileImg.imgUrl)
        this.reviewList.push({
          key: key,
          valueUserBuyerDes: _userBuyerDes,
          valueReviewDes: value
        })
      })

  }


}
