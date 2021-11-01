import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public name : any = '';
  public lastname : any = '';
  public phone : any = '';
  public email : any = '';
  public checkEmail : any = false;
  public topic : any = '';
  public description : any = '';
  public text : any = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    public firestore: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.name = '';
  }

  gotoChatAdmin(){
    // members[`${this.chatToUID}`]
    this.firestore.collection('chat', ref => ref
    .where(`members.${this.auth.currentUserId}.uid`, '==', this.auth.currentUserId)
    .where(`members.${this.auth.currentUserId}.type`, '==', 'buyer')
    .where(`members.Gj4gFzpQDDO5wcoKIN0am2I1AgC2.uid`, '==', 'Gj4gFzpQDDO5wcoKIN0am2I1AgC2')
    ).get().toPromise()
    .then((val) => {
      console.log(val)
      if(val.size != 0){
        // OLD CHAT
        // GO TO CHAT ADMIN
        this.router.navigate([`/chat-message/${val.docs[0].id}&Gj4gFzpQDDO5wcoKIN0am2I1AgC2&A Bid More (Admin)`]);
      }
      else{
        // NEW CHAT 
        // GO TO CHAT ADMIN
        this.router.navigate([`/chat-message/null&Gj4gFzpQDDO5wcoKIN0am2I1AgC2&A Bid More (Admin)`]);
      }
    })
  }

  nameInput(nameInput) {
    this.name = nameInput.target.value;
  }

  lastNameInput(lastNameInput){
    this.lastname = lastNameInput.target.value;
  }

  phoneInput(phoneInput){
    this.phone = phoneInput.target.value;
  }

  emailInput(emailInput){
    this.email = emailInput.target.value;
    if(this.email == ''){
      this.checkEmail = false;
    }
    else{
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const emailCheck = re.test(this.email);
      // console.log(emailCheck)
      if(emailCheck) {
        this.checkEmail = false;
      }
      else{
        this.checkEmail = true;
      }
    }
  }

  topicInput(topicInput){
    this.topic = topicInput.target.value;
  }

  descriptionInput(descriptionInput){
    this.description = descriptionInput.target.value;
  }

  sendEmail(){
    this.text = "mailto:support@abidmore.com?Subject=สอบถามข้อมูล&body=หัวข้อที่ต้องการติดต่อ : " + this.topic + "%0D%0Aรายละเอียด : " + this.description + "%0D%0A%0D%0Aผู้ติดต่อ : " + this.name + " " + this.lastname + "%0D%0AEmail : " + this.email;
  }

  okSendEmail(){
    window.location.href = this.text;
  }

}
