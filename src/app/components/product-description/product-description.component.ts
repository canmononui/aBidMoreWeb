import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})


export class ProductDescriptionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {


  }

  test() {
    console.log("Test");
  }

  heart() {
    console.log("heart");
  }

  dot() {
    console.log("dot");
  }

  left() {
    console.log("<-");
  }

  right() {
    console.log("->");
  }

  pic() {
    console.log("pic");
  }

}
