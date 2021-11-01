import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-username',
  templateUrl: './settings-username.component.html',
  styleUrls: ['./settings-username.component.css']
})
export class SettingsUsernameComponent implements OnInit {

  public id;
  public userBuyer:any;
  public showContent = false;
  public userNameLength:number = 0;
  public displayName = '';
  public displayNameErr = false;
  
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
    this.firestore.collection('user-buyer').doc(this.id).get().toPromise()
    .then(userBuyer => {
      // console.log(userBuyer.data())
      if(userBuyer.data() != undefined){
        this.userBuyer = userBuyer.data();
        if(this.userBuyer.displayName != null){
          this.userNameLength = this.userBuyer.displayName.length;
        }
        else{
          this.userNameLength = 0;
        }
      }
      this.showContent = true
    })
  }

  usernameInput($event): void {
    this.userNameLength = Number($event.target.value.length)
    this.firestore.collection('user-buyer', ref => ref
    .where('displayName', '==', $event.target.value))
    .get().toPromise()
    .then((userList) => {
      if(userList.size != 0 && userList.docs[0].id != this.id){
        // NOT OK
        this.displayNameErr = true;
      }
      else {
        // OK 
        this.displayNameErr = false;
      }
    })
  }

  submitUsername(displayNameInput){
    if(displayNameInput != this.userBuyer.displayName){
      this.firestore.collection('user-buyer').doc(this.id).update({
        displayName: displayNameInput
      })
      .then((doc) => {
        this.router.navigate([`/profile-settings-list`]);
      })
    }
  }

}
