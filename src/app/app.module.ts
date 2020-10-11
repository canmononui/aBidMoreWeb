import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TestComponent } from './components/test/test.component';
import { ProductDescriptionComponent } from './components/product-description/product-description.component';
// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CarouselComponent,
    TestComponent,
    ProductDescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     // Specify ng-circle-progress as an import
     // set defaults here
     NgCircleProgressModule.forRoot({
     "backgroundPadding": 7,
     "radius": 60,
     "space": -2,
     "outerStrokeWidth": 2,
     "outerStrokeColor": "#808080",
     "innerStrokeColor": "#e7e8ea",
     "innerStrokeWidth": 2,
     "title": [
               "working",
               "in",
               "progress"
     ],
     "animateTitle": false,
     "animationDuration": 1000,
     "showTitle": true,
     "showUnits": false,
     "showSubtitle": false,
     "showInnerStroke": false,
     "responsive": true,
     "startFromZero": false,
     "showZeroOuterStroke": false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
