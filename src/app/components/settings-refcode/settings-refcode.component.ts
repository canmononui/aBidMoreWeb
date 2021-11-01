import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-refcode',
  templateUrl: './settings-refcode.component.html',
  styleUrls: ['./settings-refcode.component.css']
})
export class SettingsRefcodeComponent implements OnInit {

  public id;
  public userBuyer:any;
  public showContent = false;
  public errorText = 'โปรดเพิ่มรหัสแนะนำ';
  public refCode = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // console.log(this.auth.currentUserId)
    // this.id = this.route.snapshot.paramMap.get("id");
    this.id = this.auth.currentUserId;
    if(this.id){
      this.getProfile();
    }
    else{
      this.router.navigate([`/profile-settings-list`]);
    }
  }

  getProfile(){
    this.firestore.collection('user-buyer').doc(this.id).get().toPromise()
    .then(userBuyer => {
      if(userBuyer.data() != undefined){
        this.userBuyer = userBuyer.data();
        if(this.userBuyer.refCode == null){
          this.showContent = true;
        }
        else{
          this.router.navigate([`/profile-settings-list`]);
        }
      }
      else{
        this.router.navigate([`/profile-settings-list`]);
      }
      // this.showContent = true
    })
  }

  check(refCodeInput){
    if(refCodeInput != ''){
      // SET REFCODE TO UPPER CASE
      var _refCodeUpper:any =  refCodeInput.toUpperCase()
      // CHECK REFCODE IN DB
      this.firestore.collection('user-buyer', ref => ref
      .where('yourRefCode', '==', _refCodeUpper))
      .get().toPromise()
      .then((doc) => {
        if(doc.empty){
          this.errorText = 'ข้อผิดพลาดรหัสแนะนำไม่ถูกต้อง';
          this.refCode = null;
        }
        else{
          this.errorText = 'ต้องการเพิ่มรหัสแนะนำ ' + _refCodeUpper;
          this.refCode = _refCodeUpper;
        }
      })
    }
    else{
      this.errorText = 'โปรดเพิ่มรหัสแนะนำ';
      this.refCode = null;
    }
  }

  submitRefCode(){
    if(this.refCode != null){
      this.firestore.collection('user-buyer').doc(this.id).update({
        refCode: this.refCode
      })
      .then((doc) => {
        this.router.navigate([`/profile-settings-list`]);
      })
    }
  }

}
