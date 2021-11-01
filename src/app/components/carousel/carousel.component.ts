import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  
  public $: any;

  constructor() { }

  ngOnInit(): void {
    $(document).ready(function() {
      $('.carousel').carousel();
   })
  }

}
