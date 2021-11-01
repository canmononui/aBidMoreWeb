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
  selector: 'app-transport-success-list',
  templateUrl: './transport-success-list.component.html',
  styleUrls: ['./transport-success-list.component.css']
})
export class TransportSuccessListComponent implements OnInit {

  public id
  public saleSuccessList:any = [];

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
      .where('status', '==', 'sale-success' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(items => {
          // console.log(items.length)
          if(items.length != 0){
            this.saleSuccessList = items;
            this.saleSuccessList.forEach((saleSuccess) => {
              this.firestore.collection('order').doc(saleSuccess.key).collection('transport', ref => ref
              .orderBy('updateAt', 'desc')
              .limit(1))
              .get().toPromise()
              .then((transport) => {
                if(!transport.empty){
                  // TRANSPORT NOT EMPTY
                  var _transport : any = transport.docs[0].data();
                  if(saleSuccess.value.delivery.priceDelivery.deliveryName == 'Kerry Express'){

                  }
                  else if(saleSuccess.value.delivery.priceDelivery.deliveryName == 'Thailand Post'){
                    _transport.stateTextTH = _transport.routes[_transport.routes.length - 1].statusDescription;
                    saleSuccess.value.transport = _transport;
                  }
                  else if(saleSuccess.value.delivery.priceDelivery.deliveryName == 'SCG Express'){
              
                  }
                  else if(saleSuccess.value.delivery.priceDelivery.deliveryName == 'Flash Express'){
                    if(_transport.state == "1"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "เข้ารับพัสดุแล้ว";
                    }
                    else if(_transport.state == "2"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "ศูนย์คัดแยกสินค้า";
                    }
                    else if(_transport.state == "3"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "พัสดุอยู่ระหว่างทาง";
                    }
                    else if(_transport.state == "4"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "พัสดุกำลังนำจ่าย";
                    }
                    else if(_transport.state == "5"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "นำส่งสำเร็จ (ลงชื่อ)";
                    }
                    else if(_transport.state == "6"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "มีปัญหาในการดำเนินการจัดส่ง";
                    }
                    else if(_transport.state == "7"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "การส่งคืนสินค้า";
                    }
                    else if(_transport.state == "8"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "ปิดโดยข้อยกเว้น";
                    }
                    else if(_transport.state == "9"){
                      _transport.stateTextEN = _transport.stateText;
                      _transport.stateTextTH = "ยกเลิกแล้ว";
                    }
                    else{
                      _transport.stateTextEN = "No Data Found";
                      _transport.stateTextTH = "ไม่พบข้อมูล";
                    }
                    _transport.updateAt = _transport.updateAt;
                    saleSuccess.value.transport = _transport;
                  }
                }
                // if(!transport.empty){
                //   // TRANSPORT NOT EMPTY
                //   var _transport : any = transport.docs[0].data();
                //   if(_transport.state == "1"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "เข้ารับพัสดุแล้ว";
                //     }
                //     else if(_transport.state == "2"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "ศูนย์คัดแยกสินค้า";
                //     }
                //     else if(_transport.state == "3"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "พัสดุอยู่ระหว่างทาง";
                //     }
                //     else if(_transport.state == "4"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "พัสดุกำลังนำจ่าย";
                //     }
                //     else if(_transport.state == "5"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "นำส่งสำเร็จ (ลงชื่อ)";
                //     }
                //     else if(_transport.state == "6"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "มีปัญหาในการดำเนินการจัดส่ง";
                //     }
                //     else if(_transport.state == "7"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "การส่งคืนสินค้า";
                //     }
                //     else if(_transport.state == "8"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "ปิดโดยข้อยกเว้น";
                //     }
                //     else if(_transport.state == "9"){
                //       _transport.stateTextEN = _transport.stateText;
                //       _transport.stateTextTH = "ยกเลิกแล้ว";
                //     }
                //     else{
                //       _transport.stateTextEN = "No Data Found";
                //       _transport.stateTextTH = "ไม่พบข้อมูล";
                //     }
                //     _transport.updateAt = _transport.updateAt;
                //     saleSuccess.value.transport = _transport;
                // }
                else{
                  // TRANSPORT EMPTY
                  saleSuccess.value.transport = null;
                }
              })
            })
          }
          else {
            this.saleSuccessList = [];
          }
        })
    }
    else{
      // IS CAN'T GET ID (UID BUYER)
      this.router.navigate(['/'])
    }
  }

  gotoItem(itemKey){
    // THIS VERSION DISABLED
    this.router.navigate([`/transport-success-description/${itemKey}`])
  }

  gotoBuyMenuList(){
    this.router.navigate([`/buyMenu-list`])
  }

}
