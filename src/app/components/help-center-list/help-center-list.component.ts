import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help-center-list',
  templateUrl: './help-center-list.component.html',
  styleUrls: ['./help-center-list.component.css']
})
export class HelpCenterListComponent implements OnInit {

  constructor(
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }
  
  helpCenterDetail(helpCenterKey){
    this.router.navigate([`/help-center-detail/${helpCenterKey}`])
  }

  searchBtn(keyNameSearchInput){
    
  }
}
