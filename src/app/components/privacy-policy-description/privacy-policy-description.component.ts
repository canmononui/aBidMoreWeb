import { Component, OnInit } from '@angular/core';
import { AngularFirestore  } from '@angular/fire/firestore';

@Component({
  selector: 'app-privacy-policy-description',
  templateUrl: './privacy-policy-description.component.html',
  styleUrls: ['./privacy-policy-description.component.css']
})
export class PrivacyPolicyDescriptionComponent implements OnInit {
  public showContent = false;
  public contract:any;

  constructor(
    public firestore: AngularFirestore, 
  ) { }

  ngOnInit(): void {
    this.firestore.collection('contract-buyer').doc('m14XElMtM6D2KT8zyTzE').get().toPromise()
  .then((val) => {
    this.showContent = true
    this.contract = val.data();
  })
  }

}
