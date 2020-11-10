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
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { AuctionListComponent } from './components/auction-list/auction-list.component';
import { LikeListComponent } from './components/like-list/like-list.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { FollowingListComponent } from './components/following-list/following-list.component';
import { ShopDescriptionComponent } from './components/shop-description/shop-description.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileSettingsListComponent } from './components/profile-settings-list/profile-settings-list.component';
import { SettingsNameComponent } from './components/settings-name/settings-name.component';
import { SettingsLastnameComponent } from './components/settings-lastname/settings-lastname.component';
import { SettingsUsernameComponent } from './components/settings-username/settings-username.component';
import { SettingsPhonenumberComponent } from './components/settings-phonenumber/settings-phonenumber.component';
import { SettingsEmailComponent } from './components/settings-email/settings-email.component';
import { AddressSettingsListComponent } from './components/address-settings-list/address-settings-list.component';
import { CardSettingsListComponent } from './components/card-settings-list/card-settings-list.component';
import { WalletCreditComponent } from './components/wallet-credit/wallet-credit.component';
import { BuyMenuListComponent } from './components/buy-menu-list/buy-menu-list.component';
import { PaymentItemsComponent } from './components/payment-items/payment-items.component';
import { PaymentTotalComponent } from './components/payment-total/payment-total.component';
import { PaymentConfirmListComponent } from './components/payment-confirm-list/payment-confirm-list.component';
import { PaymentConfirmDescriptionComponent } from './components/payment-confirm-description/payment-confirm-description.component';
import { TransportPrepareListComponent } from './components/transport-prepare-list/transport-prepare-list.component';
import { TransportListComponent } from './components/transport-list/transport-list.component';
import { TransportDescriptionComponent } from './components/transport-description/transport-description.component';
import { TransportSuccessListComponent } from './components/transport-success-list/transport-success-list.component';
import { TransportSuccessDescriptionComponent } from './components/transport-success-description/transport-success-description.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { OrderReturnComponent } from './components/order-return/order-return.component';
import { OrderCancelComponent } from './components/order-cancel/order-cancel.component';
import { OrderCancelDescriptionComponent } from './components/order-cancel-description/order-cancel-description.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CarouselComponent,
    TestComponent,
    ProductDescriptionComponent,
    FooterComponent,
    SearchComponent,
    AuctionListComponent,
    LikeListComponent,
    ChatListComponent,
    ChatMessageComponent,
    NotificationListComponent,
    PromotionListComponent,
    FollowingListComponent,
    ShopDescriptionComponent,
    ProfileSettingsComponent,
    ProfileSettingsListComponent,
    SettingsNameComponent,
    SettingsLastnameComponent,
    SettingsUsernameComponent,
    SettingsPhonenumberComponent,
    SettingsEmailComponent,
    AddressSettingsListComponent,
    CardSettingsListComponent,
    WalletCreditComponent,
    BuyMenuListComponent,
    PaymentItemsComponent,
    PaymentTotalComponent,
    PaymentConfirmListComponent,
    PaymentConfirmDescriptionComponent,
    TransportPrepareListComponent,
    TransportListComponent,
    TransportDescriptionComponent,
    TransportSuccessListComponent,
    TransportSuccessDescriptionComponent,
    OrderConfirmComponent,
    OrderReturnComponent,
    OrderCancelComponent,
    OrderCancelDescriptionComponent
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
