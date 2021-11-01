import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  public id;
  public userBuyer:any;
  public showContent = false;
  public showDisplayName = '';
  public imgShow = '';

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
      this.getProfile();
    }
    else{
      this.router.navigate(['/'])
    }
  }

  getProfile(){
    this.firestore.collection('user-buyer').doc(this.id).valueChanges()
    .subscribe(userBuyer => {
      // console.log(userBuyer)
      this.userBuyer = userBuyer;
      if(this.userBuyer != undefined){
        if(this.userBuyer.profileImg.imgUrl == null){
          this.imgShow = './assets/img/profile-icon-BG.svg';
        }
        else{
          this.imgShow = this.userBuyer.profileImg.imgUrl;
        }
        if(this.userBuyer.hideDisplayName){
          var name = '';
          for (var i = 0; i < 4; i++) {
            name = name + this.userBuyer.displayName[i];
          }
          this.showDisplayName = name + '****';
        }
        else{
          this.showDisplayName = this.userBuyer.displayName
        }
        this.showContent = true;
      }
      else{
        this.imgShow = './assets/img/profile-icon-BG.svg';
        this.showDisplayName = 'เข้าสู่ระบบ';
        this.showContent = true;
      }
    })
  }

  gotoProfileSettingsList(){
    this.router.navigate([`/profile-settings-list`]);
  }

  gotoSettingsAddressList(){
    this.router.navigate([`/settings-address-list`]);
  }

  gotoProfileImgSettings(){
    this.router.navigate([`/profile-settings-profileimg`]);
  }

}
