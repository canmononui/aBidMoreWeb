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
  selector: 'app-payment-confirm-description',
  templateUrl: './payment-confirm-description.component.html',
  styleUrls: ['./payment-confirm-description.component.css']
})
export class PaymentConfirmDescriptionComponent implements OnInit {

  public id
  public item:any = null;
  public transaction:any = null;
  public qrPayment = false;
  public modalTransactionShow = false;
  public modalTransacStatus = '';
  public transactionKey:any = '';
  public subscriTransaction:any = null;
  private subscriptionTimer: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  public minutesToDday:any = '10';
  public secondsToDday:any = '00';

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
          this.firestore.collection('transaction').doc(this.item.transactionKey).get().toPromise()
          .then((transaction) => {
            // console.log(transaction)
            if(transaction.data() != undefined){
              this.transaction = transaction.data();
            }
          })
        }
        else{
          this.router.navigate([`/payment-confirm-list`])
        }
      })
    }
    else{
      // IS CAN'T GET ID
      this.router.navigate([`/payment-confirm-list`])
    }
  }

  paymentAgain(){
    if(this.transaction.status == 'fail') {
      // console.log('-- fail --')
      // TRANSACTION STATUS = FAIL => CREATE NEW TRANSACTION
      // CALL FUNC CREATE NEW TRANSACTION
      this.addNewTransaction();
    }
    else{
      // TRANSACTION STATUS = REQUEST || WAITING => SHOW OLD TRANSACTION && OLD QR PAYMENT
      if(this.transaction.createAt.toDate().getTime() + 600*1000 > firebase.firestore.Timestamp.now().toDate().getTime()){
        // console.log('-- QR CODE NON EXPIRED --')
        // CHECK TIME QR CODE EXPIRED AT (TRANSACTION CREATE AT + 10 MIN) > TIMESTAMP
        // MONITOR TRANSACTION FOR RESPONSE
        this.subscriTransaction = this.firestore.collection('transaction').doc(this.item.transactionKey).valueChanges()
        .subscribe(val => {
        // this.subscriTransaction = this.firestore.collection('transaction').doc(this.item.transactionKey).get().toPromise()
        // .then((val) => {
          //console.log(val.data())
          this.transaction = val;
          //  this.transaction = val.data();
          // SHOW MODAL QR PAYMENT
          this.qrPayment = true;
          if(this.transaction.response != undefined){
            // SET REF CODE 2 SPLIT
            var refCode2:any = '';
            for(var i=3; i<this.transaction.response.ksher_order_no.length; i++){
              refCode2 += this.transaction.response.ksher_order_no[i];
            }
            this.transaction.response.ksher_order_no = refCode2;
            // HAVE RESPONSE FROM KSHER & HAVE QR FOR SHOW
            // CALL FUNC START COUNT DOWN 10 MIN FOR QR CODE EXPIRED
            var qrExpiredAt:any = this.transaction.createAt.toDate().getTime() + 600*1000;
            this.subscriptionTimer = interval(1000).subscribe(x => { 
              this.setTime10Min(qrExpiredAt - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
        })
      }
      else{
        // console.log('-- QR CODE EXPIRED => CREATE NEW QR CODE --')
        // QR CODE EXPIRED => CREATE NEW TRANSACTION
        // CALL FUNC CREATE NEW TRANSACTION
        this.addNewTransaction();
      }
    }
  }

  addNewTransaction(){
    // UNSUBSCRIPTION QR TIMER
    if(this.subscriptionTimer != undefined){
      this.subscriptionTimer.unsubscribe();
    }
    // UNSUBSCRIBE TRANSACTION
    if(this.subscriTransaction != undefined){
      this.subscriTransaction.unsubscribe(); 
    }
    // CLEAR TRANSACTION
    this.transaction = null
    // CREATE NEW TRANSACTION
    this.firestore.collection('transaction').add({
      createAt: firebase.firestore.Timestamp.now(),
      channel_list: this.item.channel_list,
      fee_type: 'THB',
      orderKey: [this.id],
      status: 'request'
    })
    .then((doc) => {
      // SET TRANSACTION KEY
      this.transactionKey = doc.id
      // SET TRANSACTION KEY IN ORDER
      this.firestore.collection('order').doc(this.id).update({
        transactionKey: doc.id
      })
      // MONITOR TRANSACTION FOR RESPONSE
      this.subscriTransaction = this.firestore.collection('transaction').doc(doc.id).valueChanges()
      .subscribe(val => {
        this.transaction = val;
        // SHOW MODAL QR PAYMENT
        this.qrPayment = true;
        if(this.transaction.status == 'request' || this.transaction.status == 'pending' || this.transaction.status == 'waiting'){
          if(this.transaction.response != undefined){
            // SET REF CODE 2 SPLIT
            var refCode2:any = '';
            for(var i=3; i<this.transaction.response.ksher_order_no.length; i++){
              refCode2 += this.transaction.response.ksher_order_no[i];
            }
            this.transaction.response.ksher_order_no = refCode2;
            // HAVE RESPONSE FROM KSHER & HAVE QR FOR SHOW
            // CALL FUNC START COUNT DOWN 10 MIN FOR QR CODE EXPIRED
            var qrExpiredAt:any = firebase.firestore.Timestamp.now().toDate().getTime() + 600*1000
            // console.log(qrExpiredAt)
            this.subscriptionTimer = interval(1000).subscribe(x => { 
              this.setTime10Min(qrExpiredAt - firebase.firestore.Timestamp.now().toDate().getTime())
            });
          }
        }
        else if(this.transaction.status == 'fail'){
          // PAY FAIL => ADD NOTIFICATION
          // ADD NOTI BUYER
          this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
            createAt: firebase.firestore.Timestamp.now(),
            topic: `คำสั่งซื้อ #${this.item.orderNo} ชำระเงินไม่สำเร็จโปรดตรวจสอบการชำระเงิน`,
            description: `คำสั่งซื้อ #${this.item.orderNo} ชำระเงินไม่สำเร็จโปรดตรวจสอบการชำระเงิน`,
            product: {
              productKey: this.item.productKey,
              productName: this.item.productName,
              imgProduct1: {
                imgUrl: this.item.imgProduct[0].imgUrl,
                imgpath: this.item.imgProduct[0].imgpath
              },
              orderNo: this.item.orderNo
            },
            type: 'order',
            readed: false
          })
          // HIDE MODAL QR PAYMENT
          this.qrPayment = false;
          // TEXT ERROR FOR MODAL
          this.modalTransacStatus = 'ไม่สำเร็จ';
          // SHOW MODAL TRANSECTION
          this.modalTransactionShow = true;
        }
        else if(this.transaction.status == 'success'){
          // PAY SUCCESS => ADD NOTIFICATION
          // ADD NOTI BUYER => WAITING-FOR-DELIVERY
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
              createAt: firebase.firestore.Timestamp.now(),
              topic: `คำสั่งซื้อ #${this.item.orderNo} ชำระเงินสำเร็จสินค้าเตรียมการจัดส่ง`,
              description: `คำสั่งซื้อ #${this.item.orderNo} ชำระเงินสำเร็จสินค้าเตรียมการจัดส่ง`,
              product: {
                productKey: this.item.productKey,
                productName: this.item.productName,
                imgProduct1: {
                  imgUrl: this.item.imgProduct[0].imgUrl,
                  imgpath: this.item.imgProduct[0].imgpath
                },
                orderNo: this.item.orderNo
              },
              type: 'order',
              readed: false
            })
            // ADD NOTI SELLER => WAITING-FOR-DELIVERY
            this.firestore.collection('shop').doc(this.item.sellerUID).collection('notifications').add({
              createAt: firebase.firestore.Timestamp.now(),
              topic: `สินค้าที่ต้องส่ง #${this.item.orderNo} โปรดจัดส่งสินค้าตามกำหนดเวลา`,
              description: `สินค้าที่ต้องส่ง #${this.item.orderNo} โปรดจัดส่งสินค้าตามกำหนดเวลา`,
              product: {
                productKey: this.item.productKey,
                productName: this.item.productName,
                imgProduct1: {
                  imgUrl: this.item.imgProduct[0].imgUrl,
                  imgpath: this.item.imgProduct[0].imgpath
                },
                orderNo: this.item.orderNo
              },
              type: 'order',
              readed: false
            })
          // HIDE MODAL QR PAYMENT
          this.qrPayment = false;
          // TEXT ERROR FOR MODAL
          this.modalTransacStatus = 'สำเร็จ';
          // SHOW MODAL TRANSECTION
          this.modalTransactionShow = true;
        }
        else{
          // HIDE MODAL POPUP 
          this.qrPayment = false;
          // HIDE MODAL TRANSECTION
          this.modalTransactionShow = true;
          // GO TO PAYMENT CONFIRM LIST 
          this.router.navigate([`/payment-confirm-list`])
        }
      })
    })
  }

  setTime10Min(timeDifference) {
    // console.log(timeDifference)
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
      this.minutesToDday == '00';
      this.secondsToDday == '00';
      // THIS TIME UP && QR EXPIRED
      // UNSUBSCRIBE TIMEER COUNT DOWN
      this.subscriptionTimer.unsubscribe()
      // UNSUBSCRIBE TRANSACTION
      if(this.subscriTransaction != null){
        this.subscriTransaction.unsubscribe(); 
      }
      // THIS UPDATE TRANSACTION STATUS == FAIL
      this.firestore.collection('transaction').doc(this.transactionKey).update({
        status: 'fail'
      })
    }
    // console.log(this.minutesToDday, this.secondsToDday)
  }

  ngOnDestroy() {
    // UNSUBSCRIPTION QR TIMER
    if(this.subscriptionTimer != undefined){
      this.subscriptionTimer.unsubscribe();
    }
    // UNSUBSCRIBE TRANSACTION
    if(this.subscriTransaction != undefined){
      this.subscriTransaction.unsubscribe(); 
    }
  }

  modalPaymentStauts(){
    this.modalTransactionShow = false;
    if(this.modalTransacStatus == 'สำเร็จ'){
      // PAYMENT STATUS = SUCCESS => GOTO ORDER WAITING TRANSPORT
      this.router.navigate([`/transport-prepare-list`]);
    }
    else if(this.modalTransacStatus == 'ไม่สำเร็จ'){
      // RELOAD PAGE
      this.ngOnInit();
    }
    // CLEAR TEXT ERROR FOR MODAL
    this.modalTransacStatus = '';
  }

  editOrderPayment(){
    // console.log('-- editOrderPayment --')
    // HIDE MODAL QR PAYMENT
    this.qrPayment = false;
    // HIDE MODAL TRANSACTION STATUS
    this.modalTransactionShow = false;
    // UNSUBSCRIBE TRANSACTION
    // console.log(this.subscriTransaction)
    if(this.subscriTransaction != null){
      this.subscriTransaction.unsubscribe(); 
    }
    var _satatus: any = this.transaction.status;
    if(this.transaction.orderKey.length == 1){
      _satatus = 'cancel'
    }
    // UPDATE ARRAY ORDERKEY TRANSACTION 
    this.firestore.collection('transaction').doc(this.item.transactionKey).update({
      // REMOVE ORDER DOC KEY IN ARRAY ORDERKEY TRANSACTION 
      // orderKey: firebase.firestore.FieldValue.arrayRemove(this.id),
      // CHANGE STATUS TO CANCEL TRANSACTION
      status: _satatus
    })
    .then(() => {
      // UPDATE ORDER FOR NEW PAYMENT
      this.firestore.collection('order').doc(this.id).update({
        status: 'cart',
        delivery: null,
        channel_list: null,
        transactionKey: null,
      })
      .then(() => {
        // GOTO CART
        this.router.navigate([`/payment-items`])
      })
    })
  }

  hideModalQrPayment(){
    // HIDE MODAL QR PAYMENT
    this.qrPayment = false;
  }

  gotoProductDes(productKey){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${productKey}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  copyRef1(){
    var textField = document.createElement('textarea');
    textField.style.position = 'fixed';
    textField.style.left = '0';
    textField.style.top = '0';
    textField.style.opacity = '0';
    textField.innerText = this.transaction.response.stalls_name;
    document.body.appendChild(textField);
    textField.select();
    textField.focus();
    document.execCommand('copy');
    textField.remove();
  } 

  copyRef2(){
    var textField = document.createElement('textarea');
    textField.style.position = 'fixed';
    textField.style.left = '0';
    textField.style.top = '0';
    textField.style.opacity = '0';
    textField.innerText = this.transaction.response.ksher_order_no;
    document.body.appendChild(textField);
    textField.select();
    textField.focus();
    document.execCommand('copy');
    textField.remove();
  } 

}
