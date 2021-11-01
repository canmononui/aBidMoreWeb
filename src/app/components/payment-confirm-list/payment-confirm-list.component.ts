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
  selector: 'app-payment-confirm-list',
  templateUrl: './payment-confirm-list.component.html',
  styleUrls: ['./payment-confirm-list.component.css']
})
export class PaymentConfirmListComponent implements OnInit {

  public id
  public waitingPaymentConfirmList:any = [];
  
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
      this.firestore.collection('order', ref => ref
      .where('status', 'in', ['pending-payment', 'payment-fraud'] )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(items => {
          // console.log(items.length)
          if(items.length != 0){
            this.waitingPaymentConfirmList = [];
            items.forEach((doc) => {
              this.getTransaction(doc.key, doc.value)
            })
          }
          else {
            this.waitingPaymentConfirmList = [];
          }
        })
    }
    else{
      // IS CAN'T GET ID (UID BUYER)
      this.router.navigate([`/buyMenu-list`])
    }
  }

  getTransaction(orderKey, orderValue){
    // console.log(orderKey, orderValue)
    this.firestore.collection('transaction').doc(orderValue.transactionKey).get().toPromise()
    .then((transaction) => {
      // console.log(transaction)
      if(transaction.data() != undefined){
        this.waitingPaymentConfirmList.push({
          key: orderKey,
          value: {
            order: orderValue,
            transaction: transaction.data()
          }
        })
      }
    })
  }

  gotoItem(itemKey){
    this.router.navigate([`/payment-confirm-description/${itemKey}`])
  }

  gotoBuyMenuList(){
    this.router.navigate([`/buyMenu-list`])
  }

}
