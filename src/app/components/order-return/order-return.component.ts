import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
// CROP IMG
import { ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";

@Component({
  selector: 'app-order-return',
  templateUrl: './order-return.component.html',
  styleUrls: ['./order-return.component.css']
})
export class OrderReturnComponent implements OnInit {

  public id
  public item:any = null;
  public reasonSelectText = 'เลือกเหตุผลการคืนสินค้า';
  public comment = '';
  // public errorText = '';
  public showContent = true
  public showLoading = false;
  public showModal = false;
  // Product Img
  public imgURL1: any = './assets/img/productThumbnail.png';
  public imgURL2: any = './assets/img/productThumbnail.png';
  public imgURL3: any = './assets/img/productThumbnail.png';
  public imgURL4: any = './assets/img/productThumbnail.png';
  public imgURL5: any = './assets/img/productThumbnail.png';
  public imgDisabled1 = false;
  public imgDisabled2 = true;
  public imgDisabled3 = true;
  public imgDisabled4 = true;
  public imgDisabled5 = true;
  public imageChangedEvent: any = "";
  croppedImage: any = "";
  public imgProductArray: any = [];
  public imgProductArrayURL: any = [];
  public imgURL: any;
  task: AngularFireUploadTask;

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
        }
        else{
          this.router.navigate([`/order-waiting-confirm-list/${this.auth.currentUserId}`])
        }
      })
    }
    else{
      // IS CAN'T GET ID
      this.router.navigate([`/order-waiting-confirm-list/${this.auth.currentUserId}`])
    }
  }

  reasonSelect(reason){
    this.reasonSelectText = reason;
  }

  // Input Img File
  fileChangeEvent(event: any): void {
    // console.log(event);
    this.imageChangedEvent = event;
  }

  // Crop
  imageCropped(event: ImageCroppedEvent) {
    // console.log(event);
    this.croppedImage = event.base64;
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  // Button OK
  setProductImg1() {
    // console.log(this.croppedImage);
    // Set Img
    if (this.croppedImage != "") {
      this.imgURL1 = this.croppedImage;
      this.imgDisabled2 = false;
    }
  }

  // Button OK
  setProductImg2() {
    // Set Img
    if (this.croppedImage != "") {
      this.imgURL2 = this.croppedImage;
      this.imgDisabled3 = false;
    }
  }

  // Button OK
  setProductImg3() {
    // Set Img
    if (this.croppedImage != "") {
      this.imgURL3 = this.croppedImage;
      this.imgDisabled4 = false;
    }
  }

  // Button OK
  setProductImg4() {
    // Set Img
    if (this.croppedImage != "") {
      this.imgURL4 = this.croppedImage;
      this.imgDisabled5 = false;
    }
  }

  // Button OK
  setProductImg5() {
    // Set Img
    if (this.croppedImage != "") {
      this.imgURL5 = this.croppedImage;
    }
  }

  deleteProductImg1() {
    this.imgURL1 = './assets/img/productThumbnail.png';
  }

  deleteProductImg2() {
    this.imgURL2 = './assets/img/productThumbnail.png';
  }

  deleteProductImg3() {
    this.imgURL3 = './assets/img/productThumbnail.png';
  }

  deleteProductImg4() {
    this.imgURL4 = './assets/img/productThumbnail.png';
  }

  deleteProductImg5() {
    this.imgURL5 = './assets/img/productThumbnail.png';
  }

  commentInput($event){
    this.comment = $event.target.value
  }

  submit(){
    // console.log(this.reasonSelectText)
    // console.log(this.comment)
    this.showContent = false;
    this.showLoading = true;

    // CHECK IMG UPLOAD NULL 
    if (this.imgURL1 != './assets/img/productThumbnail.png') {
      var blob = this.dataURItoBlob(this.imgURL1);
      var file = new File([blob], "imgProductReturn.png", {
        type: "image/png"
      });
      this.imgProductArray.push(file);
    }

    if (this.imgURL2 != './assets/img/productThumbnail.png') {
      var blob = this.dataURItoBlob(this.imgURL2);
      var file = new File([blob], "imgProductReturn.png", {
        type: "image/png"
      });
      this.imgProductArray.push(file);
    }
    if (this.imgURL3 != './assets/img/productThumbnail.png') {
      var blob = this.dataURItoBlob(this.imgURL3);
      var file = new File([blob], "imgProductReturn.png", {
        type: "image/png"
      });
      this.imgProductArray.push(file);
    }
    if (this.imgURL4 != './assets/img/productThumbnail.png') {
      var blob = this.dataURItoBlob(this.imgURL4);
      var file = new File([blob], "imgProductReturn.png", {
        type: "image/png"
      });
      this.imgProductArray.push(file);
    }
    if (this.imgURL5 != './assets/img/productThumbnail.png') {
      var blob = this.dataURItoBlob(this.imgURL5);
      var file = new File([blob], "imgProductReturn.png", {
        type: "image/png"
      });
      this.imgProductArray.push(file);
    }

    // UPLOAD IMG 1
    const imgpath = `return-products/${new Date().getTime()}_${this.auth.currentUserId}_imgProductReturn1.png`;
    this.task = this.storage.upload(imgpath, this.imgProductArray[0])
    const imgRef = this.storage.ref(imgpath);
    this.task.snapshotChanges().pipe(
      finalize(() => {
        imgRef.getDownloadURL().subscribe(url => {
          const getFileUrl = url;
          this.imgProductArrayURL.push({
            imgpath: imgpath,
            imgUrl: getFileUrl
          });
          // UPLOAD IMG 2
          if (this.imgProductArray[1]) {
            const imgpath = `return-products/${new Date().getTime()}_${this.auth.currentUserId}_imgProductReturn2.png`;
            this.task = this.storage.upload(imgpath, this.imgProductArray[1])
            const imgRef = this.storage.ref(imgpath);
            this.task.snapshotChanges().pipe(
              finalize(() => {
                imgRef.getDownloadURL().subscribe(url => {
                  const getFileUrl = url;
                  this.imgProductArrayURL.push({
                    imgpath: imgpath,
                    imgUrl: getFileUrl
                  });
                  // UPLOAD IMG 3
                  if (this.imgProductArray[2]) {
                    const imgpath = `return-products/${new Date().getTime()}_${this.auth.currentUserId}_imgProductReturn3.png`;
                    this.task = this.storage.upload(imgpath, this.imgProductArray[2])
                    const imgRef = this.storage.ref(imgpath);
                    this.task.snapshotChanges().pipe(
                      finalize(() => {
                        imgRef.getDownloadURL().subscribe(url => {
                          const getFileUrl = url;
                          this.imgProductArrayURL.push({
                            imgpath: imgpath,
                            imgUrl: getFileUrl
                          });
                          // UPLOAD IMG 4
                          if (this.imgProductArray[3]) {
                            const imgpath = `return-products/${new Date().getTime()}_${this.auth.currentUserId}_imgProductReturn4.png`;
                            this.task = this.storage.upload(imgpath, this.imgProductArray[3])
                            const imgRef = this.storage.ref(imgpath);
                            this.task.snapshotChanges().pipe(
                              finalize(() => {
                                imgRef.getDownloadURL().subscribe(url => {
                                  const getFileUrl = url;
                                  this.imgProductArrayURL.push({
                                    imgpath: imgpath,
                                    imgUrl: getFileUrl
                                  });
                                  // UPLOAD IMG 5
                                  if (this.imgProductArray[4]) {
                                    const imgpath = `return-products/${new Date().getTime()}_${this.auth.currentUserId}_imgProductReturn5.png`;
                                    this.task = this.storage.upload(imgpath, this.imgProductArray[4])
                                    const imgRef = this.storage.ref(imgpath);
                                    this.task.snapshotChanges().pipe(
                                      finalize(() => {
                                        imgRef.getDownloadURL().subscribe(url => {
                                          const getFileUrl = url;
                                          this.imgProductArrayURL.push({
                                            imgpath: imgpath,
                                            imgUrl: getFileUrl
                                          });
                                          // CHECK ADD CALL FUNCTION
                                          if (this.imgProductArrayURL.length == this.imgProductArray.length) {
                                            this.updateOrder();
                                          }
                                        });
                                      }))
                                      .subscribe();
                                    // UPLOAD IMG 3
                                  }
                                  else { this.updateOrder(); }
                                });
                              }))
                              .subscribe();
                            // UPLOAD IMG 3
                          }
                          else { this.updateOrder(); }
                        });
                      }))
                      .subscribe();
                    // UPLOAD IMG 3
                  }
                  else { this.updateOrder(); }
                });
              }))
              .subscribe();
            // UPLOAD IMG 3
          }
          else { this.updateOrder(); }

        });
      }))
      .subscribe();
    
    // UPDATE ORDER
  }

  updateOrder(){
    console.log(this.reasonSelectText)
    console.log(this.comment)
    console.log(this.imgProductArrayURL)
    this.firestore.collection('order').doc(this.id).update({
      returnProduct: {
        buyerRequestAt: firebase.firestore.Timestamp.now(),
        buyerRequestReason: this.reasonSelectText,
        buyerRequestImg: this.imgProductArrayURL,
        buyerRequestDes: this.comment,
        status: 'buyerRequest'
      },
      status: 'return'
    })
    .then((item) => {
      this.router.navigate([`/order-cancel`])
    })
  }

}
