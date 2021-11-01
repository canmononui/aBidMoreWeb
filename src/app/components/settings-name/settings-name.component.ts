import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-name',
  templateUrl: './settings-name.component.html',
  styleUrls: ['./settings-name.component.css']
})
export class SettingsNameComponent implements OnInit {

  public id;
  public userBuyer:any;
  public showContent = false;

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
      }
      this.showContent = true
    })
  }

  submitName(nameInput){
    if(nameInput != this.userBuyer.name){
      this.firestore.collection('user-buyer').doc(this.id).update({
        name: nameInput
      })
      .then((doc) => {
        this.router.navigate([`/profile-settings-list`]);
      })
    }
  }

}
