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
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent implements OnInit {

  public id
  public item:any = null;
  public rateStar = 0;
  public comment = '';
  public errorText = '';
  public showModal = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if(this.id){
      this.firestore.collection('order').doc(this.id).get().toPromise()
      .then((item) => {
        // console.log(item)
        var _item:any = item.data();
        if(_item != undefined){
          this.item = _item;
          if(this.item.status != 'sale-success'){
            this.router.navigate([`/order-waiting-confirm-list`])
          }
        }
        else{
          this.router.navigate([`/order-waiting-confirm-list`])
        }
      })
    }
    else{
      // IS CAN'T GET ID
      this.router.navigate([`/order-waiting-confirm-list`])
    }
  }

  selectStar(star){
    if(this.rateStar == star){
      this.rateStar = 0;
    }
    else{
      this.rateStar = star;
    }
  }

  commentInput($event){
    this.comment = $event.target.value
  }

  selectComment(comment){
    if(this.comment != ""){
      this.comment = this.comment + " " + comment;
    }
    else{
      this.comment = this.comment + comment;
    }
  }

  selectConfirm(){
    if(this.comment != ''){
      if(this.rateStar == 0){
        // SHOW MODAL NO RATE STAR ?
        this.errorText = 'ต้องการยืนยันรีวิวสินค้าโดยความพึงพอใจดาวที่ 0 ดาว​ ?'
        this.showModal = true;
      }
      else {
        this.errorText = 'ต้องการยืนยันรีวิวสินค้า ?'
        this.showModal = true;
      }
    }
    else {
      this.showModal = false;
    }
  }

  confirm(){
    this.showModal = false;
    var timestamp = firebase.firestore.Timestamp.now();
    // GET PRODUCT KEY IN COL PRODUCT
    this.firestore.collection('product').doc(this.item.productKey).get().toPromise()
    .then((doc) => {
      var _doc:any = doc.data();
      // ADD PRODUCT REVIEW IN COL SHOP
      this.firestore.collection('shop').doc(this.item.sellerUID).collection('product').doc(_doc.productKey).collection('product-review').add({
        createAt: timestamp,
        buyerUID: this.item.buyerUID,
        ratingStars: this.rateStar,
        comment: this.comment
      })
      .then((docReview) => {
        // ADD NOTI BUYER FOR REVIEW
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
          createAt: timestamp,
          topic: `รีวิวสินค้าสำหรับคำสั่งซื้อ #${this.item.orderNo}`,
          description: `รีวิวสินค้าสำหรับคำสั่งซื้อ #${this.item.orderNo}`,
          product: {
            productKey: this.item.productKey,
            productName: this.item.productName,
            imgProduct1: {
              imgUrl: this.item.imgProduct[0].imgUrl,
              imgpath: this.item.imgProduct[0].imgpath
            },
            orderNo: this.item.orderNo
          },
          reviewKey: docReview.id,
          productKeyShop: _doc.productKey,
          sellerUID: this.item.sellerUID,
          type: 'review',
          readed: false
        })
        // ADD NOTI SELLER FOR REVIEW
        this.firestore.collection('shop').doc(this.item.sellerUID).collection('notifications').add({
          createAt: timestamp,
          topic: `รีวิวสินค้าสำหรับคำสั่งซื้อ #${this.item.orderNo}`,
          description: `รีวิวสินค้าสำหรับคำสั่งซื้อ #${this.item.orderNo}`,
          product: {
            productKey: this.item.productKey,
            productName: this.item.productName,
            imgProduct1: {
              imgUrl: this.item.imgProduct[0].imgUrl,
              imgpath: this.item.imgProduct[0].imgpath
            },
            orderNo: this.item.orderNo
          },
          reviewKey: docReview.id,
          productKeyShop: _doc.productKey,
          sellerUID: this.item.sellerUID,
          type: 'review',
          readed: false
        })
        // GET PRODUCT REVIEW IN COL SHOP
        this.firestore.collection('shop').doc(this.item.sellerUID).collection('product').doc(_doc.productKey).collection('product-review').get().toPromise()
        .then((reviewList) => {
          if(reviewList.size != 0){
            // HAVE REVIEW
            var _averageRateStar:any = 0
            reviewList.forEach((doc) => {
              var _doc:any = doc.data()
              _averageRateStar = _averageRateStar + _doc.ratingStars;
            })
            // AVERAGE REATE STAR
            _averageRateStar = _averageRateStar/reviewList.size;
            // UPDATE RATING STARS == AVERAGE IN COL SHOP
            this.firestore.collection('shop').doc(this.item.sellerUID).collection('product').doc(_doc.productKey).update({
              ratingStars: _averageRateStar
            })
            .then(() => {
              this.router.navigate([`/order-waiting-confirm-list`]); 
            })
          }
          else {
            // NO PRODUCT REVIEW => RATING STARS == 0
            this.router.navigate([`/order-waiting-confirm-list`]); 
          }
        })
      })
    })
  }

}
