import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-items',
  templateUrl: './payment-items.component.html',
  styleUrls: ['./payment-items.component.css']
})
export class PaymentItemsComponent implements OnInit {
  
  public PaymentMethod = true;
  public SelectCard = false;

  constructor() { }

  ngOnInit(): void {
  }

  submitCard() {
    this.PaymentMethod = false;
    this.SelectCard = true;
  }
  
}
