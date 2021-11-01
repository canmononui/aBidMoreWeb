
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  selector: 'app-payment-items',
  templateUrl: './payment-items.component.html',
  styleUrls: ['./payment-items.component.css']
})
export class PaymentItemsComponent implements OnInit, OnDestroy {

  public id
  // public PaymentMethod = true;
  // public SelectCard = false;
  public items:any = [];
  public userBuyer:any
  public showContent = false;
  // public deliveryNameText = 'โปรดเลือกตัวเลือกขนส่ง';
  public userBuyerAddressList = [];
  public modalOrderAddress:any;
  public modalOrder:any;
  public modalOrderDeli:any;
  // public modalOrderAddress = null;
  public productDelivery:any = []
  public dateOverForPickUp:any = null
  public itemsForPayment:any = [];
  public addItemsForPayment = false;
  public sellerUIDArr:any = [];
  public selectAllItemsCheck = false;
  public itemDelete:any = null
  public shopDelete:any = null
  public sumAllItems:any = 0;
  public qrPayment = false;
  public paymentChannel = '';
  public transaction = null
  public addOrderBySellerUID = false;
  // TIMER
  private subscriptionTimer: Subscription;
  private subscriptionOrder: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  public timeDifference;
  public minutesToDday:any = '10';
  public secondsToDday:any = '00';
  // public hoursToDday:any = '00';
  public transactionKey:any
  public modalTransactionShow = false;
  public modalTransacStatus = '';
  // ORDER KEY ARR
  public orderKeyArr:any = [];
  // ORDER DES ARR
  public orderInPayment:any = [];
  public subscriTransaction:any = null;

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
      .where('status', '==', 'cart' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(items => {
          // console.log(items)
          // console.log(items.length)
          if(items.length != 0){
            this.items = [];
            this.setItemsByShop(items);
          }
          else {
            this.items = [];
            this.showContent = true;
          }
          // UNSUBSCRIPTION QR TIMER
          if(this.subscriptionTimer != undefined){
            this.subscriptionTimer.unsubscribe();
          }
        })
    }
    else{
      // IS CAN'T GET ID (UID BUYER)
      this.router.navigate(['/'])
    }
  }

  setItemsByShop(items){
    items.forEach((doc) => {
      // console.log(doc.key)
      // console.log(doc.value)
      // console.log(doc.value.sellerUID)
      // console.log(doc.id, doc.value, doc.value.createAt)
      // CALL FUNC START COUNT DOWN 10 MIN FOR QR CODE EXPIRED
      var orderExpiredAt:any = doc.value.createAt.toDate().getTime() + 86400*1000;
      // SUBSCRIPTION FIREBASE TIMESTAMP
      this.subscriptionOrder = interval(1000).subscribe(x => { 
        this.setTimeOrderExpired(doc.value, orderExpiredAt);
      });

      if (this.items.length != 0) {
        for(var i=0; i<this.items.length; i++){
          if (this.items[i].sellerUID == doc.value.sellerUID) {
            // HAVE ITEMS OF SELLER UID
            // ADD ITEMS BY SELLER UID
            this.items[i].order.push({
              key: doc.key,
              value: doc.value,
            })
            this.addOrderBySellerUID = true;
          }
          // else {
          //   // NO ITEMS OF SELLER UID
          //   // ADD FIRST ITEMS
          //   this.items.push({
          //     shopName: doc.value.shopName,
          //     sellerUID: doc.value.sellerUID,
          //     order: [{
          //       key: doc.key,
          //       value: doc.value,
          //     }],
          //     paymentShopSum: 0
          //   })
          // }
        }
        // ADD ITEMS BY SELLER UID CHECK [FALSE]
        if(!this.addOrderBySellerUID){
          // NO ITEMS OF SELLER UID
          // ADD FIRST ITEMS
          // ADD FIRST ITEMS BY SELLER UID
          this.items.push({
            shopName: doc.value.shopName,
            sellerUID: doc.value.sellerUID,
            order: [{
              key: doc.key,
              value: doc.value,
            }],
            paymentShopSum: 0
          })
        }
        // CLEAR STATE CHECK
        this.addOrderBySellerUID = false;
      }
      else {
        // NO ITEMS OF SELLER UID
        // ADD FIRST ITEMS
        this.items.push({
          shopName: doc.value.shopName,
          sellerUID: doc.value.sellerUID,
          order: [{
            key: doc.key,
            value: doc.value,
          }],
          paymentShopSum: 0
        })
      }
    })
    // this.items = cart;
    // console.log(this.items)
    this.getBuyerAddress()
  }

  setTimeOrderExpired(orderValue, orderExpiredAt) {
    // console.log(doc.key, doc.value)
    // console.log(doc.key)
    // console.log(orderValue)
    // console.log(orderCreateAt)
    var secondsToDday:any;
    var minutesToDday:any;
    var hoursToDday:any;
    var timeDifference:any = orderExpiredAt - firebase.firestore.Timestamp.now().toDate().getTime()
    // console.log(timeDifference)
    if(timeDifference > 0){
      // if(Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) < 10){
      //   secondsToDday = '0' + (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      // }
      // else{
      //   secondsToDday = (Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).toString();
      // }
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
      orderValue.orderExpired = {
        // secondsToDday: secondsToDday,
        minutesToDday: minutesToDday,
        hoursToDday: hoursToDday
      }
    }
    else {
      // TIME < 0 TIME UP
      orderValue.orderExpired = {
        // secondsToDday: '00',
        minutesToDday: '00',
        hoursToDday: '00'
      }
    }
    // console.log(orderValue.orderExpired)
  }

  getBuyerAddress(){
    this.firestore.collection('user-buyer').doc(this.id).get().toPromise()
    .then((userBuyer) => {
      if(userBuyer.data() != undefined){
        this.userBuyer = userBuyer.data()
        if(this.userBuyer.mainAddress == undefined){
          this.userBuyer.mainAddress = null
        }
        else {
          // SET BUYYER ADDRESS STRING
          // console.log(this.userBuyer.mainAddress.dataAddress)
          this.userBuyer.mainAddress.addressString = '';
          if(this.userBuyer.mainAddress.dataAddress.number != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.dataAddress.number
          }
          if(this.userBuyer.mainAddress.dataAddress.moo != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.moo
          }
          if(this.userBuyer.mainAddress.dataAddress.village != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.village
          }
          if(this.userBuyer.mainAddress.dataAddress.lane != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.lane
          }
          if(this.userBuyer.mainAddress.dataAddress.road != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.road
          }
          if(this.userBuyer.mainAddress.dataAddress.subDistrict != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.subDistrict
          }
          if(this.userBuyer.mainAddress.dataAddress.district != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.district
          }
          if(this.userBuyer.mainAddress.dataAddress.province != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.province
          }
          if(this.userBuyer.mainAddress.dataAddress.postalCode != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " " + this.userBuyer.mainAddress.dataAddress.postalCode
          }
          if(this.userBuyer.mainAddress.dataAddress.phone != ""){
            this.userBuyer.mainAddress.addressString = this.userBuyer.mainAddress.addressString + " (" + this.userBuyer.mainAddress.dataAddress.phone + ")"
          }
        }

        // FOR EACH ITEMS (SHOP)
        this.items.forEach((items) => {
          this.firestore.collection('shop').doc(items.sellerUID).get().toPromise()
          .then((userShop) => {
            // GET SELLER ADDRESS
            var _userShop:any = userShop.data();
            // FOR EACH ORDER (ORDER IN SHOP)
            items.order.forEach((order) => {
              // GET PRODUCT DES
              this.firestore.collection('product').doc(order.value.productKey).get().toPromise()
              .then((product) => {
                var _product : any = product.data();
                // SET DATA
                order.value.delivery = {
                  buyyerAddress: this.userBuyer.mainAddress,
                  sellerAddress: _userShop.shopAddress,
                  codStatus: false,
                  status: null,
                  priceDelivery: _product.priceDelivery[0],
                  dateOverForPickUp: _product.dateOverForPickUp,
                  package: _product.package,
                }
                // SET MORE DELIVERY FOR MODAL POPUP DELIVERY
                order.value.moreDelivery = _product.priceDelivery;
              })
            })
          })
        })
        // THIS VERSION OK
        this.showContent = true;
      }
    })
  }


  // setBuyerAddress(itemsI){
  //   this.firestore.collection('shop').doc(this.items[itemsI].sellerUID).get().toPromise()
  //   .then((userShop) => {
  //     // console.log(userShop.data())
  //     var _userShop:any = userShop.data()
  //     // console.log(this.items[itemsI].order.length)
  //     for(var j=0; j<this.items[itemsI].order.length; j++){
  //       this.items[itemsI].order[j].value.delivery = {
  //         buyyerAddress: this.userBuyer.mainAddress,
  //         sellerAddress: _userShop.shopAddress,
  //         priceDelivery: null,
  //         codStatus: false,
  //         status: null
  //       }
  //     }
  //   })
  //   // console.log(this.items)
  //   this.getDeliveryDefault();

  //   // THIS VERSION OK
  //   // this.showContent = true;
  // }

  // async getDeliveryDefault(){
  //   for(var i=0; i<this.items.length; i++){
  //     for(var j=0; j<this.items[i].order.length; j++){
  //       // console.log(this.items[i].order[j].value.productKey)
  //       // GET PRODUCT DES
  //       var _productDes:any = await this.getProductDes(this.items[i].order[j].value.productKey)
  //       // DELIVERY SELECT DEFAULT 
  //       this.items[i].order[j].value.delivery.priceDelivery = _productDes.priceDelivery[0];
  //       this.items[i].order[j].value.delivery.dateOverForPickUp = _productDes.dateOverForPickUp;
  //       // SET MORE DELIVERY FOR MODAL POPUP DELIVERY
  //       this.items[i].order[j].value.moreDelivery = _productDes.priceDelivery;
  //     }
  //   }
  //   this.showContent = true;
  // }

  // getProductDes(productKey){
  //   return this.firestore.collection('product').doc(productKey).get().toPromise()
  //     .then((product) => {
  //       // console.log(product.data())
  //       return product.data()
  //     })
  // }

  getBuyerAddressMore(order){
    // SET VALABLE
    this.modalOrder = null;
    this.modalOrderAddress = null;
    this.userBuyerAddressList = [];
    // console.log(order)
    if(this.userBuyer.mainAddress != null){
      // console.log(order.value.delivery.buyyerAddress.dataAddress)
      // SET ORDER FOR MODAL
      this.modalOrder = order;
      // SET ADDRESS IN ORDER
      this.modalOrderAddress = order.value.delivery.buyyerAddress;
      // PUSH MAIN ADDRESS TO ADDRESS LIST
      this.userBuyerAddressList.push({
        key: order.value.delivery.buyyerAddress.docID,
        value: order.value.delivery.buyyerAddress.dataAddress
      })
      // GET OTHER ADDRESS
      this.firestore.collection('user-buyer').doc(this.id).collection('address').get().toPromise()
      .then((addressList) => {
        // console.log(addressList.size)
        if(addressList.size != 1){
          // HAVE OTHER ADDRESS LIST
          addressList.forEach((doc) => {
            // console.log(doc.id)
            // console.log(doc.data())
            // PUSH OTHER ADDRESS TO ADDRESS LIST
            if(order.value.delivery.buyyerAddress.docID != doc.id){
              this.userBuyerAddressList.push({
                key: doc.id,
                value: doc.data()
              })
            }
          })
        }
      })
    }
  }

  selectAddressForOrder(address){
    // console.log(address)
    // SET ADDRESS STRING
    var addressString:any = '';
    if(address.value.number != ""){
      addressString = address.value.number
    }
    if(address.value.moo != ""){
      addressString = addressString + " " + address.value.moo
    }
    if(address.value.village != ""){
      addressString = addressString + " " + address.value.village
    }
    if(address.value.lane != ""){
      addressString = addressString + " " + address.value.lane
    }
    if(address.value.road != ""){
      addressString = addressString + " " + address.value.road
    }
    if(address.value.subDistrict != ""){
      addressString = addressString + " " + address.value.subDistrict
    }
    if(address.value.district != ""){
      addressString = addressString + " " + address.value.district
    }
    if(address.value.province != ""){
      addressString = addressString + " " + address.value.province
    }
    if(address.value.postalCode != ""){
      addressString = addressString + " " + address.value.postalCode
    }
    if(address.value.phone != ""){
      addressString = addressString + " (" + address.value.phone + ")"
    }
    this.modalOrderAddress = {
      addressString: addressString,
      dataAddress: address.value,
      docID: address.key
    }
    // LOOP SET ADDRESS FOR ORDER
    for(var i=0; i<this.items.length; i++){
      for(var j=0; j<this.items[i].order.length; j++){
        if(this.items[i].order[j].key == this.modalOrder.key){
          this.items[i].order[j].value.delivery.buyyerAddress = this.modalOrderAddress;
        }
      }
    }
  }

  // gotoSettingAddressList(){
  //   this.router.navigate([`/settings-address-list/${this.id}`])
  // }

  getProductDelivery(order){
    // SET VALABLE
    this.modalOrderDeli = null;
    this.productDelivery = [];
    this.modalOrderDeli = order;
    this.productDelivery = order.value.moreDelivery;
  }

  selectDeliveryForOrder(delivery){
    // console.log(delivery)
    for(var i=0; i<this.items.length; i++){
      for(var j=0; j<this.items[i].order.length; j++){
        if(this.items[i].order[j].key == this.modalOrderDeli.key){
          // this.items[i].order[j].value.delivery.buyyerAddress = this.modalOrderAddress;
          this.items[i].order[j].value.delivery.priceDelivery = delivery
          // this.items[i].order[j].value.delivery.dateOverForPickUp = this.dateOverForPickUp
        }
      }
    }
  } 

  selecrOrderShop(dataOrderShop){
    // console.log(dataOrderShop)
    // console.log(dataOrderShop.sellerUID)
    if(dataOrderShop.checked == undefined || dataOrderShop.checked == false){
      // SHOP NOT CHECK => CHECKED
      for(var i=0; i<dataOrderShop.order.length; i++){
        // console.log(dataOrderShop.order[i])
        if(dataOrderShop.order[i].value.delivery.buyyerAddress != null && dataOrderShop.order[i].value.delivery.priceDelivery != undefined){
          // PAYMENT SHOP SUM => PRICE OF PRODUCT + PRICE OF DELIVERY
          if(dataOrderShop.order[i].value.checked == undefined || dataOrderShop.order[i].value.checked == false){
            dataOrderShop.paymentShopSum = dataOrderShop.paymentShopSum + dataOrderShop.order[i].value.priceOfProduct + dataOrderShop.order[i].value.delivery.priceDelivery.priceDeliveryInput;
            this.allItemsPlus(dataOrderShop.order[i].value.priceOfProduct, dataOrderShop.order[i].value.delivery.priceDelivery.priceDeliveryInput)
            var element = <HTMLInputElement> document.getElementById(`checkbox${dataOrderShop.order[i].key}`);
            element.checked = true;
            dataOrderShop.order[i].value.checked = true;
          }
          // else {

          // }
        }
      }
      var count:any = 0;
      // LOOP CHECK ORDER IN SHOP CHECKED ?
      for(var i=0; i<dataOrderShop.order.length; i++){ 
        if(dataOrderShop.order[i].value.checked){
          count++
        }
      }
      if(count != dataOrderShop.order.length){
        // ITEMS IN SHOP ALL NOT CHECKED
        var element = <HTMLInputElement> document.getElementById(`checkbox${dataOrderShop.sellerUID}`);
        element.checked = false;
        dataOrderShop.checked = false;
        this.addItemsForPayment = true;
      }
      else {
        dataOrderShop.checked = true;
      }
    }
    else {
      // SHOP CHECKED => CHECK
      dataOrderShop.checked = false;
      for(var i=0; i<dataOrderShop.order.length; i++){
        // console.log(dataOrderShop.order[i])
        // PAYMENT SHOP SUM => PRICE OF PRODUCT + PRICE OF DELIVERY
        dataOrderShop.paymentShopSum = dataOrderShop.paymentShopSum - dataOrderShop.order[i].value.priceOfProduct - dataOrderShop.order[i].value.delivery.priceDelivery.priceDeliveryInput;
        this.allItemsMinus(dataOrderShop.order[i].value.priceOfProduct, dataOrderShop.order[i].value.delivery.priceDelivery.priceDeliveryInput)
        var element = <HTMLInputElement> document.getElementById(`checkbox${dataOrderShop.order[i].key}`);
        element.checked = false;
        dataOrderShop.order[i].value.checked = false;
      }
    }
  }

  selecrOrderItem(dataOrderShop, dataOrderItem){
    // console.log(dataOrderShop)
    // console.log(dataOrderItem)
    if(dataOrderItem.value.delivery.buyyerAddress != null && dataOrderItem.value.delivery.priceDelivery != undefined){
      if(dataOrderItem.value.checked == undefined || dataOrderItem.value.checked == false){
        dataOrderItem.value.checked = true;
        // PAYMENT SHOP SUM => PRICE OF PRODUCT + PRICE OF DELIVERY
        dataOrderShop.paymentShopSum = dataOrderShop.paymentShopSum + dataOrderItem.value.priceOfProduct + dataOrderItem.value.delivery.priceDelivery.priceDeliveryInput;
        this.allItemsPlus(dataOrderItem.value.priceOfProduct, dataOrderItem.value.delivery.priceDelivery.priceDeliveryInput)
      }
      else {
        dataOrderItem.value.checked = false;
        // PAYMENT SHOP SUM => PRICE OF PRODUCT + PRICE OF DELIVERY
        dataOrderShop.paymentShopSum = dataOrderShop.paymentShopSum - dataOrderItem.value.priceOfProduct - dataOrderItem.value.delivery.priceDelivery.priceDeliveryInput;
        this.allItemsMinus(dataOrderItem.value.priceOfProduct, dataOrderItem.value.delivery.priceDelivery.priceDeliveryInput)
        // SET CHECK BOX ALL ITEMS
        var element = <HTMLInputElement> document.getElementById('checkboxSum');
        element.checked = false;
        this.selectAllItemsCheck = false;
      }
      var count:any = 0;
      // LOOP CHECK ORDER IN SHOP CHECKED ?
      for(var i=0; i<dataOrderShop.order.length; i++){ 
        if(dataOrderShop.order[i].value.checked){
          count++
        }
      }
      if(count == dataOrderShop.order.length){
        // ALL ITEMS IN SHOP CHECKED
        var element = <HTMLInputElement> document.getElementById(`checkbox${dataOrderShop.sellerUID}`);
        element.checked = true;
        dataOrderShop.checked = true;
      }
      else {
        // ITEMS IN SHOP ALL NOT CHECKED
        var element = <HTMLInputElement> document.getElementById(`checkbox${dataOrderShop.sellerUID}`);
        element.checked = false;
        dataOrderShop.checked = false;
      }
    }
    else {
      // NOT PUSH ITEM IN ITEMSFORPAYMENT => CHECKBOX ITEM FALSE
      var element = <HTMLInputElement> document.getElementById(`checkbox${dataOrderItem.key}`);
      element.checked = false;
      // SHOW MODAL ADD ITEMS FALSE
      this.addItemsForPayment = true;
    }
  }

  selectAllItems(){
    var orderCount:any = 0;
    var countItems:any = 0;
    if(this.selectAllItemsCheck){
      // SET ALL ITEMS CHECKED => CHECK
      for(var i=0; i<this.items.length; i++){
        var element = <HTMLInputElement> document.getElementById(`checkbox${this.items[i].sellerUID}`);
        element.checked = false;
        this.items[i].checked = false;
        for(var j=0; j<this.items[i].order.length; j++){
          var element = <HTMLInputElement> document.getElementById(`checkbox${this.items[i].order[j].key}`);
          element.checked = false;
          this.items[i].paymentShopSum = this.items[i].paymentShopSum - this.items[i].order[j].value.priceOfProduct - this.items[i].order[j].value.delivery.priceDelivery.priceDeliveryInput;
          this.allItemsMinus(this.items[i].order[j].value.priceOfProduct, this.items[i].order[j].value.delivery.priceDelivery.priceDeliveryInput)
          this.items[i].order[j].value.checked = false;
        }
      }
      this.selectAllItemsCheck = false;
    }
    else {
      // SET ALL ITEMS CHECK => CHECKED
      for(var i=0; i<this.items.length; i++){
        orderCount = orderCount + this.items[i].order.length;
        var countOrder:any = 0;
        for(var j=0; j<this.items[i].order.length; j++){
          if(this.items[i].order[j].value.delivery.buyyerAddress != null && this.items[i].order[j].value.delivery.priceDelivery != undefined){
            if(this.items[i].order[j].value.checked == undefined || this.items[i].order[j].value.checked == false){
              var element = <HTMLInputElement> document.getElementById(`checkbox${this.items[i].order[j].key}`);
              element.checked = true;
              this.items[i].paymentShopSum = this.items[i].paymentShopSum + this.items[i].order[j].value.priceOfProduct + this.items[i].order[j].value.delivery.priceDelivery.priceDeliveryInput;
              this.allItemsPlus(this.items[i].order[j].value.priceOfProduct, this.items[i].order[j].value.delivery.priceDelivery.priceDeliveryInput)
              this.items[i].order[j].value.checked = true;
            }
            countItems++
            countOrder++
          }
        }
        if(countOrder == this.items[i].order.length){
          var element = <HTMLInputElement> document.getElementById(`checkbox${this.items[i].sellerUID}`);
          element.checked = true;
          this.items[i].checked = true;
        }
        else{
          var element = <HTMLInputElement> document.getElementById(`checkbox${this.items[i].sellerUID}`);
          element.checked = false;
          this.items[i].checked = false;
        }
      }
      // CHECK ALL ORDER CHECKED ?
      if(countItems != orderCount){
        var element = <HTMLInputElement> document.getElementById('checkboxSum');
        element.checked = false;
        this.selectAllItemsCheck = false;
        this.addItemsForPayment = true;
      }
      else {
        this.selectAllItemsCheck = true;
      }
    }
  }

  closeModalPopupAddItemFail(){
    this.addItemsForPayment = false;
  }

  selectItemForDelete(dataItem){
    // console.log(dataItem)
    this.itemDelete = dataItem;
  }

  deleteItem(){
    if(this.itemDelete != null){
      // DELETE ITEM ORDER
      // console.log(this.itemDelete.key)
      this.firestore.collection('order').doc(this.itemDelete.key).update({
        deleteAt: firebase.firestore.Timestamp.now(),
        status: 'cancelByBuyer'
      })
      .then(() => {
        // ADD NOTI BUYER
        this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
          createAt: firebase.firestore.Timestamp.now(),
          topic: `คุณได้ยกเลิกคำสั่งซื้อ #${this.itemDelete.value.orderNo}`,
          description: `คุณได้ยกเลิกคำสั่งซื้อ #${this.itemDelete.value.orderNo}`,
          product: {
            productKey: this.itemDelete.value.productKey,
            productName: this.itemDelete.value.productName,
            imgProduct1: {
              imgUrl: this.itemDelete.value.imgProduct[0].imgUrl,
              imgpath: this.itemDelete.value.imgProduct[0].imgpath
            },
            orderNo: this.itemDelete.value.orderNo
          },
          type: 'order',
          readed: false
        })
        .then(() => {
          this.itemDelete == null
        })
      })
    }
  }

  selectShopItemForDelete(dataShop){
    // console.log(dataShop)
    this.shopDelete = dataShop;
  }

  deleteShopItem(){
    if(this.shopDelete != null){
      for(var i=0; i<this.shopDelete.order.length; i++){
        var _order:any = this.shopDelete.order[i];
        // console.log(this.shopDelete.order[i].key)
        // DELETE ITEM ORDER
        this.firestore.collection('order').doc(_order.key).update({
          deleteAt: firebase.firestore.Timestamp.now(),
          status: 'cancelByBuyer'
        })
        .then(() => {
          // ADD NOTI BUYER
          this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
            createAt: firebase.firestore.Timestamp.now(),
            topic: `คุณได้ยกเลิกคำสั่งซื้อ #${_order.value.orderNo}`,
            description: `คุณได้ยกเลิกคำสั่งซื้อ #${_order.value.orderNo}`,
            product: {
              productKey: _order.value.productKey,
              productName: _order.value.productName,
              imgProduct1: {
                imgUrl: _order.value.imgProduct[0].imgUrl,
                imgpath: _order.value.imgProduct[0].imgpath
              },
              orderNo: _order.value.orderNo
            },
            type: 'order',
            readed: false
          })
          // .then(() => {
          //   this.shopDelete == null
          // })
        })
      }
      this.shopDelete == null
    }
  }

  allItemsPlus(productPrice, deliveryPrice){
    // console.log(productPrice, deliveryPrice)
    this.sumAllItems = Number(this.sumAllItems + (Number(productPrice) + Number(deliveryPrice)));
  }

  allItemsMinus(productPrice, deliveryPrice){
    // console.log(productPrice, deliveryPrice)
    this.sumAllItems = Number(this.sumAllItems - (Number(productPrice) + Number(deliveryPrice)));
  }

  payment(channel){
    // UPDATE ORDER
    this.paymentChannel = channel;
    // ORDER KEY ARR
    this.orderKeyArr = [];
    // ORDER DES ARR
    this.orderInPayment = [];
    // LOOP SET ORDER IN PAYMENT
    for(var i=0; i<this.items.length; i++){
      for(var j=0; j<this.items[i].order.length; j++){
        if(this.items[i].order[j].value.checked){
          // THIS ORDER CHECKED
          // console.log(this.items[i].order[j].key)
          // PUSH ORDER KEY IN ARR
          this.orderKeyArr.push(this.items[i].order[j].key)
          // PUSH ORDER ORDER DES IN ORDER DES ARR
          this.orderInPayment.push(this.items[i].order[j])
          // UPDATE ORDER
          this.firestore.collection('order').doc(this.items[i].order[j].key).update({
            delivery: this.items[i].order[j].value.delivery,
            status: 'pending-payment',
            channel_list: String(channel),
          })
        }
      }
    }
    // ADD TRANS
    this.firestore.collection('transaction').add({
      createAt: firebase.firestore.Timestamp.now(),
      channel_list: String(channel),
      fee_type: 'THB',
      orderKey: this.orderKeyArr,
      status: 'request'
    })
    .then((doc) => {
      this.transactionKey = doc.id;
      // SET TRANSACTION KEY IN ORDER
      for(var i=0; i<this.orderKeyArr.length; i++){
        this.firestore.collection('order').doc(this.orderKeyArr[i]).update({
          transactionKey: doc.id
        })
      }
      // // CLEAR ORDER KEY ARR
      // orderKeyArr = [];
      // MONITOR TRANSACTION FOR RESPONSE
      this.subscriTransaction = this.firestore.collection('transaction').doc(doc.id).valueChanges()
      .subscribe(val => {
        this.transaction = val;
        if(this.transaction.status == 'request' || this.transaction.status == 'pending' || this.transaction.status == 'waiting'){
          // SHOW MODAL POPUP CAN'T CLOSE
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
          for(var i=0; i<this.orderInPayment.length; i++){
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
              createAt: firebase.firestore.Timestamp.now(),
              topic: `คำสั่งซื้อ #${this.orderInPayment[i].value.orderNo} ชำระเงินไม่สำเร็จโปรดตรวจสอบการชำระเงิน`,
              description: `คำสั่งซื้อ #${this.orderInPayment[i].value.orderNo} ชำระเงินไม่สำเร็จโปรดตรวจสอบการชำระเงิน`,
              product: {
                productKey: this.orderInPayment[i].key,
                productName: this.orderInPayment[i].value.productName,
                imgProduct1: {
                  imgUrl: this.orderInPayment[i].value.imgProduct[0].imgUrl,
                  imgpath: this.orderInPayment[i].value.imgProduct[0].imgpath
                },
                orderNo: this.orderInPayment[i].value.orderNo
              },
              type: 'order',
              readed: false
            })
          }
          // UNSUBSCRIPTION QR TIMER
          if(this.subscriptionTimer != undefined){
            this.subscriptionTimer.unsubscribe();
          }
          // HIDE MODAL QR PAYMENT
          this.qrPayment = false;
          // CLEAR SUM ALL ITEMS
          this.sumAllItems = 0;
          // TEXT ERROR FOR MODAL
          this.modalTransacStatus = 'ไม่สำเร็จ';
          // SHOW MODAL TRANSECTION
          this.modalTransactionShow = true;
          // this.router.navigate([`/payment-confirm-list/${this.auth.currentUserId}`])
        }
        else if(this.transaction.status == 'success'){
          // PAY SUCCESS => ADD NOTIFICATION
          // ADD NOTI BUYER => WAITING-FOR-DELIVERY
          for(var i=0; i<this.orderInPayment.length; i++){
            this.firestore.collection('user-buyer').doc(this.auth.currentUserId).collection('notifications').add({
              createAt: firebase.firestore.Timestamp.now(),
              topic: `คำสั่งซื้อ #${this.orderInPayment[i].value.orderNo} ชำระเงินสำเร็จสินค้าเตรียมการจัดส่ง`,
              description: `คำสั่งซื้อ #${this.orderInPayment[i].value.orderNo} ชำระเงินสำเร็จสินค้าเตรียมการจัดส่ง`,
              product: {
                productKey: this.orderInPayment[i].key,
                productName: this.orderInPayment[i].value.productName,
                imgProduct1: {
                  imgUrl: this.orderInPayment[i].value.imgProduct[0].imgUrl,
                  imgpath: this.orderInPayment[i].value.imgProduct[0].imgpath
                },
                orderNo: this.orderInPayment[i].value.orderNo
              },
              type: 'order',
              readed: false
            })
            // ADD NOTI SELLER => WAITING-FOR-DELIVERY
            this.firestore.collection('shop').doc(this.orderInPayment[i].value.sellerUID).collection('notifications').add({
              createAt: firebase.firestore.Timestamp.now(),
              topic: `สินค้าที่ต้องส่ง #${this.orderInPayment[i].value.orderNo} โปรดจัดส่งสินค้าตามกำหนดเวลา`,
              description: `สินค้าที่ต้องส่ง #${this.orderInPayment[i].value.orderNo} โปรดจัดส่งสินค้าตามกำหนดเวลา`,
              product: {
                productKey: this.orderInPayment[i].key,
                productName: this.orderInPayment[i].value.productName,
                imgProduct1: {
                  imgUrl: this.orderInPayment[i].value.imgProduct[0].imgUrl,
                  imgpath: this.orderInPayment[i].value.imgProduct[0].imgpath
                },
                orderNo: this.orderInPayment[i].value.orderNo
              },
              type: 'order',
              readed: false
            })
          }
          // UNSUBSCRIPTION QR TIMER
          if(this.subscriptionTimer != undefined){
            this.subscriptionTimer.unsubscribe();
          }
          // HIDE MODAL QR PAYMENT
          this.qrPayment = false;
          // CLEAR SUM ALL ITEMS
          this.sumAllItems = 0;
          // TEXT ERROR FOR MODAL
          this.modalTransacStatus = 'สำเร็จ';
          // SHOW MODAL TRANSECTION
          this.modalTransactionShow = true;
          // this.router.navigate([`/transport-prepare-list/${this.auth.currentUserId}`])
        }
        else{
          // UNSUBSCRIPTION QR TIMER
          if(this.subscriptionTimer != undefined){
            this.subscriptionTimer.unsubscribe();
          }
          // HIDE MODAL QR PAYMENT
          this.qrPayment = false;
        }
      })
    })
  }

  // TIME DIFFERENCE
  // getTimeDifference (dateEndBid, timeStamp) {
  //   this.timeDifference = dateEndBid - timeStamp;
  //   this.allocateTimeUnits(this.timeDifference);
  // }

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
      this.ngOnDestroy();
      // THIS UPDATE TRANSACTION STATUS == FAIL
      this.firestore.collection('transaction').doc(this.transactionKey).update({
        status: 'fail'
      })
    }
    // console.log(this.minutesToDday, this.secondsToDday)
  }

  ngOnDestroy() {
    // UNSUBSCRIPTION ORDER TIMER
    if(this.subscriptionOrder != undefined){
      this.subscriptionOrder.unsubscribe();
    }
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
      // PAYMENT STATUS = FAIL => GOTO ORDER WAIT CONFIRM PAYMENT
      this.router.navigate([`/payment-confirm-list`]);
    }
    // CLEAR TEXT ERROR FOR MODAL
    this.modalTransacStatus = '';
  }

  gotoProductDes(productKey){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${productKey}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

  editOrderPayment(){
    // console.log('-- editOrderPayment --');
    // HIDE MODAL QR PAYMENT
    this.qrPayment = false;
    // HIDE MODAL TRANSACTION STATUS
    this.modalTransactionShow = false;
    // CLEAR SUM ALL ITEMS
    this.sumAllItems = 0;
    // SET TIME FOR NEW START TIMER
    this.secondsToDday = '00';
    this.minutesToDday = '10';
    // UNSUBSCRIPTION QR TIMER
    if(this.subscriptionTimer != undefined){
      this.subscriptionTimer.unsubscribe();
    }
    // UNSUBSCRIBE TRANSACTION
    if(this.subscriTransaction != null){
      this.subscriTransaction.unsubscribe(); 
    }
    // UPDATE ARRAY ORDERKEY TRANSACTION 
    this.firestore.collection('transaction').doc(this.transactionKey).update({
      // REMOVE ORDER DOC KEY IN ARRAY ORDERKEY TRANSACTION 
      // orderKey: []
      // CHANGE STATUS TO CANCEL TRANSACTION
      status: 'cancel'
    })
    .then(() => {
      // LOOP UPDATE ORDER IN PAYMENT FOR NEW PAYMENT
      for(var i=0; i<this.orderKeyArr.length; i++){
        this.firestore.collection('order').doc(this.orderKeyArr[i]).update({
          status: 'cart',
          delivery: null,
          channel_list: null,
          transactionKey: null,
        })
      }
    })
  }

  hideModalQrPayment(){
    // HIDE MODAL QR PAYMENT
    this.qrPayment = false;
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
