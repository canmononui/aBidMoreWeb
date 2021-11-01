import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
// CROP IMG
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: 'app-profile-settings-profileimg',
  templateUrl: './profile-settings-profileimg.component.html',
  styleUrls: ['./profile-settings-profileimg.component.css']
})
export class ProfileSettingsProfileimgComponent implements OnInit {

  public id;
  public userBuyer:any;
  public showContent = false;
  public showLoading = false
  public textError = '';
  public status = false;
  public imageChangedEvent: any = "";
  croppedImage: any = "";
  public imgURL: any = '';
  task: AngularFireUploadTask;
  public oldProfileImg = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      this.getUserBuyerData();
    }
    else{
      this.router.navigate(['/'])
    }
  }

  getUserBuyerData(){
    // this.userBuyer
    this.firestore.collection('user-buyer').doc(this.id).get().toPromise()
    .then((userBuyer) => {
      // var userData:any = userBuyer.data()
      // console.log(userData)
      this.userBuyer = userBuyer.data()
      console.log(this.userBuyer)
      if(this.userBuyer.profileImg.imgUrl == null){
        this.userBuyer.profileImg.imgUrl = './assets/img/profile-icon-BG.svg';
      }
      else {
        this.oldProfileImg = this.userBuyer.profileImg.imgUrl
      }
      this.showContent = true;
    })
  }

  // Input Img File
  fileChangeEvent(event: any): void {
    console.log(event);
    this.imageChangedEvent = event;
  }

  // Crop
  imageCropped(event: ImageCroppedEvent) {
    // console.log(event);
    this.croppedImage = event.base64;
  }

  // Button OK
  setProductImg() {
    // console.log(this.croppedImage);
    // Set Img
    if (this.croppedImage != "") {
      this.imgURL = this.croppedImage;
      this.userBuyer.profileImg.imgUrl = this.croppedImage;
    }
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

  checkProfileImg() {
    if(this.imgURL != ''){
      this.textError = 'บันทึกรูปโปรไฟล์ ?';
      this.status = true;
    }
    else {
      this.textError = 'กรุณาเพิ่มรูปโปรไฟล์ที่ต้องการเปลี่ยนแปลง';
      this.status = false;
    }
  }

  addProfileImg() {
    // console.log(this.imgURL)
    if(this.status){
      this.showContent = false;
      this.showLoading = true;
      var blob = this.dataURItoBlob(this.imgURL);
      // console.log(blob);
      var file = new File([blob], "imgProduct.png", {
        type: "image/png"
      });
      // console.log(file);
      // this.imgProductArray.push(file);
      
      // DELETE OLD FILE
      if(this.oldProfileImg != ''){
        this.storage.storage.refFromURL(this.oldProfileImg).delete();
      }
      // UPLOAD NEW FILE
      const imgpath = `profileImg/${new Date().getTime()}_${this.id}_buyerImg.png`;
      this.task = this.storage.upload(imgpath, file)
      const imgRef = this.storage.ref(imgpath);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          imgRef.getDownloadURL().subscribe(url => {
            const getFileUrl = url;
            this.firestore.collection('user-buyer').doc(this.id).update({
              profileImg: {
                imgUrl: getFileUrl,
                imgpath: imgpath
              }
            })
            .then(docRef => {
              this.router.navigate([`/profile-settings`]);
            })
          });
        }))
      .subscribe();
    }
  }



}
