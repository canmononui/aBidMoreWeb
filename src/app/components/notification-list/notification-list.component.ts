import { Component, OnInit } from '@angular/core';
// FIREBASE
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  public id;
  public notiList:any = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if (this.id) {
      // GET NOTI LIST
      this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications', ref => ref
      .orderBy('createAt', 'desc')
      ).snapshotChanges()
      .map(actions => {
        return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
      }).subscribe(noti => {
        this.notiList = noti;
      })
    }
    else {
      this.router.navigate(['/'])
    }
  }

  gotoNotiDes(notiKey, value){
    // console.log(notiKey)
    // console.log(value)
    if(value.type == 'order'){
      this.firestore.collection('order', ref => ref
      .where('orderNo', '==', value.product.orderNo))
      .get().toPromise()
      .then((doc) => {
        console.log(doc)
        if(doc.size != 0){
          // console.log(doc.docs[0].id)
          // console.log(doc.docs[0].data())
          var _orderKey:any = doc.docs[0].id;
          var _orderData:any = doc.docs[0].data();
          if(_orderData.status == 'cart'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/payment-items/${this.auth.currentUserId}`])
            })
          }
          else if(_orderData.status == 'pending-payment' || _orderData.status == 'payment-fraud'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/payment-confirm-description/${_orderKey}`])
            })
          }
          else if(_orderData.status == 'waiting-for-delivery'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/transport-prepare-list/${this.auth.currentUserId}`])
            })
          }
          else if(_orderData.status == 'shipping'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/transport-description/${_orderKey}`])
            })
          }
          else if(_orderData.status == 'shipped'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/order-waiting-confirm-description/${_orderKey}`])
            })
          }
          else if(_orderData.status == 'sale-success'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/transport-success-description/${_orderKey}`])
            })
          }
          else if(_orderData.status == 'cancelBySeller' || _orderData.status == 'cancelByBuyer' || _orderData.status == 'return'){
            // UPDATE READED => TRUE
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
              readed: true
            })
            .then((doc) => {
              // GO TO DES
              this.router.navigate([`/order-cancel-description/${_orderKey}`])
            })
          }
        }
      })
    }
    else if(value.type == 'review'){
      // UPDATE READED => TRUE
      this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').doc(notiKey).update({
        readed: true
      })
      .then((doc) => {
        // GO TO DES
        this.router.navigate([`/shop-description/${value.sellerUID}`])
      })
    }
  }
}
