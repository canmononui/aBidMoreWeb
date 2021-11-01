import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-settings-list',
  templateUrl: './profile-settings-list.component.html',
  styleUrls: ['./profile-settings-list.component.css']
})
export class ProfileSettingsListComponent implements OnInit {
  
  public id;
  public userBuyer:any;
  public showContent = false;
  public showDisplayName = '';
  public showPhoneNumber = '';

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
      // console.log(userBuyer.data())
      this.userBuyer = userBuyer;
      if(this.userBuyer != undefined){
        if(this.userBuyer.profileImg.imgUrl == null){
          this.userBuyer.profileImg.imgUrl = './assets/img/profile-icon-BG.svg';
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
        if(this.userBuyer.name == null){
          this.userBuyer.name = '-';
        }
        if(this.userBuyer.lastName == null){
          this.userBuyer.lastName = '-';
        }
        if(this.userBuyer.phoneNumber != null){
          this.showPhoneNumber = '******' + this.userBuyer.phoneNumber[6] + this.userBuyer.phoneNumber[7] + this.userBuyer.phoneNumber[8] + this.userBuyer.phoneNumber[9];
        }
        else{
          this.showPhoneNumber = '-'
        }
        this.showContent = true;
      }
      else{
        this.showDisplayName = 'เข้าสู่ระบบ';
        this.showPhoneNumber = '-'
        this.showContent = true;
      }
    })
  }

  hideSubmit(){
    // console.log(this.userBuyer.hideDisplayName)
    if(this.userBuyer.hideDisplayName){
      this.firestore.collection('user-buyer').doc(this.id).update({
        hideDisplayName: false
      })
    }
    else{
      this.firestore.collection('user-buyer').doc(this.id).update({
        hideDisplayName: true
      })
    }
  }

  // gotoProfileSettingsUsername(){
  //   this.router.navigate([`/profile-settings-username/${this.id}`]);
  // }

  // gotoProfileSettingsName(){
  //   this.router.navigate([`/profile-settings-name/${this.id}`]);
  // }

  // gotoProfileSettingsLastname(){
  //   this.router.navigate([`/profile-settings-lastname/${this.id}`]);
  // }

  // gotoProfileSettingsRefcode(){
  //   this.router.navigate([`/profile-settings-refcode`]);
  // }

  copyYourRefCode(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.userBuyer.yourRefCode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  copyLinkYourRefCode(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = 'https://abidmore.com/' + this.userBuyer.yourRefCode;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
