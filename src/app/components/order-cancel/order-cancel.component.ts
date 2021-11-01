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
  selector: 'app-order-cancel',
  templateUrl: './order-cancel.component.html',
  styleUrls: ['./order-cancel.component.css']
})
export class OrderCancelComponent implements OnInit {

  public id
  public order:any = [];

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
      .where('status', 'in', ['return', 'cancelBySeller', 'cancelByBuyer'] )
      .where('buyerUID', '==', this.id )
      .orderBy('createAt', 'desc')
      ).snapshotChanges()
        .map(actions => {
          return actions.map(action => ({ key: action.payload.doc.id, value: action.payload.doc.data() }));
        }).subscribe(items => {
          // console.log(items.length)
          if(items.length != 0){
            this.order = items;
          }
          else {
            this.order = [];
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
    this.router.navigate([`/order-cancel-description/${itemKey}`])
  }
  
  gotoBuyMenuList(){
    this.router.navigate([`/buyMenu-list`])
  }


}
