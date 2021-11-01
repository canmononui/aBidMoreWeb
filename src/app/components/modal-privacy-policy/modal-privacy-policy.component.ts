import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-modal-privacy-policy',
  templateUrl: './modal-privacy-policy.component.html',
  styleUrls: ['./modal-privacy-policy.component.css']
})
export class ModalPrivacyPolicyComponent implements OnInit {

  public showPrivacyPolicy = false;

  constructor(
    public auth: AuthService,
    public router: Router,
    public firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    // SUBSCRIBE ROUTER URL FOR PAUSE TIMER
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        var _path = val.url.split("/", 3);
        // console.log(_path)
        if(_path[1] == "signup" || _path[1] == "signin" || _path[1] == "check-email-verify" || _path[1] == "update-user-buyer"){
          this.showPrivacyPolicy = false;
        }
        else{
          // GET LOCALSTORAGE
          var localIns = localStorage.getItem('privacyPolicyAt');
          if(localIns == 'true' || localIns == null){
            this.showPrivacyPolicy = true;
          }
          else{
            this.showPrivacyPolicy = false;
          }
        }
      }
    });
  }

  submit(){
    // console.log(this.auth.currentUserAnonymous,this.auth.currentUserId)
    if(this.auth.currentUserAnonymous){
      this.hidePrivacyPolicy();
    }
    else {
      // GET TIMESTAMP FROM FIREBASE
      var _timeStamp = firebase.firestore.Timestamp.now();
      // UPDATE PRIVACY POLICY AT (TIME) TO FIREBASE
      this.firestore.collection('user-buyer').doc(this.auth.currentUserId).update({
        'privacyPolicyAt': _timeStamp
      })
      .then(() => {
        this.hidePrivacyPolicy();
      })
    }
  }

  hidePrivacyPolicy(){
    // SET LOCALSTORAGE
    localStorage.setItem('privacyPolicyAt', 'false');
    // HIDE MODAL PRIVACY POLICY
    this.showPrivacyPolicy = false;
  }

}
