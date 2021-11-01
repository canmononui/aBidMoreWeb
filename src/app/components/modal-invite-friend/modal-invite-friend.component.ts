import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modal-invite-friend',
  templateUrl: './modal-invite-friend.component.html',
  styleUrls: ['./modal-invite-friend.component.css']
})
export class ModalInviteFriendComponent implements OnInit {

  public link = 'www.abidmore.com';

  constructor(
    public firestore: AngularFirestore,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  copyLink(){
    this.firestore.collection('user-buyer').doc(this.auth.currentUserId).get().toPromise()
    .then(userBuyer => {
      var _userBuyer:any = userBuyer.data();
      if(_userBuyer != undefined){
        var textField = document.createElement('textarea');
        textField.style.position = 'fixed';
        textField.style.left = '0';
        textField.style.top = '0';
        textField.style.opacity = '0';
        textField.innerText = 'https://abidmore.com/' + _userBuyer.yourRefCode;
        document.body.appendChild(textField);
        textField.select();
        textField.focus();
        document.execCommand('copy');
        textField.remove();
      }
    })
  }

}
