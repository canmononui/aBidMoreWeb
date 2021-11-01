import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transport-prepare-list',
  templateUrl: './transport-prepare-list.component.html',
  styleUrls: ['./transport-prepare-list.component.css']
})
export class TransportPrepareListComponent implements OnInit {

  public id
  public shippedList:any = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get("id");
this.id = this.auth.currentUserId;
    if(this.id){
      this.firestore.collection('order', ref => ref
      .where('status', '==', 'waiting-for-delivery' )
      .where('buyerUID', '==', this.id )
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(items => {
          // console.log(items.length)
          if(items.length != 0){
            this.shippedList = items;
          }
          else {
            this.shippedList = [];
          }
        })
    }
    else{
      // IS CAN'T GET ID (UID BUYER)
      this.router.navigate(['/'])
    }
  }

  gotoItem(itemKey){
    // THIS VERSION DISABLED
    // this.router.navigate([`/payment-confirm-description/${itemKey}`])
  }

  gotoBuyMenuList(){
    this.router.navigate([`/buyMenu-list`])
  }

}
