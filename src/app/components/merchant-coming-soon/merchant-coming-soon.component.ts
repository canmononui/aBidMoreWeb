import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-coming-soon',
  templateUrl: './merchant-coming-soon.component.html',
  styleUrls: ['./merchant-coming-soon.component.css']
})
export class MerchantComingSoonComponent implements OnInit {

  constructor(
    public router: Router,  
    public storage: AngularFireStorage,
    public auth: AuthService,
  ) { 
  }

  ngOnInit(): void {
  }

  gotoHome(){
    this.router.navigate(['/'])
  }

}
