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
  selector: 'app-buy-menu-list',
  templateUrl: './buy-menu-list.component.html',
  styleUrls: ['./buy-menu-list.component.css']
})
export class BuyMenuListComponent implements OnInit {

  public id
  public orderWaitingPaymentList = '0';
  public orderWaitingPaymentConfirmList = '0';
  public waitingForDelivery = '0';
  public orderShippedList = '0';
  public orderShippingList = '0';
  public orderSaleSuccessList = '0';
  // public orderCancelOrderBySellerList = '0';
  // public orderCancelOrderByBuyerList = '0';
  public orderCancelList = '0';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      // GET WAITING PAYMENT LIST
      this.firestore.collection('order', ref => ref
      .where('status', '==', 'cart' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(orderWaitingPayment => {
          // console.log(orderWaitingPayment.length)
          if(orderWaitingPayment.length > 99){
            this.orderWaitingPaymentList = '99+';
          }
          else{
            this.orderWaitingPaymentList = String(orderWaitingPayment.length);
          }
        })

      // GET WAITING PAYMENT CONFIRMATION LIST
      this.firestore.collection('order', ref => ref
      .where('status', 'in', ['pending-payment', 'payment-fraud'] )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(orderWaitingPaymentConfirm => {
          // console.log(orderWaitingPaymentConfirm.length)
          if(orderWaitingPaymentConfirm.length > 99){
            this.orderWaitingPaymentConfirmList = '99+';
          }
          else{
            this.orderWaitingPaymentConfirmList = String(orderWaitingPaymentConfirm.length);
          }
        })

      // GET ORDER SHIPPED
      this.firestore.collection('order', ref => ref
      .where('status', '==', 'waiting-for-delivery' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(orderwaitShip => {
          // console.log(orderShipped.length)
          if(orderwaitShip.length > 99){
            this.waitingForDelivery = '99+';
          }
          else{
            this.waitingForDelivery = String(orderwaitShip.length);
          }
        })

      // GET ORDER SHIPPING
      this.firestore.collection('order', ref => ref
      .where('status', '==', 'shipping' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(orderShipping => {
          // console.log(orderShipping.length)
          if(orderShipping.length > 99){
            this.orderShippingList = '99+';
          }
          else{
            this.orderShippingList = String(orderShipping.length);
          }
        })

      // GET ORDER SHIPPED
      this.firestore.collection('order', ref => ref
      .where('status', '==', 'shipped' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(orderShipped => {
          // console.log(orderShipping.length)
          if(orderShipped.length > 99){
            this.orderShippedList = '99+';
          }
          else{
            this.orderShippedList = String(orderShipped.length);
          }
        })

      // GET ORDER SALE SUCCESS 
      this.firestore.collection('order', ref => ref
      .where('status', '==', 'sale-success' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(orderSaleSuccess => {
          // console.log(orderSaleSuccess.length)
          if(orderSaleSuccess.length > 99){
            this.orderSaleSuccessList = '99+';
          }
          else{
            this.orderSaleSuccessList = String(orderSaleSuccess.length);
          }
        })

      // GET ORDER CANCEL BY SELLER & BUYER
      this.firestore.collection('order', ref => ref
      .where('status', 'in', ['return', 'cancelBySeller', 'cancelByBuyer'] )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(cancelBySeller => {
          // console.log(cancelBySeller.length)
          if(cancelBySeller.length > 99){
            this.orderCancelList = '99+';
          }
          else{
            this.orderCancelList = String(cancelBySeller.length);
          }
        })
    }
    else {
      // IS CAN'T GET ID (UID BUYER)
      this.router.navigate(['/'])
    }
  }

  setCountCancelOrder(){
    // this.orderCancel
  }

  goto(link){
    this.router.navigate([`/${link}`])
  }


}
