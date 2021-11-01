import { Component, OnInit } from '@angular/core';
// FIREBASE
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help-center-detail',
  templateUrl: './help-center-detail.component.html',
  styleUrls: ['./help-center-detail.component.css']
})
export class HelpCenterDetailComponent implements OnInit {

  public id
  public showContent = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public firestore: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
  ) { 
    // SUBSCRIBE ROUTER URL FOR LINK FOOTER
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if(this.id){
      console.log(this.id)
      this.showContent = true;
    }
    else{
      this.router.navigate(['help-center-list'])
    }
  }

}
