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
  selector: 'app-order-cancel-description',
  templateUrl: './order-cancel-description.component.html',
  styleUrls: ['./order-cancel-description.component.css']
})
export class OrderCancelDescriptionComponent implements OnInit {

  public id
  public item:any = null;
  public transport:any = null;
  
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
          this.firestore.collection('order').doc(this.id).collection('transport', ref => ref
          .orderBy('updateAt', 'desc')
          .limit(1))
          .get().toPromise()
          .then((transport) => {
            if(!transport.empty){
              // TRANSPORT NOT EMPTY
              this.transport = transport.docs[0].data();
              if(_item.delivery.priceDelivery.deliveryName == 'Kerry Express'){

              }
              else if(_item.delivery.priceDelivery.deliveryName == 'Thailand Post'){
                
              }
              else if(_item.delivery.priceDelivery.deliveryName == 'SCG Express'){
          
              }
              else if(_item.delivery.priceDelivery.deliveryName == 'Flash Express'){
                this.transport.routes.forEach((doc) => {
                  if(doc.state == "1"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "เข้ารับพัสดุแล้ว";
                  }
                  else if(doc.state == "2"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "ศูนย์คัดแยกสินค้า";
                  }
                  else if(doc.state == "3"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "พัสดุอยู่ระหว่างทาง";
                  }
                  else if(doc.state == "4"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "พัสดุกำลังนำจ่าย";
                  }
                  else if(doc.state == "5"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "นำส่งสำเร็จ (ลงชื่อ)";
                  }
                  else if(doc.state == "6"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "มีปัญหาในการดำเนินการจัดส่ง";
                  }
                  else if(doc.state == "7"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "การส่งคืนสินค้า";
                  }
                  else if(doc.state == "8"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "ปิดโดยข้อยกเว้น";
                  }
                  else if(doc.state == "9"){
                    doc.stateTextEN = doc.stateText;
                    doc.stateTextTH = "ยกเลิกแล้ว";
                  }
                  else{
                    doc.stateTextEN = "No Data Found";
                    doc.stateTextTH = "ไม่พบข้อมูล";
                  }
                  doc.stateDate = Number(doc.stateDate*1000);
                })
              }
              else {
                // ERROR
              }
            }
            // if(!transport.empty){
            //   // TRANSPORT NOT EMPTY
            //   this.transport = transport.docs[0].data();
            //   this.transport.routes.forEach((doc) => {
            //     if(doc.state == "1"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "เข้ารับพัสดุแล้ว";
            //     }
            //     else if(doc.state == "2"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "ศูนย์คัดแยกสินค้า";
            //     }
            //     else if(doc.state == "3"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "พัสดุอยู่ระหว่างทาง";
            //     }
            //     else if(doc.state == "4"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "พัสดุกำลังนำจ่าย";
            //     }
            //     else if(doc.state == "5"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "นำส่งสำเร็จ (ลงชื่อ)";
            //     }
            //     else if(doc.state == "6"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "มีปัญหาในการดำเนินการจัดส่ง";
            //     }
            //     else if(doc.state == "7"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "การส่งคืนสินค้า";
            //     }
            //     else if(doc.state == "8"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "ปิดโดยข้อยกเว้น";
            //     }
            //     else if(doc.state == "9"){
            //       doc.stateTextEN = doc.stateText;
            //       doc.stateTextTH = "ยกเลิกแล้ว";
            //     }
            //     else{
            //       doc.stateTextEN = "No Data Found";
            //       doc.stateTextTH = "ไม่พบข้อมูล";
            //     }
            //     doc.stateDate = Number(doc.stateDate*1000);
            //   })
            // }
            else{
              // TRANSPORT EMPTY
              this.transport = null
            }
          })
        }
        else{
          this.router.navigate([`/order-cancel`])
        }
      })
    }
    else{
      // IS CAN'T GET ID
      this.router.navigate([`/order-cancel`])
    }
  }

  copyTrackNumber(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.item.delivery.trackingNumber;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  copySekkerAddress(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.item.returnProduct.returnProductShippingAddress;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  gotoProductDes(productKey){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product-description/${productKey}`])
    );
    // NEW TAB
    window.open(url, '_blank');
  }

}
